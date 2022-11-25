<!-- 查看日志接收人 -->
<template>
  <n-modal 
    v-model:show="modal.show"
    :mask-closable="false"
  >
    <n-card
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
      content-style="padding: 0"
      style="width: 600px"
    >
      <n-tabs
        type="line"
        size="large"
        :tabs-padding="20"
        pane-style="padding: 16px 8px"
      >
        <!-- 已读 -->
        <n-tab-pane :name="`已读(${modal.readList.length})`">
          <!-- empty -->
          <div 
            v-if="modal.readList.length === 0"
            class="flex items-center justify-center h-96"
          >
            <n-empty size="large" />
          </div>
          <!-- 已读列表 -->
          <div v-else class="h-96 overflow-y-scroll">
            <div class="flex flex-wrap items-center">
              <div
                v-for="(item, index) in modal.readList" 
                :key="index"
                class="cursor-pointer hover:opacity-70 ml-2 mb-4 w-16 flex flex-col items-center"
                @click="showCard(item.id)"
              >
                <base-avatar :image="item.headshot" :name="item.userName" />
                <p class="mt-1 text-sm line-1 text-gray-500">{{ item.userName }}</p>
              </div>
            </div>
          </div>
        </n-tab-pane>
        <!-- 未读 -->
        <n-tab-pane :name="`未读(${modal.notReadList.length})`">
          <!-- empty -->
          <div
            v-if="modal.notReadList.length === 0"
            class="flex items-center justify-center h-96"
          >
            <n-empty size="large" />
          </div>
          <!-- 未读列表 -->
          <div v-else class="h-96 overflow-y-scroll">
            <div class="flex flex-wrap items-center">
              <div 
                v-for="(item, index) in modal.notReadList" 
                :key="index"
                class="ml-2 mb-4 w-16 flex flex-col items-center cursor-pointer"
                @click="showCard(item.id)"
              >
                <base-avatar :image="item.headshot" :name="item.userName" />
                <p class="mt-1 text-sm line-1 text-gray-500">{{ item.userName }}</p>
              </div>
            </div>
          </div>
        </n-tab-pane>
        <!-- 关闭 -->
        <template #suffix>
          <div 
            class="h-[52px] rounded w-12 flex items-center justify-center cursor-pointer text-gray-500 hover:text-gray-900"
            @click="modal.show=false"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        </template>
      </n-tabs>
    </n-card>
  </n-modal>
  <!-- 名片 -->
  <business-card-modal ref="cardRef" />
</template>

<script setup>
import BusinessCardModal from '/src/components/Modal/BusinessCardModal.vue'

const modal = reactive({
  show: false,
  list: [],
  readList: [],
  notReadList: []
})

const showModal = function(readList, notReadList) {
  modal.show = true
  modal.readList = readList
  modal.notReadList = notReadList
}

// 名片
const cardRef = ref()
const showCard = function(id) {
  cardRef.value.showCard(id)
}

defineExpose({
  showModal
})
</script>