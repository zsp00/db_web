<template>
  <router-view></router-view>
</template>

<script>
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
  }
}
</script>


<style scoped lang="stylus" rel="stylesheet/stylus">
</style>
