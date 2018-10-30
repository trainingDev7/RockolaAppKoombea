<template>
  <div>
    <h4 @click="edit = true" v-show="edit == false">{{playlistInfo.name}}</h4>
    <input v-if="edit == true" v-model="playlistInfo.name" @keyup.enter="edit = false, updatePlaylistName">
    <youtube v-if="ishidden" :video-id="video_id" @ended="ended" ref="youtube"></youtube>
    <ul class="list-group">
      <li @click="ishidden = true, playVideo(song)" :id="song.video_id" class="list-group-item" v-for="song in songs" :key="song.id">{{ song.title }}
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
      currentSong: {}
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
    }
  },
  computed: {
    player () {
      return this.$refs.youtube.player
    }
  }
}
</script>
