import Vue from 'vue/dist/vue.esm'
import VueYoutube from 'vue-youtube'
import Playlist from '../components/playlist.vue'
import VideoList from '../components/videoList.vue'
import BootstrapVue from 'bootstrap-vue'
import myModal from '../components/my-modal.vue'
import GoogleButton from '../components/google-button.vue'

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
  send_song(id, playlist_id, title, idVideo, userId, user_name) {
    return this.perform('send_song', {
      id: id,
      playlist_id: playlist_id,
      title: title,
      video_id: idVideo,
      user_id: userId,
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
      VideoList,
      myModal,
      GoogleButton
    },
    mounted () {
      this.validateToken()
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
        currentPlaylist: '',
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
        loginModal: false,
        modalNewPlaylist: false,
        loginAction: 'signup',
        webNotify: ''
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
        this.modalNewPlaylist = false
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
        App.realtime.send_song(response.id, this.idPlaylist, this.currentVideo.title, this.currentVideo.id, this.user.id, this.user.name);
      },
      removeSong(index) {
        Vue.delete(this.playlistSongs, index)
      },
      receiveNewSong(data) {
        if (this.currentPlaylist.id == data.playlist_id){
          this.playlistSongs.push(data)
        }
      },
      webNotification(data) {
        if (this.currentPlaylist.id == data.playlist_id){
          this.webNotify = data.user_name+" added a song: "+"'"+data.title+"'"
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
          body: JSON.stringify({ song: { title: this.currentVideo.title, video_id: this.currentVideo.id } }),
        })
        .then(response => this.HandleResponse(response) )
        .then(res => {
          if (res.title) {
            this.sendSong(res)
          }
        })
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
          body: JSON.stringify({ playlist: { name: this.newPlaylistName } }),
        })
        .then(response => response.json())
        .then(res => {
          this.getPlaylistByUser()
          this.modalNewPlaylist = false
          this.newPlaylistName = ''
        })
      },
      logout () {
        localStorage.removeItem('user-token')
        gapi.auth2.getAuthInstance().signOut();
        this.session = false
      },
      validateToken() {
        console.log('validating token...')
        var tokenSession = localStorage.getItem('user-token')

        if (tokenSession !== null) {
          var base64Url = tokenSession.split('.')[1];
          var base64 = base64Url.replace('-', '+').replace('_', '/');
          const token = JSON.parse(window.atob(base64));

          if (token.exp <  Date.now()) {
            this.user.name = token.user.name;
            this.user.id = token.user.id;
            this.session = true
          } else { 
            this.logout()
          }
        }
      }
    }
  });
});
