<template>
  <div>
    <h4 @click="edit = true" v-show="edit == false">{{playlistInfo.name}}</h4>
    <button v-if="playlistInfo.id > 0" class="btn-sm btn-danger" @click="deletePlaylist">
      <span class="glyphicon glyphicon-trash"></span>
    </button>
    <input v-if="edit == true" v-model="playlistInfo.name" @keyup.enter="edit = false, updatePlaylistName()">
    <youtube v-if="ishidden" :video-id="video_id" @ended="ended" ref="youtube"></youtube>
    <ul class="list-group">
      <li :id="song.video_id" class="list-group-item" v-for="song in songs" :key="song.id">
        <span @click="ishidden = true, playVideo(song)">{{ song.title }}</span>
        <button class="btn-sm btn-danger" @click="deleteSong(song)">
          <span class="glyphicon glyphicon-trash"></span>
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Playlist',
  props: ['playlistInfo', 'songs'],
  data(){
    return {
      edit: false,
      ishidden: false,
      video_id: '',
      currentSong: {},
      currentSongId: '',
      songId: ''
    }
  },
  methods: {
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
      .then(res => alert('The song has been deleted'))
    },
    deletePlaylist() {
      fetch('/playlists/'+ this.playlistInfo.id, {
        method: 'DELETE',
        headers: {
          "Authorization": localStorage.getItem('user-token')
        }
      })
      .then(res => alert('The playlist has been deleted'))
    }
  },
  computed: {
    player () {
      return this.$refs.youtube.player
    }
  }
}
</script>
