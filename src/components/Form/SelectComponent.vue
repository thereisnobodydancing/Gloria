<!-- 选择器 -->
<template>
  <div
    :class="{
      'w-1/3': props.options.width === '1/3',
      'w-2/3': props.options.width === '2/3',
      'w-full': props.options.width === '3/3'
    }"
  >
    <n-select 
      v-model:value="form[props.options.id]" 
      :options="props.options.list" 
      :placeholder="props.options.placeholder"
      :multiple="props.options.multiple"
      value-field="label"
      clearable
    />
    <p v-if="props.options.desc"  class="mt-1 text-xs text-gray-400">{{ props.options.desc }}</p>
  </div>
</template>

<script setup>
import useFormStore from '/src/store/form.js'

const { form } = toRefs(useFormStore())
const props = defineProps({
  options: Object
})
</script>