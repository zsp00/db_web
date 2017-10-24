<template>
  <div class="left">
  <el-menu background-color="#eef1f6" v-if="menu.length > 0" :default-active="activeIndex">
    <el-menu-item class="element-item" v-for="(item,key) in menu" :key="key" :index="item.router" @click="selectMenu(item)">{{item.name}}</el-menu-item>
  </el-menu>
  </div>
</template>

<script>
import {getSubmenu} from 'api/menu.js'
import {ERR_OK} from 'api/config.js'
export default {
  props: {
    router: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      menu: {
      },
      activeIndex: null
    }
  },
  mounted () {
    this._getSubmenu()
  },
  methods: {
    _getSubmenu () {
      if (this.router === null) {
        return
      }
      getSubmenu(this.router).then((res) => {
        if (res.data.code === ERR_OK) {
          this.activeIndex = this.$route.path
          this.menu = res.data.msg
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    selectMenu (item) {
      this.$emit('selectMenu', item)
    }
  },
  watch: {
    router (newVal) {
      this._getSubmenu()
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .left
    background #eef1f6
    height 100%
    .element-item
      font-size 18px
      text-align center
</style>