<template>
  <div class="mx-auto" style="text-align: center;">
    <h1>Login</h1>
    <button class="btn btn-light-inline bg-success text-white" @click="login">Sign in with your @koombea.com account</button>
  </div>
</template>

<script>
  export default {
    name: 'GoogleButton',
    props: [],
    data () {
      return {
        query: '',
        user: {
          email: '',
          name: ''
        }
      }
    },
    methods: {
      login () {
        gapi.auth2.getAuthInstance().signIn()
        .then(googleUser => {
          this.user.email = googleUser.getBasicProfile().getEmail()
          this.user.name = googleUser.getBasicProfile().getName()
          this.authenticate()
        })
      },
      authenticate() {  
        fetch('authenticate', {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify({ user: this.user })
        })
        .then(response => response.json())
        .then(res => {
          console.log(res)
          if (res.auth_token) {
            localStorage.setItem('user-token', res.auth_token)
            this.$emit('success')
          }  
        })
      },
    },
    mounted () {
      var CLIENT_ID = '265564701561-12n8h3t7p1jtoijjpgjd9lfsmcljgckh.apps.googleusercontent.com';
      var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest"];
      var SCOPES = 'https://www.googleapis.com/auth/youtube.readonly';

      gapi.load('client:auth2', function () {
        gapi.client.init({
          discoveryDocs: DISCOVERY_DOCS,
          clientId: CLIENT_ID,
          scope: SCOPES
        }).then(function () {
          gapi.auth2.getAuthInstance().isSignedIn
        })
      });
    }
  }
</script>