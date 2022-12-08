<!-- 我收到的日志 -->
<template>
  <div 
    class="w-full flex" 
    :style="{ height: `${clientHeight - 145}px` }"
  >
    <!-- left: 日志列表 -->
    <div class="flex-shrink-0 w-64 h-full border-r">
      <div class="w-full h-12 border-b flex items-center px-4">
        <n-checkbox 
          v-model:checked="params.showNotRead"
          @update:checked="(checked) => params.showNotRead = checked"
        >
          <p class="text-gray-500">只看未读</p>
        </n-checkbox>
        <div class="ml-auto">
          <n-badge :value="notReadNumber" :max="99" color="#FF432A">
            <n-button size="small" type="tertiary" @click="clearNotRead">清除全部未读</n-button>
          </n-badge>
        </div>
      </div>
      <div 
        class="w-full overflow-y-scroll pl-3 pr-1 reactive"
        :style="{ height: `${clientHeight - 195}px` }"
      >
        <div class="sticky top-0 bg-white pb-3 z-10">
          <!-- search -->
          <n-input v-model:value="params.keyWord" placeholder="搜索全部日志" clearable class="mt-2">
            <template #prefix>
              <n-icon :component="SearchIcon" />
            </template>
          </n-input>
        </div>
        <!-- list -->
        <base-infinite
          ref="infiniteRef"
          url="/userlog/getMyReceiveLogList"
          :params="params"
          :style="{ height: `${clientHeight - 250}px` }"
        >
          <template #empty>
            <div 
              class="w-full flex flex-col items-center justify-center space-y-2" 
              :style="{height: `${clientHeight - 300}px`}"
            >
              <default-empty v-if="params.keyWord.length === 0" :width="130" :height="130" />
              <search-empty v-else :width="130" :height="130" />
              <p class="text-gray-400 text-sm"> {{ params.keyWord.length === 0 ? '数据为空' : '啥也没搜到' }}</p>
            </div>
          </template>
          <template #default="slotProps">
            <div class="space-y-4">
              <div 
                v-for="(item, index) in slotProps.list" 
                :key="index" 
                class="space-y-1 cursor-default"
              >
                <p class="text-gray-400 text-xs">{{ item.createdTime }}</p>
                <div 
                  class="w-full h-10 rounded pl-1.5 pr-2 flex items-center space-x-4"
                  :class="active === index ? 'bg-primary/10 cursor-default' : 'hover:bg-gray-100 cursor-pointer'"
                  @click="changeLog(item, index)"
                >
                  <div class="flex-shrink-0 w-8 h-8">
                    <base-avatar :image="item.headshot" :name="item.userName" :width="32" :height="32" :font-size="12" />
                  </div>
                  <p class="flex-grow text-gray-600 line-1">{{ item.logName }}</p>
                  <div v-if="!item.isViewed" class="ml-auto flex-shrink-0 w-2 h-2 rounded bg-primary/80" />
                </div>
              </div>
            </div>
          </template>
        </base-infinite>
      </div>
    </div>
    <!-- right：日志内容 -->
    <div id="rightLog" class="w-full h-full overflow-y-scroll">
      <!-- empty: 选个日志看看吧 -->
      <div v-if="active === null" class="w-full h-full flex flex-col items-center justify-center">
        <log-empty/>
        <p class="mt-4 text-gray-400">选个日志看看吧</p>
      </div>
      <div v-else class="w-full h-full reactive">
        <n-spin :show="rightData.showLoading">
          <div 
            class="w-[800px] h-full mx-auto" 
            :style="{ minHeight: `${clientHeight - 200}px` }"
          >
            <!-- top -->
            <div 
              class="sticky top-0 w-[800px] mx-auto bg-white flex items-center space-x-3.5 border-b py-4 cursor-pointer" 
              @click="showCard(rightData.logInfo.userId)"
            >
              <base-avatar :image="rightData.logInfo.headshot" :name="rightData.logInfo.userName" :width="44" :height="44" :font-size="16" />
              <div>
                <p class="text-lg">{{ rightData.logInfo.logName }}</p>
                <p class="text-sm">
                  <span class="text-gray-400">{{ rightData.logInfo.createdTime }}</span>
                  <span class="ml-3 text-primary/70 hover:text-primary" @click.stop="showReceiver">日志接收人 ></span>
                </p>
              </div>
            </div>
            <!-- log-content -->
            <template v-if="Object.keys(rightData.logData).length > 0">
              <div class="py-8">
                <log-template :type-id="rightData.logInfo.logType" :data="rightData.logData" />
                <!-- 已读未读 -->
                <div class="mt-8">
                  <base-read-info :read-info="readInfo"/>
                </div>
              </div>
            </template>
          </div>
          <!-- 评论区 以及 底部写评论 -->
          <log-comments :log-id="rightData.logInfo.id" :log-name="rightData.logInfo.logName" />
        </n-spin>
      </div>
    </div>
  </div>
  <read-info-modal ref="readInfoRef" />
  <!-- 名片 -->
  <business-card-modal ref="cardRef" />
