<template>
  <div class="header">
    <div class="logo">

    </div>
    <div class="breadcrumb">
      <el-breadcrumb class="app-levelbar" separator="/">
        <el-breadcrumb-item v-for="(item,index)  in levelList" :key="item.path">
          <span v-if='item.redirect==="noredirect"||index==levelList.length-1' class="no-redirect">{{item.name}}</span>
          <router-link v-else :to="item.redirect||item.path">{{item.name}}</router-link>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="member">
      <img ref="avatar" :src="userinfo.avatar">
      <div ref="userCard" class="user-card">
        <div class="item">个人信息</div>
        <div @click="onLogout" class="item last-item">退出</div>
      </div>
    </div>
  </div>
</template>

<script>
import {getUserInfo} from 'api/user.js'
import {logout} from 'api/public.js'
import {ERR_OK} from 'api/config.js'
import noavatar from 'assets/images/noavatar.png'
export default {
  data () {
    return {
      userinfo: {
        username: 'loading',
        avatar: null
      },
      timer: null,
      levelList: null
    }
  },
  created () {
    this.getBreadcrumb()
  },
  mounted () {
    this._getUserInfo()
    var e = this
    this.$refs.avatar.addEventListener('mouseover', () => {
      e.$refs.userCard.style.display = 'block'
    })
    this.$refs.userCard.addEventListener('mouseout', (event) => {
      if (event.target === e.$refs.userCard) {
        e.$refs.userCard.style.display = 'none'
      }
    })
  },
  methods: {
    _getUserInfo () {
      getUserInfo().then((res) => {
        if (ERR_OK === res.data.code) {
          this.userinfo = res.data.msg
          if (this.userinfo.avatar === false) {
            this.userinfo.avatar = noavatar
          }
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    onLogout () {
      logout().then((res) => {
        if (ERR_OK === res.data.code) {
          this.$message.success(res.data.msg)
          setTimeout(() => {
            window.location.href = '/'
          }, 1500)
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    onSelectMenu (item) {
      this.$emit('selectMenu', item)
    },
    getBreadcrumb () {
      var matched = this.$route.matched.filter(item => item.name)
      const first = matched[0]
      if (first && (first.name !== '首页' || first.path !== '')) {
        matched = [{ name: '首页', path: '/' }].concat(matched)
      }
      this.levelList = matched
    }
  },
  watch: {
    $route () {
      this.getBreadcrumb()
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .header
    height:60px
    border-bottom 1px solid #e6e6e6
    position fixed
    width 100%
    background:#ddd
    z-index 1000
    .breadcrumb
      float: left
      margin-top: 22px
      padding-left: 20px
    h1
      float: left
      height: 60px
      .logo
        background url(../../assets/images/logo.png)
        height 37px
        width 271px
        margin-top 10px
        margin-left 30px
      img
        height: 60px
    .member
      width: 120px
      float: right
      margin-right: 50px
      font-size:12px
      text-align center
      img
        margin-top:13px
        margin-bottom:13px
        height: 30px
        width: 30px
        border-radius: 30px
        border: 2px solid #eef1f6
        cursor pointer
        float:right
      img:hover
        border: 2px solid #ccc
      .user-card
        background #eef1f6
        z-index 200
        display none
        position absolute
        margin-right: 50px
        margin-top: 60px
        width: 100px
        border: 1px solid #ccc
        border-top: 0px
        border-bottom-left-radius: 20px
        border-bottom-right-radius: 20px
        padding-top: 0px
        padding-left: 10px
        padding-right: 10px
        padding-bottom: 0px
        .item
          width: 100%
          height: 30px
          line-height: 30px
          cursor pointer
          border-bottom: 1px solid #ccc
        .last-item
          border-bottom: 0px
    .nav
      float: left
      margin-left: 20px
</style>
