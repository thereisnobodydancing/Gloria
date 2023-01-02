<!-- 周报模板（详情） -->
<template>
  <div class="space-y-8">
    <div 
      v-for="(item, index) in list"
      :key="index"
      class="space-y-2"
    >
      <h3 class="mb-2 text-lg font-bold">{{ item }}</h3>
      <div class="text-gray-500">
        <div v-if="props.data.logSpan1" v-html="props.data[`logSpan${index + 1}`]" />
        <p v-else>-</p>
      </div>
    </div>
    <!-- picturePathList: 图片 -->
    <div class="space-y-2">
      <h3 class="mb-2 text-lg font-bold">图片：</h3>
      <div 
        v-if="props.data.picturePathList.length > 0" 
        class="grid grid-cols-6 gap-2"
      >
        <div 
          v-for="(item, index) in props.data.picturePathList"
          :key="index"
          class="w-[94px] h-[94px] border rounded cursor-pointer"
        >
          <n-image :src="item.url" :alt="`img${index}`" width="94" height="94" class="rounded" />
        </div>
      </div>
      <p v-else>-</p>
    </div>
    <!-- filePathList: 附件 -->
    <div class="space-y-2">
      <h3 class="mb-2 text-lg font-bold">附件：</h3>
      <div v-if="props.data.filePathList.length > 0">
        <n-upload
          v-model:file-list="props.data.filePathList"
          :show-remove-button="false"
          class="-mt-6"
        />
      </div>
      <p v-else>-</p>
    </div>
  </div>
</template>

<script setup>
import useLogStore from '/src/store/log.js'
const { getLogTemplate } = toRefs(useLogStore())
const props = defineProps({
  typeId: Number,
  data: Object
})
const list = ref(null)
watch(() => props.typeId, newId => {
  list.value = getLogTemplate.value(newId).subTitles
})
</script>