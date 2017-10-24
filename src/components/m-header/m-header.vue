<template>
  <div class="header">
    <h1><div class="logo"></div></h1>
    <el-menu background-color="#eef1f6" v-if="menu.length > 0" :default-active="activeIndex" class="nav" mode="horizontal">
      <el-menu-item class="element-item" v-for="item in menu" @click="onSelectMenu(item)" :key="item.id" :index="item.router">{{item.name}}</el-menu-item>
    </el-menu>
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
import {getMenu} from 'api/menu.js'
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
      activeIndex: null,
      menu: {}
    }
  },
  mounted () {
    this._getUserInfo()
    this._getMenu()
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
    _getMenu () {
      getMenu().then((res) => {
        if (ERR_OK === res.data.code) {
          for (var i = 0; i < res.data.msg.length; i++) {
            if (this.$route.path.indexOf(res.data.msg[i].router) === 0) {
              this.activeIndex = res.data.msg[i].router
              break
            }
          }
          this.menu = res.data.msg
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    onLogout () {
      logout().then((res) => {
        if (ERR_OK === res.data.code) {
          this.$message.success(res.data.msg)
          this.$emit('logoutSuccess')
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    onSelectMenu (item) {
      this.$emit('selectMenu', item)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .header
    height:60px
    background:#eef1f6
    border-bottom 1px solid #e6e6e6
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
      .element-item
        font-size 18px
</style>
