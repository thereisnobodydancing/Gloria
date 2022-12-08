<!-- 日志评论 -->
<template>
  <div 
    class="w-full overflow-y-scroll" 
    :style="{ height: `${clientHeight - 145}px` }"
  >
    <div class="w-[800px] h-full mx-auto py-10 pl-3 pr-2">
      <base-infinite
        ref="infiniteRef"
        url="/userlog/getLogComments"
        :finishednum="1"
        :size="8"
        :params="params"
      >
        <template #default="slotProps">
          <div class="space-y-10">
            <div v-for="(item, index) in slotProps.list" :key="index">
              <div class="flex space-x-3.5">
                <div class="flex-shrink-0 w-11 h-11" @click="showCard(item.userId)">
                  <base-avatar :image="item.headshot" :name="item.userName" :width="44" :height="44" :font-size="16" />
                </div>
                <div class="flex-grow">
                  <div class="flex items-center">
                    <div>
                      <p class="text-lg">{{ item.userName }}</p>
                      <p class="text-sm">
                        <span class="text-gray-400">{{ item.createdTime }}</span>
                        <span class="ml-2.5 text-primary">评论了你的周报</span>
                      </p>
                    </div>
                    <!-- 回复 -->
                    <n-popconfirm 
                      :negative-text="null" 
                      :show-icon="false"
                      @positive-click="send"
                    >
                      <template #trigger>
                        <button 
                          class="ml-auto rounded-md px-2 py-1 text-gray-600 hover:bg-gray-200/50"
                          @click="handleReply(item.id, item.logId, item.userName)"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 inline-block">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                          </svg>
                          <span class="ml-1">回复</span>
                        </button>
                      </template>
                      <div class="w-80 p-1">
                        <n-input
                          v-model:value="replyData.comments"
                          type="textarea"
                          :placeholder="`评论${item.logdetails.logName}`"
                          :autosize="{ minRows: 1 }"
                        />
                      </div>
                    </n-popconfirm>
                  </div>
                  <p class="mt-4">{{ item.comments }}</p>
                  <p 
                    v-if="item.replyComments" 
                    class="mt-2"
                  >
                    <span class="text-gray-400">▎ {{ item.replyUserName }} {{ item.replyCommentsTime }} 发表的评论：</span>
                    <span>{{ item.replyComments }}</span>
                  </p>
                  <div class="mt-3 w-full bg-gray-100 rounded-md p-4">
                    <p>{{ item.logdetails.logName }}</p>
                    <div v-html="item.logdetails.logDetails" class="mt-2 text-gray-400" />
                    <p class="text-sm mt-3 text-gray-400">{{ item.logdetails.createdTime }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </base-infinite>
    </div>
  </div>
  <!-- 名片 -->
  <business-card-modal ref="cardRef" />
</template>

<script setup>
import api from '/src/api/index.js'
import { useMessage } from 'naive-ui'

const clientHeight = document.documentElement.clientHeight
const params = ref({})
const message = useMessage()
const infiniteRef = ref()

/****** 回复 *****/
const replyData = reactive({
  comments: '',
  logId: '',
  replyCommentId: ''
})
const handleReply = function(id, logId, name) {
  replyData.replyCommentId = id
  replyData.logId = logId
  replyData.comments = `回复 @${name} `
}
const send = function() {
  api.post('/userlog/logComments', replyData).then((res) => {
    if(res.data.code !== 20000) message.warning(res.data.msg)
    if(res.data.code === 20000) { 
      message.success('评论成功') 
      replyData.comments = replyData.logId = replyData.replyCommentId = ''
      infiniteRef.value.askApi(false)
    }
  })
}

// 名片
const cardRef = ref()
const showCard = function(id) {
  cardRef.value.showCard(id)
}
</script>