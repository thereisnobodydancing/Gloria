<!-- 我发出的日志 -->
<template>
  <div 
    class="w-full flex" 
    :style="{ height: `${clientHeight - 145}px` }"
  >
    <!-- left: 日志列表 -->
    <div class="flex-shrink-0 w-64 h-full overflow-y-scroll pl-3 pr-1 border-r reactive">
      <div class="sticky top-0 bg-white pt-2 pb-3 z-10">
        <!-- selected -->
        <n-select v-model:value="params.logType" :options="logTypeList" placeholder="筛选：请选择日志种类" clearable />
      </div>
      <!-- list -->
      <base-infinite 
        ref="infiniteRef"
        url="/userlog/getMySubmmitLogList"
        :params="params"
        @getfirst="getFirstData"
      >
        <template #empty>
          <div 
            class="w-full flex flex-col items-center justify-center space-y-2" 
            :style="{height: `${clientHeight - 300}px`}"
          >
            <default-empty :width="130" :height="130" />
            <p class="text-gray-400 text-sm">数据为空</p>
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
              </div>
            </div>
          </div>
        </template>
      </base-infinite>
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
            <div class="sticky top-0 w-[800px] mx-auto bg-white flex items-center space-x-3.5 border-b py-4">
              <div class="w-11 h-11 flex-shrink-0 cursor-pointer" @click="showCard(rightData.logInfo.userId)">
                <base-avatar :image="rightData.logInfo.headshot" :name="rightData.logInfo.userName" :width="44" :height="44" :font-size="16" />
              </div>
              <div class="flex-shrink-0 cursor-pointer" @click="showCard(rightData.logInfo.userId)">
                <p class="text-lg">{{ rightData.logInfo.logName }}</p>
                <p class="text-sm text-gray-400">{{ rightData.logInfo.createdTime }}</p>
              </div>
              <div class="flex-grow">
                <div class="ml-auto w-14 cursor-pointer">
                  <n-dropdown :options="rightData.options" placement="bottom-end" @select="handleSelect">
                    <n-button quaternary >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                      </svg>
                    </n-button>
                  </n-dropdown>
                </div>
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
  <!-- 名片 -->
  <business-card-modal ref="cardRef" />
</template>

<script setup>
import api from '/src/api/index.js'
import useLogStore from '/src/store/log.js'
import { useDialog, useMessage } from 'naive-ui'
import LogTemplate from '../components/LogTemplate.vue'
import LogComments from '../components/LogComments.vue'

const route = useRoute()
const router = useRouter()
const clientHeight = ref(document.documentElement.clientHeight)
const { logTypeList } = toRefs(useLogStore())
const dialog = useDialog()
const message = useMessage()


/**** 左侧列表数据 ****/
const infiniteRef = ref()
const params = ref({
  logType: null
})
const active = ref(null)
// 选择左侧日志
const changeLog = (item, index) => {
  if(route.query.sf === '1') router.replace('/base/log?type=send')
  active.value = index
  Object.assign(rightData.logInfo, item)
  getReadInfo(item.id)  // 获取右侧数据已读未读情况
  getLogData(item.id)   // 获取右侧数据
}

// 获取第一条数据
const getFirstData = (data) => {
  if(route.query.sf === '1') {
    active.value = 0
    Object.assign(rightData.logInfo, data)
    getReadInfo(data.id)  // 获取右侧数据已读未读情况
    getLogData(data.id)   // 获取右侧数据
  }
}

/**** 右侧日志数据 ****/
const rightData = reactive({
  showLoading: true,
  options: [
    { label: '编辑日志', key: 'edit' },
    { label: '删除日志', key: 'remove' }
  ],
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
// 已读未读
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
// 选择下拉选项（编辑、删除）
const handleSelect = (key, option) => {
  if(key === 'edit') {
    useLogStore().$reset()
    router.push(`/base/log/write?type=edit&id=${rightData.logInfo.id}`)
  }
  if(key === 'remove') removeLog(rightData.logInfo.id)
}
// 删除日志
const removeLog = (id) => {
  dialog.warning({
    title: '提示',
    content: '你确定要删除这篇日志吗？',
    positiveText: '确定',
    negativeText: '不确定',
    onNegativeClick: () => {},
    onPositiveClick: () => {
      api.delete('/userlog/deleteLog', {logId: id}).then((res) => {
        if(res.data.code === 20000) {
          message.success(res.data.msg)
          infiniteRef.value.askApi(false)
          active.value = null
        }
      })
    }
  })
}

// 名片
const cardRef = ref()
const showCard = function(id) {
  cardRef.value.showCard(id)
}
</script>