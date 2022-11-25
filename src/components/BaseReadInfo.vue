<template>
  <div 
    v-if="props.readInfo.readList.length > 0" 
    class="text-sm text-gray-400 cursor-pointer hover:text-gray-500"
    @click="showReceiver"
  >
    <!-- 全部已读 -->
    <div 
      v-if="props.readInfo.notReadList.length === 0" 
      class="flex items-center space-x-1 cursor-pointer"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
        <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clip-rule="evenodd" />
      </svg>
      <p>全部已读</p>
    </div>

    <!-- 部分已读 -->
    <div 
      v-if="props.readInfo.notReadList.length > 0 && props.readInfo.readList.length > 0"
      class="flex items-center space-x-1 cursor-pointer"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
        <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm0 8.625a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM15.375 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zM7.5 10.875a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z" clip-rule="evenodd" />
      </svg>
      <p>{{ props.readInfo.readList.length }}人已读</p>
    </div>
  </div>
  <read-info-modal ref="readInfoRef" />
</template>

<script setup>
const props = defineProps({
  readInfo: Object
})
const readInfoRef = ref()
const showReceiver = function() {
  readInfoRef.value.showModal(props.readInfo.readList, props.readInfo.notReadList)
}
</script>