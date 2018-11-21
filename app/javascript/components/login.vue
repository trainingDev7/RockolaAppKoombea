<template>
  <form @submit.prevent="loginForm"> 
    <label v-if="action == 'signup'">Name</label>
    <input v-if="action == 'signup'" required type="text" class="form-control" name="name" v-model="name"  placeholder="Example"><br>
    <label>Email</label>
    <input required type="email" class="form-control" name="email" v-model="email"  placeholder="Example@koombea.com"><br>
    <label>Password</label>
    <input required type="password" class="form-control" name="password" v-model="password" placeholder="Password"><br>
    <input class="btn btn-info" type="submit" value="Submit">
    <div><br>
      <span v-if="alertMsgLogin !== ''" class="alert" :class="alertClassLogin" role="alert">{{alertMsgLogin}}</span>
    </div>  
  </form>
</template>

<script>
export default {
  name: 'login',
  props: ['action'],
  data() {
    return {
      name: '',
      email: '',
      password: '',
      alertMsgLogin: '',
      alertClassLogin: ''
    }
  },
  methods: {
    loginForm(){  
      fetch(this.action,{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({user: {name: this.name, email: this.email, password: this.password} })
      })
      .then(response => this.HandleResponseLogin(response))
      .then(res => {
        if (res.auth_token) {
          localStorage.setItem('user-token', res.auth_token)
          window.location.reload()
        }  
      })
    },
    HandleResponseLogin(response) {
      switch(response.status){
        case 200:
          this.alertMsgLogin = "Success!"
          this.alertClassLogin = "alert-success"
          break;
        case 201:
          this.alertMsgLogin = "User created succesfully!"
          this.alertClassLogin = "alert-success"
          break;
        case 401:
          this.alertMsgLogin = "Invalid Credentials!"
          this.alertClassLogin = "alert-danger"
          break;
        case 422:
          this.alertMsgLogin = "Email has already been taken!"
          this.alertClassLogin = "alert-danger"
          break;
        default:
          this.alertMsgLogin = "Something went wrong!"
          this.alertClassLogin = "alert-danger"  
      }
      return response.json()
    }
  }
}
</script>



