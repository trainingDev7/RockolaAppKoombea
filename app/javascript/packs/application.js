import Vue from 'vue/dist/vue.esm'
import VueYoutube from 'vue-youtube'
import Playlist from '../components/playlist.vue'
import Login from '../components/login.vue'
import VideoList from '../components/videoList.vue'
import BootstrapVue from 'bootstrap-vue'
import myModal from '../components/my-modal.vue'

Vue.use(BootstrapVue)
Vue.use(VueYoutube)

var actioncable_methods;
actioncable_methods = {
  connected(){ return console.log('Connected!')},
  disconnected(){},
  received(data){
    App.vue.webNotification(data)
    App.vue.receiveNewSong(data)
  },
  send_song(songs, playlist, user_name) {
    return this.perform('send_song', {
      songs: songs,
      playlist_id: playlist,
      user_name: user_name
    })
  }
}

document.addEventListener('DOMContentLoaded', () => {
    App.realtime = App.cable.subscriptions.create({
      channel: "SongChannel"
    }, actioncable_methods);
  
    App.vue = new Vue({
    el: '#app',
    components: {
      Playlist,
      Login,
      VideoList,
      myModal
    },
    mounted () {
      this.session = this.validateToken(localStorage.getItem('user-token'))
    },
    created(){
      this.getPlaylistByUser()
    },
    data () {
      return {
        session: false,
        query: '',
        title: '',
        tokenNextPage: '',
        tokenPrevPage: '',
        idPlaylist: '',
        currentPlaylist: {},
        newPlaylistName: '',
        alertMsg: '',
        alertClass: '',
        playlistsUser: [],
        videos: [],
        playlistSongs: [],
        user: {
          id: '',
          name: ''
        },
        currentVideo: {
          id: '',
          url: '',
          title: ''
        },
        isModal: false,
        modalplaylist: false,
        loginModal: false,
        loginAction: 'signup',
        webNotify: '',
        playlistQueued: []
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
      showModal(video) {
        this.isModal = true
        this.currentVideo.title = video.snippet.title
        this.currentVideo.id = video.id.videoId
        this.currentVideo.url = "https://www.youtube.com/embed/" + video.id.videoId + "?autoplay=1&showinfo=0"   
      },
      hideModal () {
        this.isModal = false
        this.currentVideo.url = ''
        this.alertClass = ''
        this.alertMsg   = ''
      },
      getPlaylistByUser(){
        fetch('/users/')
        .then(response => response.json())
        .then(res => this.playlistsUser = res)
      },
      getSongs () {
        fetch('/playlists/'+this.currentPlaylist.id+'/songs')
        .then(response => response.json())
        .then(res => this.playlistSongs = res)
      },
      sendSong(response){
        App.realtime.send_song(response.songs, response.playlist, this.user.name);
      },
      removeSong(index) {
        Vue.delete(this.playlistSongs, index)
      },
      addSongQueued(){
        var video = this.currentVideo.id
        var exists = false
        exists = this.playlistQueued.find(function(object) {
          return (object.video_id == video) ? true : false;
        })
        if (!exists) {
          this.playlistQueued.push({ video_id: this.currentVideo.id, title: this.currentVideo.title, user_id: this.user.id })
        }
      },
      removeSongQueued(index){
        Vue.delete(this.playlistQueued, index)
      },
      receiveNewSong(data) {
        if (this.currentPlaylist.id == data.playlist_id){
          var songsInPlaylist = []
          data.songs.forEach(function (song) {
            songsInPlaylist.push(song)
          })
          this.playlistSongs = this.playlistSongs.concat(songsInPlaylist)
        }
      },
      webNotification(data) {
        console.log(data)
        debugger
        if (this.currentPlaylist.id == data.playlist_id){
          if (data.songs.length == 1) {
            this.webNotify = data.user_name + " has added: " + data.songs[0].title
          } else {
            this.webNotify = data.user_name + " has added: " + data.songs.length + " song(s)"
          }
          this.timeOutNotify()
        }
      },
      toggleWebNotification(){
        this.webNotify = ''
      },
      savePlaylistSong() {
        fetch('/playlists/'+this.idPlaylist+'/songs', {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem('user-token')
          },
          body: JSON.stringify({ song: { songs: this.playlistQueued } }),
        })
        .then(response => this.HandleResponse(response) )
        .then(res => {
          if (res.message) {
            this.sendSong(res)
          }
        })
      },
      HandleResponse(response) {
        switch(response.status){
          case 201:
            this.alertMsg = "Songs were saved correctly!"
            this.alertClass = "alert-success"
            break;
          case 207:
            this.alertMsg = "Some songs were not saved correctly!"
            this.alertClass = "alert-warning"
            break;
          case 401:
            this.alertMsg = "You need to be registered!"
            this.alertClass = "alert-warning"
            break;
          case 422:
            this.alertMsg = "Songs already exist in the playlist!"
            this.alertClass = "alert-danger"
            break;
          default:
            this.alertMsg = "Something went wrong!"
            this.alertClass = "alert-danger"
        }
        setTimeout(() => {
          this.alertMsg = ''
        }, 5000);
        return response.json()
      },
      savePlaylist() {
        fetch('playlists', {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem('user-token')
          },
          body: JSON.stringify({ playlist: { name: this.newPlaylistName } }),
        })
        .then(response => response.json())
        .then(res => {
          this.getPlaylistByUser()
        })
      },
      logout () {
        localStorage.removeItem('user-token')
        window.location.reload()
      },
      validateToken(tokenSession){
        if (tokenSession !== null) {
          var base64Url = tokenSession.split('.')[1];
          var base64 = base64Url.replace('-', '+').replace('_', '/');
          const token = JSON.parse(window.atob(base64));
          if (token.exp <  Date.now()) {
            this.user.name = token.user.name;
            this.user.id = token.user.id;
            return true
          } else { 
            this.logout()
          }
        }
        return false
      },
      timeOutNotify(){
        setTimeout(() => {
          this.webNotify = ''
        }, 10000);
      }
    }
  });
});
