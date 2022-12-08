<!-- 多选框组 -->
<template>
  <div
    :class="{
      'w-1/3': props.options.width === '1/3',
      'w-2/3': props.options.width === '2/3',
      'w-full': props.options.width === '3/3'
    }"
  >
    <n-checkbox-group v-model:value="form[props.options.id]">
      <n-space item-style="display: flex">
        <n-checkbox 
          v-for="i in props.options.list" 
          :key="i.label" 
          :value="i.label"
        >
          {{ i.label }}
        </n-checkbox>
      </n-space>
    </n-checkbox-group>
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