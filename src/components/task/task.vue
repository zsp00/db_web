<template>
  <el-container>
    <el-aside width="200px">
      <mleft :router="router" @selectMenu="selectMenu"></mleft>
    </el-aside>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script>
import Mleft from 'components/task/left'
export default {
  data () {
    return {
      router: null
    }
  },
  mounted () {
    this.router = this.$route.path
  },
  methods: {
    selectMenu (item) {
      this.$router.push({
        path: item.router
      })
    }
  },
  components: {
    Mleft
  }
}
</script>


<style scoped lang="stylus" rel="stylesheet/stylus">
</style>
