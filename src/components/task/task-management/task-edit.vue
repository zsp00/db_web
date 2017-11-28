<template>
<div class="block">
  <span class="demonstration">默认 click 触发子菜单</span>
  <el-cascader
    :options="options"
    v-model="selectedOptions"
    @change="handleChange">
  </el-cascader>
</div>
</template>

<script>
export default {
  data () {
    return {
      options: [{
        value: 'zhinan',
        label: '指南',
        children: [
          {
            value: 'shejiyuanze',
            label: '设计原则'
          },
          {
            value: 'zhhu',
            label: 'nihao'
          }
        ]
      }],
      selectedOptions: []
    }
  },
  methods: {
    handleChange (value) {
      console.log(value)
    }
  }
}
</script>
<style>

</style>