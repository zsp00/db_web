<template>
  <div>编辑流程 {{ pId }}</div>
</template>

<script>
export default {
  data () {
    return {
      pId: null
    }
  },
  mounted () {
    this.pId = this.$route.params.pId
  }
}
</script>

<style scoped>

</style>

