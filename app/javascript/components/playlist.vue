<template>
  <div>
    <h4 @click="(playlistInfo.user_id == userId) ? (edit = true) : (edit = false)" v-show="edit == false">{{playlistInfo.name }}</h4>
    <button v-if="playlistInfo.id > 0 && playlistInfo.user_id == userId" class="btn-sm btn-danger" @click="confirmDeletePlaylist">
      <span class="glyphicon glyphicon-trash"></span>
    </button>
    <input v-if="edit == true" v-model="playlistInfo.name" @keyup.enter="edit = false, updatePlaylistName()" maxlength="25">
    <youtube v-if="ishidden" :player-vars="playervars" :video-id="video_id" @ended="ended" ref="youtube"></youtube>
    <ul class="list-group">
      <li :id="song.video_id" class="list-group-item" v-for="(song, index) in songs" :key="index">
        <span @click="ishidden = true, playVideo(song)">{{ song.title }}</span>
        <button v-if="(song.user_id == userId) || (playlistInfo.user_id == userId)" class="btn-sm btn-danger" @click="confirmDeleteSong(song, index)">
          <span class="glyphicon glyphicon-trash"></span>
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Playlist',
  props: ['playlistInfo', 'songs', 'userId'],
  data(){
    return {
      edit: false,
      ishidden: false,
      video_id: '',
      currentSong: {},
      currentSongId: '',
      playervars: {
        autoplay: 1
      }
    }
  },
  methods: {
    playVideo(song) {
      this.video_id = song.video_id + "?autoplay=1"
      this.currentSong = song
      this.player.playVideo()
    },
    ended(){
      let videoIndex = this.songs.indexOf(this.currentSong)
      let nextVideo = videoIndex + 1
      let song = this.songs[nextVideo > (this.songs.length - 1) ? 0 : nextVideo]
      this.currentSong = song
      this.video_id = song.video_id
      this.player.playVideo()
    },
    updatePlaylistName() {
      fetch('/playlists/'+ this.playlistInfo.id, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          "Authorization": localStorage.getItem('user-token')
        },
        body: JSON.stringify({ playlist: { name: this.playlistInfo.name} })
      })
      .then(response => response.json())
    },
    deleteSong(song) {
      fetch('/playlists/'+ this.playlistInfo.id + '/songs/' + song.id, {
        method: 'DELETE',
        headers: {
          "Authorization": localStorage.getItem('user-token')
        }
      })
      .then(res => {
        this.messageAlert(res)
      })
    },
    deletePlaylist() {
      fetch('/playlists/'+ this.playlistInfo.id, {
        method: 'DELETE',
        headers: {
          "Authorization": localStorage.getItem('user-token')
        }
      })
      .then(res => this.messageAlert(res))
      .then(res => window.location.reload())
    },
    messageAlert(res) {
      switch(res.status){
        case 401:
        alert("You don't have permissions for this action!");
        break;
        case 204:
        alert("Has been deleted!");
        break;
        default:
        alert("Something went wrong!")
      }
    },
    confirmDeletePlaylist() {
      var remove = confirm("Are you sure?");
      if (remove) {
        this.deletePlaylist()
      }
    },
    confirmDeleteSong(song, index) {
      var remove = confirm("Are you sure?");
      if (remove) {
        this.deleteSong(song)
        this.$emit('song-remove', index)
      }
    }
  },
  computed: {
    player () {
      return this.$refs.youtube.player
    }
  }
}
</script>