</template>

<script setup>
import api from '/src/api/index.js'
import { default as SearchIcon} from "@vicons/ionicons5/search"
import { useDialog, useMessage } from 'naive-ui'
import LogTemplate from '../components/LogTemplate.vue'
import LogComments from '../components/LogComments.vue'

const clientHeight = ref(document.documentElement.clientHeight)
const dialog = useDialog()
const message = useMessage()

/**** 左侧列表数据 ****/
const infiniteRef = ref()
const params = ref({
  keyWord: '',
  showNotRead: false
})
const active = ref(null)
const notReadNumber = ref(0)
// 选择左侧日志
const changeLog = (item, index) => {
  active.value = index
  Object.assign(rightData.logInfo, item)
  getReadInfo(item.id)  // 获取右侧数据已读未读情况
  getLogData(item.id)   // 获取右侧数据
}
// 获取未读日志数量
const getNotRead = () => {
  api.get('/userlog/getCountNotRead').then((res) => {
    notReadNumber.value = res.data.data
  })
}
getNotRead()
// 清除全部未读
const clearNotRead = () => {
  if(notReadNumber.value === 0) message.warning('暂无未读日志')
  if(notReadNumber.value > 0) {
    dialog.warning({
      title: '提示',
      content: '你确定要清空全部未读日志提醒？',
      positiveText: '确定',
      negativeText: '不确定',
      onNegativeClick: () => {},
      onPositiveClick: () => {
        api.post('/userlog/changeLogRead').then((res) => {
          if(res.data.code === 20000) {
            message.success(res.data.msg)
            infiniteRef.value.askApi(false)
            getNotRead()
          }
        })
      }
    })
  }
}
const readInfo = reactive({
  readList: [],
  notReadList: []
})
const getReadInfo = function(id) {
  api.get('/userlog/getLogReceiver', { logId: id }).then((res) => {
    readInfo.readList = res.data.data.filter(item => item.isViewed === true)
    readInfo.notReadList = res.data.data.filter(item => item.isViewed === false)
  })
}
// 日志接收人
const readInfoRef = ref()
const showReceiver = function() {
  readInfoRef.value.showModal(readInfo.readList, readInfo.notReadList)
}

/**** 右侧日志数据 ****/
const rightData = reactive({
  showLoading: true,
  logInfo: {},
  logData: {}
})

// 获取日志数据
const getLogData = (id) => {
  document.querySelector('#rightLog').scrollTop = 0
  rightData.showLoading = true
  api.get('/userlog/getLogDetails', {logId: id}).then((res) => {
    if(res.data.code === 20000) Object.assign(rightData.logData, res.data.data)
    setTimeout(() => rightData.showLoading = false, 100)
  })
}

// 名片
const cardRef = ref()
const showCard = function(id) {
  cardRef.value.showCard(id)
}
</script>