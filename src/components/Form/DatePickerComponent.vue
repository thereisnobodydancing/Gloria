<!-- 日期选择器 -->
<template>
  <div>
    <n-date-picker
      v-model:formatted-value="value"
      :type="props.options.type" 
      :format="dateFeature[props.options.type]"
      :start-placeholder="datePlaceholder[props.options.type] ? datePlaceholder[props.options.type].start : null" 
      :end-placeholder="datePlaceholder[props.options.type] ? datePlaceholder[props.options.type].end : null"
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
const datePlaceholder = {
  daterange: { start: '开始日期', end: '结束日期' },
  datetimerange: { start: '开始日期时间', end: '结束日期时间' },
  monthrange: { start: '开始月份', end: '结束月份' },
  yearrange: { start: '开始年份', end: '结束年份' },
  quarterrange: { start: '开始季度', end: '结束季度' },
}
const dateFeature = {
  date: 'yyyy-MM-dd',
  datetime: 'yyyy-MM-dd HH:mm:ss',
  daterange: 'yyyy-MM-dd',
  datetimerange: 'yyyy-MM-dd HH:mm:ss',
  month: 'yyyy-MM',
  monthrange: 'yyyy-MM',
  year: 'yyyy',
  yearrange: 'yyyy',
  quarter: 'yyyy-第Q季',
  quarterrange: 'yyyy-第Q季'
}
const value = ref(null)
const handleUpdate = (value, formattedValue) => emit('change', formattedValue)
</script>