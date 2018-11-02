import Vue from 'vue/dist/vue.esm'
import VueYoutube from 'vue-youtube'
import Playlist from '../components/playlist.vue'
import Login from '../components/login.vue'


var actioncable_methods;

actioncable_methods = {
  connected(){ return console.log('Connected!')},
  disconnected(){},
  received(data){
    return App.vue.receiveNewSong(data);
  },
  send_song(playlist_id, title, idVideo) {
    return this.perform('send_song', {
      playlist_id: playlist_id,
      title: title,
      video_id: idVideo
    })
  }
}

Vue.use(VueYoutube)
document.addEventListener('DOMContentLoaded', () => {
    App.chat = App.cable.subscriptions.create({
      channel: "SongChannel"
    }, actioncable_methods);
  
    App.vue = new Vue({
    el: '#app',
    components: {
      Playlist,
      Login
    },
    mounted () {
      this.session = this.validateToken(localStorage.getItem('user-token'))
    },
    created(){
      this.getPlaylist()
    },
    data () {
      return {
        session: false,
        query: '',
        title: '',
        videos: [],
        modalvideo: '',
        idVideo: '',
        tokenNextPage: '',
        tokenPrevPage: '',
        playlists: [],
        currentPlaylistId: '',
        saveSong: '',
        currentPlaylist: '',
        playlistSongs: [],
        newPlaylistName: '',
        alertMsg: '',
        alertClass: '',
        ishidden: false,
        username: ''
      }
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
      next () {
        this.search(this.tokenNextPage)
      },
      prev () {
        this.search(this.tokenPrevPage)
      },
      showModal (video) {
        this.title = video.snippet.title
        this.idVideo = video.id.videoId
        this.modalvideo = "https://www.youtube.com/embed/" + video.id.videoId + "?autoplay=1&showinfo=0"
      },
      toogleModal (){
        this.modalvideo = ''
        this.alertClass = ''
        this.alertMsg   = ''
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
      sendSong(){
        App.chat.send_song(this.saveSong, this.title, this.idVideo);
      },
      receiveNewSong(data) {
        if (this.currentPlaylistId == data.playlist_id){
          this.playlistSongs.push(data)
        }
      },
      savePlaylistSong() {
        fetch('/playlists/'+this.saveSong+'/songs', {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem('user-token')
          },
          body: JSON.stringify({ song: {title: this.title, video_id: this.idVideo} }),
        })
        .then(response => { this.HandleResponse(response) })
      },
      HandleResponse(response) {
        switch(response.status){
          case 422:
            this.alertMsg = "Song already exists in playlist!"
            this.alertClass = "alert-danger"
            break;
          case 201:
            this.alertMsg = "Your song has been added!"
            this.alertClass = "alert-success"
            this.sendSong()
            break;
          case 401:
            this.alertMsg = "You need to be registered!"
            this.alertClass = "alert-warning"
            break;
          default:
            this.alertMsg = "Something went wrong!"
            this.alertClass = "alert-danger"  
        }
        return response.json()
      },
      savePlaylist() {
        fetch('playlists', {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem('user-token')
          },
          body: JSON.stringify({ playlist: {name: this.newPlaylistName} }),
        })
        .then(response => response.json())
        .then(res => {
          this.getPlaylist()
          $('#modalplaylist').modal('toggle')
        })
      },
      logout () {
        window.location.reload()
        localStorage.removeItem('user-token')
      },
      validateToken(tokenSession){
        if (tokenSession !== null) {
          var base64Url = tokenSession.split('.')[1];
          var base64 = base64Url.replace('-', '+').replace('_', '/');
          const token = JSON.parse(window.atob(base64));
          if (token.exp <  Date.now()) {
            this.username = token.user.name;
            return true
          }
        }
        return false
      }
    }
  });
});
