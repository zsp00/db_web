<template>
    <div ref="content">
      <canvas ref="background" class="background"></canvas>
      <div class="login">
        <div class="logo"></div>
        <div style="margin-top: 15px;">
          <el-input :autofocus="true" placeholder="请输入用户名" v-model="loginData.username"></el-input>
        </div>
        <div style="margin-top: 15px;">
          <el-input placeholder="请输入密码" type="password" v-model="loginData.password"></el-input>
        </div>
        <div style="margin-top: 15px;">
          <el-checkbox v-model="loginData.remember">记住我</el-checkbox>
        </div>
        <div style="margin-top: 15px;">
          <el-button type="primary" class="login-btn" :loading="loging" @click="_login">登陆</el-button>
        </div>
      </div>
      <div class="car"></div>
    </div>
</template>

<script>
// import particlesJS from 'particlesjs'
import {login} from 'api/public.js'
import {ERR_OK} from 'api/config.js'
export default {
  data () {
    return {
      loginData: {
        username: null,
        password: null,
        remember: false
      },
      loging: false
    }
  },
  mounted () {
    // particlesJS.init({
    //   selector: '.background',
    //   color: '#024b9f',
    //   speed: 0.5
    // })
    document.onkeyup = (e) => {
      var code = e.charCode || e.keyCode
      if (code === 13) {
        this._login()
      }
    }
  },
  methods: {
    _login () {
      this.loging = true
      let loginData = this.loginData
      login(loginData.username, loginData.password, loginData.remember).then((res) => {
        // console.log(loginData)
        if (res.data.code === ERR_OK) {
          this.$message.success('登录成功')
          this.$refs.content.removeChild(this.$refs.background)
          document.onkeyup = () => {}
          this.$emit('loginSuccess')
        } else {
          this.$message.error(res.data.msg)
        }
        this.loging = false
      }).catch(() => {
        this.loging = false
      })
    }
  }
}
</script>

<style>
.login{
    position: absolute;
    background: #ffffff;
    width:300px;
    left:50%;
    margin-left:-132px;
    top: 50%;
    margin-top:-137px;
    border:1px solid #ccc;
    padding:30px 30px 30px 30px;
    border-radius: 4px;
    z-index:2;
}
.car{
    position: absolute;
    background: #ffffff;
    width:500px;
    height:421px;
    background: url("../../assets/images/car.png");
    left:50%;
    margin-left:-532px;
    top: 50%;
    margin-top:-187px;
    z-index:1;
}
.login-btn{
  width:100%;
}
.background {
  position: absolute;
  display: block;
  background: url('../../assets/images/login-bg.jpg') bottom no-repeat transparent;
  background-size: cover;
  top: 0;
  left: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
}
.logo{
    background: url("../../assets/images/logo.png");
    height: 37px;
    width: 271px;
    margin-left:35px;
}
</style>
