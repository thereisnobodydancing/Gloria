<template>
  <div class="w-full h-full flex space-x-8 p-1">
    <!-- left -->
    <div class="flex-grow space-y-2">
      <h2 class="text-xl text-gray-600">消息提醒</h2>
      <n-spin :show="showMessageLoading">
        <div 
          class="w-full bg-white rounded overflow-y-scroll px-7 pb-12" 
          :style="{height: `${clientHeight - 130}px`}"
        >
          <div v-if="!showMessageLoading">
            <template v-if="messageList && messageList.length > 0">
              <div 
                v-for="(item, index) in messageList" 
                :key="index"
                class="py-5 border-b"
              >
                <div class="flex items-center">
                  <button
                    class="w-20 h-6 rounded-xl text-xs text-white"
                    :class="{
                      'bg-primary': item.method === '审批',
                      'bg-blue-500': item.method === '抄送',
                    }"
                  >
                    {{ item.method }}提醒
                  </button>
                  <p class="ml-5">{{ item.userName }}提交的{{ item.messageType }}</p>
                </div>
                <p class="mt-2 text-sm text-gray-400">
                  <span v-if="item.method === '审批'">{{ item.userName }}的{{ item.messageType }}已提交，可以开始审批啦。</span>
                  <span v-if="item.method === '抄送'">{{ item.userName }}的{{ item.messageType }}已提交，可以在审批中心查看。</span>
                </p>
              </div>
            </template>
          </div>
        </div>
      </n-spin>
    </div>
    <!-- right -->
    <div 
      class="flex-shrink-0 w-[22.25rem] overflow-y-scroll space-y-5"
      :style="{height: `${clientHeight - 120}px`}"  
    >
      <!-- 个人卡片 -->
      <div 
        class="w-full h-[7.5rem] rounded flex items-center px-7"
        style="background: linear-gradient(0deg, #FFFFFF 0%, #FFFFFF 49%, #FFE7E4 100%)"
      >
        <base-avatar :image="user.headshot" :name="user.userName" :width="60" :height="60" :radius="999" />
        <div class="ml-4 space-y-0.5">
          <p class="text-xl text-gray-600">{{ user.userName }}</p>
          <p class="text-sm text-gray-400">{{ user.positionName }}</p>
        </div>
        <div class="ml-auto">
          <n-button type="primary" size="small" ghost @click="showCard(user.id)">我的名片</n-button>
        </div>
      </div>
      <!-- 企业公告 -->
      <div class="space-y-2">
        <div class="flex items-center">
          <h2 class="text-xl text-gray-600">企业公告</h2>
          <p class="ml-auto text-gray-600/60 cursor-pointer hover:text-gray-600/80">更多 ></p>
        </div>
        <n-spin :show="showBulletinLoading">
          <div class="w-full h-60 bg-white rounded p-7 space-y-2">
            <template v-if="bulletinList && bulletinList.length > 0">
              <div v-for="(item, index) in bulletinList" :key="index">
                <p 
                  class="line-1 hover:underline cursor-pointer" 
                  :class="item.setTop ? 'text-primary' : 'text-gray-500'"
                  @click="$router.push(`/base/bulletin/detail/${item.id}?type=receiver`)"
                >
                  <span v-if="item.setTop">[置顶]</span>
                  {{ item.title }}
                </p>
              </div>
            </template>
            <template v-else>
              <div 
                v-if="!showBulletinLoading" 
                class="w-full h-full flex flex-col items-center justify-center"
              >
                <default-empty/>
                <p class="text-xs text-gray-400">暂无公告</p>
              </div>
            </template>
          </div>
        </n-spin>
      </div>
      <!-- 日历 -->
      <div class="space-y-2">
        <h2 class="text-xl text-gray-600">日历</h2>
        <div class="w-full bg-white p-4 flex items-center justify-center">
          <n-date-picker panel type="date"/>
        </div>
      </div>
    </div>
  </div>
  <!-- 名片 -->
  <business-card-modal ref="cardRef" />
</template>

<script setup>
// import { Vue3Lottie } from 'vue3-lottie'
// import 'vue3-lottie/dist/style.css'
// import HomeJson from '/src/assets/home.json'
import api from '/src/api/index.js'
import useUserStore from '/src/store/user.js'

const { user } = toRefs(useUserStore())
const clientHeight = ref(document.documentElement.clientHeight)

// 消息提醒
const messageList = ref([])
const showMessageLoading = ref(true)
api.get('/message/toBeProcessed').then((res) => {
  messageList.value = res.data.data
  setTimeout(() => showMessageLoading.value = false, 100)
})

// 企业公告
const bulletinList = ref([])
const showBulletinLoading = ref(true)
api.get('/announcement/getMyReceiveLogList', { page: 1,  pageSize: 6}).then((res) => {
  bulletinList.value = res.data.data.data
  setTimeout(() => showBulletinLoading.value = false, 100)
})

/******** 名片 ********/
const cardRef = ref()
const showCard = function(id) {
  cardRef.value.showCard(id)
}
</script>