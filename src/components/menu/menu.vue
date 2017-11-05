<template>
  <div>
    <el-menu ref="menu" class="menu" unique-opened :default-active="$route.path" :collapse="isCollapse">
      <el-submenu v-for="item in menus" :key="item.id" :index="item.router">
        <template slot="title">
          <template v-if="item.icon !== '' && item.icon !== null" >
            <icon :name="item.icon" :scale="1.4"></icon>
          </template>
          <span>{{item.name}}</span>
        </template>
        <router-link v-if="item.child.length !== 0" v-for="cItem in item.child" :key="cItem.id" :to="cItem.router" >
          <el-menu-item :index="cItem.router">
            <template>
              <template v-if="cItem.icon !== '' && cItem.icon !== null" >
                <icon :name="cItem.icon"></icon>
              </template>
              <span slot="title">{{cItem.name}}</span>
            </template>
          </el-menu-item>
        </router-link>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
import {getMenus} from 'api/menu.js'
import {ERR_OK} from 'api/config.js'
export default {
  data () {
    return {
      menus: null,
      isCollapse: false
    }
  },
  mounted () {
    this._getMenus()
    this._initCollapse(this.isCollapse)
  },
  methods: {
    _getMenus () {
      getMenus().then((res) => {
        if (ERR_OK === res.data.code) {
          this.menus = res.data.msg
        }
      })
    },
    _initCollapse (val) {
      if (val) {
        this.$refs.menu.$el.style.width = 36
      } else {
        this.$refs.menu.$el.style.width = 200
      }
    }
  },
  watch: {
    isCollapse (newVal, oldVal) {
      this._initCollapse(newVal)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .menu
    position: fixed
    height: 100%
    transition: width 0.28s ease-out
    overflow-y: auto
    z-index: 1001
    &::-webkit-scrollbar {display:none}
    span
      padding-left: 10px
  .menu:not(.el-menu--collapse) 
    width: 200px
</style>
