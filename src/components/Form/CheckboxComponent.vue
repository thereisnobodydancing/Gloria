<!-- 多选框组 -->
<template>
  <div
    :class="{
      'w-1/3': props.options.width === '1/3',
      'w-2/3': props.options.width === '2/3',
      'w-full': props.options.width === '3/3'
    }"
  >
    <n-checkbox-group 
      v-model:value="value"
      @update:value="handleUpdate"
    >
      <n-space item-style="display: flex">
        <n-checkbox 
          v-for="i in props.options.list" 
          :key="i.value" 
          :value="i.value"
        >
          {{ i.label }}
        </n-checkbox>
      </n-space>
    </n-checkbox-group>
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