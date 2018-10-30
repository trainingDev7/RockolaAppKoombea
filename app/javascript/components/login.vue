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
              <input type="button" @click="logout" class="btn btn-light" value="Logoutt">  
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
        password: ''
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
      .then(response => response.json())
      .then(res => {
        localStorage.setItem('user-token', res.auth_token)
        alert('¡You are logged!')
        $('#LoginModal').modal('toggle')
      })
    },
    registerForm(){
      fetch('signup',{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({user: {name: this.name, email: this.email, password: this.password} })
      })
      .then(response => response.json())
      .then(res => {
        localStorage.setItem('user-token', res.auth_token)
        alert('¡You are registered!')
        $('#registerModal').modal('toggle')  
      })
    },
    logout () {
      localStorage.removeItem('user-token')
      $('#LoginModal').modal('toggle')
    }
  }
}
</script>



