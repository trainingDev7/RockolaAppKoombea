<template>
  <div>
    <h4 @click="(playlistInfo.user_id == userId) ? (edit = true) : (edit = false)" v-show="edit == false">{{playlistInfo.name }}</h4>
    <button v-if="playlistInfo.id > 0 && playlistInfo.user_id == userId" class="btn-sm btn-danger" @click="active = true">
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
    <div>
      <my-modal @close="active = false" v-if="active">
        <span slot="header">
          <h5>Are you sure?</h5>
        </span>
        <span slot="body">          
          <b-button @click="active = false">Cancel</b-button>
          <b-button @click="deletePlaylist">Ok</b-button>
        </span>
      </my-modal>
  </div>
    
  </div>
</template>

<script>
import myModal  from '../components/my-modal.vue'
export default {
  name: 'Playlist',
  props: ['playlistInfo', 'songs', 'userId'],
  components: { myModal },
  data(){
    return {
      edit: false,
      ishidden: false,
      video_id: '',
      currentSong: {},
      currentSongId: '',
      active: false,
      playervars: {
        autoplay: 1
      }
    }
  },
  methods: {
    onConfirm () {
      this.value = 'Agreed'
		},
   
    playVideo(song) {
      this.video_id = song.video_id
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
        // alert("Has been deleted!");
        break;
        default:
        alert("Something went wrong!")
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
