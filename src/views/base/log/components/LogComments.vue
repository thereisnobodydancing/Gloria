<template>
  <!-- 评论列表 -->
  <div 
    class="w-[800px] mx-auto px-2"
    :class="{'border-t pt-4 pb-8': list.length > 0}"
  >
    <div class="space-y-3">
      <div v-for="(item, index) in list" :key="index">
        <div class="flex space-x-3.5 group">
          <div class="flex-shrink-0 w-11 h-11 rounded cursor-pointer" @click="showCard(item.userId)">
            <base-avatar :image="item.headshot" :name="item.userName" />
          </div>
          <div class="py-1 space-y-1">
            <p class="text-gray-400">{{ item.userName }}</p>
            <p>{{ item.comments }}</p>
            <p v-if="item.replyComments" class="text-gray-400"> ▎ {{ item.replyComments }}</p>
            <p class="text-gray-400">
              <span>{{ item.createdTime }}</span>
              <span 
                class="ml-3 px-1 cursor-pointer hover:text-gray-500" 
                @click="reply(item.id, item.userName)"
              >
                回复
              </span>
              <span
                class="hidden px-1 cursor-pointer hover:text-gray-500"
                :class="{'group-hover:inline-block' : item.userId === user.id}"
                @click="deleteComment(item.id)"
              >
                删除
              </span>
            </p>
          </div>
        </div>
      </div>
      <p 
        v-show="commentsFold"
        class="cursor-pointer text-gray-400"
        @click="commentsFold = false"
      >
        全部{{ commentsList.length }}条评论
      </p>
    </div>
  </div>
  <!-- 写评论 -->
  <div class="sticky bottom-0 bg-white border-t py-2 z-20">
    <div class="w-[800px] mx-auto flex space-x-3">
      <n-input 
        v-show="!commentsInputData.inputUnfold"
        v-model:value="commentsInputData.value"
        type="text" readonly 
        :placeholder="`评论${props.logName}`" 
        @focus="handleFocus" 
      />
      <n-input
        ref="commentsInoutRef"
        v-show="commentsInputData.inputUnfold"
        v-model:value="commentsInputData.value"
        type="textarea"
        :placeholder="`评论${props.logName}`"
        :autosize="{ minRows: 3}"
        @blur="commentsBlur"
        @input="commentsInput"
        class="flex-grow"
      />
      <button
        v-show="commentsInputData.inputUnfold"
        class="w-20 h-9 bg-primary rounded text-white disabled:opacity-70 hover:opacity-70"
        :disabled="commentsInputData.disabled"
        @click="sendComments"
      >
        发送
      </button>
    </div>
  </div>
  <!-- 名片 -->
  <business-card-modal ref="cardRef" />
</template>

<script setup>
import { pickBy } from 'lodash'
import api from '/src/api/index.js'
import { useDialog, useMessage } from 'naive-ui'
import BusinessCardModal from '/src/components/Modal/BusinessCardModal.vue'

const message = useMessage()
const dialog = useDialog()
const user = JSON.parse(sessionStorage.getItem('user'))

const props = defineProps({
  logId: {
    type: Number,
    required: true
  },
  logName: {
    type: String,
    required: true
  }
})

/***** 评论列表 ******/
const commentsList = ref([])
const commentsFold = ref(true)  // 是否折叠显示三条评论
// 获取日志评论
const getComments = function() {
  api.get('/userlog/getCommentByLogId', { logId: props.logId }).then((res) => {
    if(res.data.code === 20000) {
      commentsList.value = res.data.data
      if(commentsFold.value) commentsFold.value = res.data.data.length > 3
    }
  })
}
onMounted(() => getComments())

const list = computed(() => {
  if(commentsFold.value && commentsList.value.length > 3) return commentsList.value.slice(0, 3)
  return commentsList.value
})

watch(() => props.logId, (value) => {
  commentsFold.value = true
  initComments()
  getComments()
})

// 点击回复
const reply = function(id, name) {
  commentsInputData.replyCommentId = id
  commentsInputData.value = `回复 @${name} `
  setTimeout(() => handleFocus(), 100)
}
// 点击删除
const deleteComment = function(id) {
  dialog.warning({
    title: '删除评论',
    content: '确定要删除这条评论吗？',
    positiveText: '确定',
    negativeText: '不确定',
    onPositiveClick: () => {
      api.delete('/userlog/deleteComments', { commentId: id }).then((res) => {
        if(res.data.code !== 20000) message.warning(res.data.msg)
        if(res.data.code === 20000) { 
          initComments()
          getComments()
          message.success('删除评论成功') 
        }
      })
    },
    onNegativeClick: () => {}
  })
}

/***** 写评论 ******/
const commentsInoutRef = ref()
const commentsInputData = reactive({
  value: '',                // 写评论的内容
  replyCommentId: 0,        // 回复评论的id
  inputUnfold: false,       // 底部写评论输入框的状态
  disabled: true            // 发送评论按钮是否禁用
})
// 输入框聚焦
const handleFocus = function() {
  commentsInputData.inputUnfold = true
  nextTick(() => commentsInoutRef.value?.focus())
}
// 输入内容，确定按钮解除禁用
const commentsInput = function(v) {
  commentsInputData.disabled = !v
}
// 失去焦点
const commentsBlur = function() {
  setTimeout(() => commentsInputData.inputUnfold = false, 200)
}

// 初始化
const initComments = function() {
  commentsInputData.value = ''
  commentsInputData.replyCommentId = 0
  commentsInputData.inputUnfold = false
  commentsInputData.disabled = true
}

// 评论
const sendComments = function() {
  let data = {}
  Object.assign(data, { comments: commentsInputData.value, logId: props.logId, replyCommentId: commentsInputData.replyCommentId })
  api.post('/userlog/logComments', pickBy(data)).then((res) => {
    if(res.data.code !== 20000) message.warning(res.data.msg)
    if(res.data.code === 20000) { message.success('评论成功') }
    initComments()
    getComments()
  })
}

// 名片
const cardRef = ref()
const showCard = function(id) {
  cardRef.value.showCard(id)
}
</script>