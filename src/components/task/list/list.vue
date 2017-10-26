<template>
  <div>
    <span v-for="(seen, key) in seens" :key="seen.id">
      <p>{{ key }}</p><p>{{ seen }}</p>
    </span>
    <div @click="dianji">点击{{ moren }}</div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      seens: [
        {
          id: 1,
          name: '李天航'
        },
        {
          id: 2,
          name: '卢晋'
        }
      ],
      moren: '默认'
    }
  },
  methods: {
    dianji () {
      this.moren = '此案次'
    }
  }
}
</script>

<style>
</style>
