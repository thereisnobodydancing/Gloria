<!-- 职位选择器 -->
<template>
  <div
    :class="{
      'w-1/3': props.options.width === '1/3',
      'w-2/3': props.options.width === '2/3',
      'w-full': props.options.width === '3/3'
    }"
  >
    <n-select
      :options="positionOptions"
      label-field="positionName"
      value-field="id" 
      :placeholder="props.options.placeholder"
      :multiple="props.options.multiple"
      clearable
      @update:value="handleUpdate"
    />
    <p v-if="props.options.desc"  class="mt-1 text-xs text-gray-400">{{ props.options.desc }}</p>
  </div>
</template>

<script setup>
import api from '/src/api/index.js'
import useFormStore from '/src/store/form.js'

const { form } = toRefs(useFormStore())
const props = defineProps({
  options: Object
})
const positionOptions = ref([])
api.get('/position/getCompanyRoleList').then((res) => {
  positionOptions.value = res.data.data
})

const handleUpdate = (keys, option) => {
  if(!keys) form.value[props.options.id] = null
  if(keys && !props.options.multiple) form.value[props.options.id] = option.positionName
  if(keys && props.options.multiple) form.value[props.options.id] = option.map(item => item.positionName)
}
</script>