<template>
    <div class="loading" v-if="!isChecked">
      <loading class="l"></loading>
    </div>
    <el-container v-else-if="isLogin" class="container">
      <el-aside style="min-width:64px;width:200px">
        <m-menu></m-menu>
      </el-aside>
      <el-main class="el-main">
        <m-header></m-header>
        <div class="content">
          <router-view></router-view>
        </div>
      </el-main>
    </el-container>
    <login v-else v-on:loginSuccess="loginSuccess"></login>
</template>

<script>
import MHeader from 'components/m-header/m-header'
import MMenu from 'components/menu/menu'
import Loading from 'base/loading/loading'
import Login from 'components/login/login'
import {checkLogin} from 'api/public.js'
import {ERR_OK} from 'api/config.js'
export default {
  data () {
    return {
      isLogin: false,
      isChecked: false
    }
  },
  mounted () {
    this._checkLogin()
  },
  methods: {
    loginSuccess () {
      this.isLogin = true
      this.$router.push({
        path: '/task/fillin'
      })
    },
    logoutSuccess () {
      this.isLogin = false
    },
    _checkLogin () {
      checkLogin().then((res) => {
        if (res.data.code === ERR_OK) {
          this.isLogin = true
        } else {
          this.isLogin = false
        }
        this.isChecked = true
      })
    },
    selectMenu (item) {
      this.$router.push({
        path: item.router
      })
    }
  },
  components: {
    MMenu,
    Login,
    Loading,
    MHeader
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~assets/stylus/variable"
  @import "~assets/stylus/mixin"
  .container
    position: relative
    height: 100%
    width: 100%
    .el-main
      padding: 0
      .content
        padding: 20px
  .loading
    position: absolute
    display: block
    top: 0
    left: 0
    z-index: 0
    width: 100%
    height: 100%
    background: #ffffff;
    .l
      position: absolute;
      background: #ffffff;
      width:200px
      left:50%
      margin-left:-100px
      top: 50%
      margin-top:-100px
</style>