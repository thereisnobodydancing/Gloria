<!-- 省市区级联选择器 -->
<template>
  <div
    :class="{
      'w-1/3': props.options.width === '1/3',
      'w-2/3': props.options.width === '2/3',
      'w-full': props.options.width === '3/3'
    }"
  >
    <n-cascader
      :placeholder="props.options.placeholder"
      :options="cityList"
      :show-path="true"
      check-strategy="all"
      :filterable="true"
      label-field="name"
      value-field="id"
      children-field="addressVOList"
      clearable
      @update:value="changeCity"
    />
  </div>
</template>

<script setup>
import api from '/src/api/index.js'
import useFormStore from '/src/store/form.js'

const { form } = toRefs(useFormStore())
const props = defineProps({
  options: Object
})
const cityList = ref([])
api.get('/process/getAddress').then((res) => {
  cityList.value = res.data.data
})

const changeCity = (value, option, pathValues) => {
  console.log(pathValues)
  if(!pathValues) form.value[props.options.id] = null
  if(pathValues && pathValues.length === 1) form.value[props.options.id] = option.name
  if(pathValues && pathValues.length > 1) form.value[props.options.id] = pathValues.map(item => item.name).join('/')
}
</script>