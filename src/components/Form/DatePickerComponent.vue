<!-- 日期选择器 -->
<template>
  <div>
    <n-date-picker
      v-model:formatted-value="form[props.options.id]"
      :type="props.options.type" 
      :format="dateFeature[props.options.type]"
      :start-placeholder="datePlaceholder[props.options.type] ? datePlaceholder[props.options.type].start : null" 
      :end-placeholder="datePlaceholder[props.options.type] ? datePlaceholder[props.options.type].end : null"
      clearable
    />
    <p v-if="props.options.desc"  class="mt-1 text-xs text-gray-400">{{ props.options.desc }}</p>
  </div>
</template>

<script setup>
import useFormStore from '/src/store/form.js'
import { useDateData } from '/src/composables/useDateData.js'

const { form } = toRefs(useFormStore())
const { datePlaceholder, dateFeature } = useDateData()
const props = defineProps({
  options: Object
})
</script>