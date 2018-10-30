import Vue from 'vue/dist/vue.esm'
import VueYoutube from 'vue-youtube'
import Playlist from '../components/playlist.vue'
import Login from '../components/login.vue'

Vue.use(VueYoutube)
document.addEventListener('DOMContentLoaded', () => {
  const app = new Vue({
    el: '#app',
    created(){
      this.getPlaylist()
    },
    data () {
      return {
        query: '',
        video: '',
        title: '',
        videos: [],
        modalvideo: '',
        idVideo: '',
        tokenNextPage: '',
        tokenPrevPage: '',
        ishidden: false,
        playlists: [],
        currentPlaylistId: '',
        currentPlaylistIdSelect: '',
        currentPlaylist: '',
        playlistSongs: [],
        newPlaylistName: ''
      }
    },
    components: {
      Playlist,
      Login
    },
    methods: {
      search (token) {
        var optionsQuery = {
          part: 'snippet, id',
          type: 'video',
          maxResults: '10',
          q: this.query
        };

        var request = gapi.client.youtube.search.list(token.length > 0 ? $.extend(optionsQuery, {pageToken: token}) : optionsQuery)

        request.execute((response) => {
          this.tokenPrevPage = response.prevPageToken;
          this.tokenNextPage = response.nextPageToken;
          this.videos = response.items
        });
      },
      next (video) {
        this.search(this.tokenNextPage)
      },
      prev (video) {
        this.search(this.tokenPrevPage)
      },
      showModal (video) {
        this.title = video.snippet.title
        this.idVideo = video.id.videoId
        this.modalvideo = "https://www.youtube.com/embed/" + video.id.videoId + "?autoplay=1&showinfo=0"
      },
      toogleModal (){
        this.modalvideo = ''
      },
      getPlaylist(){
        fetch('/playlists/')
        .then(response => response.json())
        .then(res => this.playlists = res)
      },
      setCurrentPlaylist(){
        this.currentPlaylist = this.playlists.filter(p => p.id == this.currentPlaylistId)[0]
        fetch('/playlists/'+this.currentPlaylistId+'/songs')
        .then(response => response.json())
        .then(res => this.playlistSongs = res)
      },
      savePlaylistSong() {
        fetch('/playlists/'+this.currentPlaylistIdSelect+'/songs', {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem('user-token')
          },
          body: JSON.stringify({title: this.title, video_id: this.idVideo, user_id: 1}),
        })
        .then(response => response.json())
        .catch(error => {
          alert('Not Authorized')
        })
      },
      savePlaylist() {
        fetch('playlists', {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem('user-token')
          },
          body: JSON.stringify({name: this.newPlaylistName}),
        })
        .then(response => response.json())
        .then(res => {
          this.getPlaylist()
          $('#modalplaylist').modal('toggle')
        })
      }
    }
  });
});
