<!-- 部门选择 -->
<template>
  <div
    :class="{
      'w-1/3': props.options.width === '1/3',
      'w-2/3': props.options.width === '2/3',
      'w-full': props.options.width === '3/3'
    }"
  >
    <n-tree-select
      :options="sectorList"
      placeholder="请选择部门"
      children-field="list"
      key-field="sectorId"
      label-field="sectorName"
      :multiple="props.options.multiple"
      :cascade="props.options.multiple"
      :checkable="props.options.multiple"
      filterable
      clearable
      @update:value="handleUpdate"
    />
    <p
      v-if="props.options.desc" 
      class="mt-1 text-xs text-gray-400"
    >
      {{ props.options.desc }}
    </p>
  </div>
</template>
  
<script setup>
import api from '/src/api/index.js'
import useFormStore from '/src/store/form.js'

const { form } = toRefs(useFormStore())
const props = defineProps({
  options: Object
})

const sectorList = ref([])
api.get('/addressBook/structure/getSectorList').then((res) => {
  if(res.data.code === 20000) sectorList.value = res.data.data
})

const handleUpdate = (keys, option) => {
  if(!keys) form.value[props.options.id] = null
  if(keys && !props.options.multiple) form.value[props.options.id] = option.sectorName
  if(keys && props.options.multiple) form.value[props.options.id] = option.map(item => item.sectorName)
}
</script>

<style>
.n-tree-node-content__text {
  @apply text-sm !important
}
</style>