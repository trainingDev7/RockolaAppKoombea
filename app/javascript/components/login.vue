<template>
  <div>
    <div class="modal fade" id="LoginModal">
      <div class="modal-dialog">
        <div class="modal-content">
        <div class="modal-body">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <form @submit.prevent="loginForm">
              <h3 class="text-center">Login</h3>
              <label>Email</label>
              <input required type="email" class="form-control" name="email" v-model="email"  placeholder="Example@koombea.com"><br>
              <label>Password</label>
              <input required type="password" class="form-control" name="password" v-model="password" placeholder="Password"><br>
              <input class="btn btn-info" type="submit" value="Login">  
              <div><br>
                <span v-if="alertMsgLogin !== ''" class="alert" :class="alertClassLogin" role="alert">{{alertMsgLogin}}</span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="registerModal">
      <div class="modal-dialog">
        <div class="modal-content">
        <div class="modal-body">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <form @submit.prevent="registerForm">
              <h3 class="text-center">Sign up</h3>
              <label>Name</label>
              <input required type="text" class="form-control" name="name" v-model="name"  placeholder="Example"><br>
              <label>Email</label>
              <input required type="email" class="form-control" name="email" v-model="email"  placeholder="Example@koombea.com"><br>
              <label>Password</label>
              <input required type="password" class="form-control" name="password" v-model="password" placeholder="Password"><br>
              <input class="btn btn-info" type="submit" value="Sign up">
              <div><br>
                <span v-if="alertMsgRegister !== ''" class="alert" :class="alertClassRegister" role="alert">{{alertMsgRegister}}</span>
              </div> 
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'login',
  data() {
    return {
      name: '',
      email: '',
      password: '',
      alertMsgLogin: '',
      alertClassLogin: '',
      alertMsgRegister: '',
      alertClassRegister: ''
    }
  },
  methods: {
    loginForm() {
      fetch('authenticate', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({email: this.email, password: this.password})
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
        case 401:
          this.alertMsgLogin = "Invalid Credentials!"
          this.alertClassLogin = "alert-danger"
          break;
        default:
          this.alertMsgLogin = "Something went wrong!"
          this.alertClassLogin = "alert-danger"  
      }
      return response.json()
    },
    registerForm(){
      fetch('signup',{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({user: {name: this.name, email: this.email, password: this.password} })
      })
      .then(response => this.HandleResponseRegister(response))
      .then(res => {
        if (res.auth_token) {
          localStorage.setItem('user-token', res.auth_token)  
          window.location.reload()
        }  
      })
    },
     HandleResponseRegister(response) {
      switch(response.status){
        case 201:
          this.alertMsgRegister = "Success!"
          this.alertClassRegister = "alert-success"
          break;
        case 422:
          this.alertMsgRegister = "Email has already been taken!"
          this.alertClassRegister = "alert-danger"
          break;
        default:
          this.alertMsgRegister = "Something went wrong!"
          this.alertClassRegister = "alert-danger"  
      }
      return response.json()
    }
  }
}
</script>



