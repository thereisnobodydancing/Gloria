<!-- 单行输入文本 -->
<template>
  <div
    :class="{
      'w-1/3': props.options.width === '1/3',
      'w-2/3': props.options.width === '2/3',
      'w-full': props.options.width === '3/3'
    }"
  >
    <n-input 
      v-model:value="value" 
      :type="props.options.type" 
      :showCount="props.options.showCount ? true : false"
      :maxlength="props.options.maxLength"
      :placeholder="props.options.placeholder" 
      clearable
      @update:value="handleUpdate"
    />
    <p v-if="props.options.desc"  class="mt-1 text-xs text-gray-400">{{ props.options.desc }}</p>
  </div>
</template>

<script setup>
const emit = defineEmits(['change'])
const props = defineProps({
  options: Object
})
const value = ref(null)
const handleUpdate = (value) => emit('change', value)
</script>