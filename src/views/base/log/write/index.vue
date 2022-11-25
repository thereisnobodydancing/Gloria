<template>
  <div class="w-full h-full bg-gray-200">
    <!-- top -->
    <div class="w-full h-14 border-b bg-white flex items-center">
      <!-- 返回按钮 -->
      <button 
        class="px-4 h-14 flex items-center text-lg"
        @click="$router.back()"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 inline-block">
          <path fill-rule="evenodd" d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z" clip-rule="evenodd" />
        </svg>
        <span class="ml-1 -mt-0.5 text-base">{{ titleObj[$route.query.type] }}</span>
      </button>
      <!-- 选择日志种类 -->
      <div class="ml-auto w-72 px-4">
        <n-select 
          :default-value="logData.logType" 
          :options="logTypeList" 
          :disabled="$route.query.type === 'edit'"
          placeholder="筛选：请选择日志种类" 
          @update:value="handleUpdate"
        />
      </div>
    </div>
    <!-- 周报 -->
    <log-edit-template />
  </div>
</template>

<script setup>
import api from '/src/api/index.js'
import useLogStore from '/src/store/log.js'
import LogEditTemplate from '../components/LogEditTemplate.vue'

const router = useRouter()
const route = useRoute()
const { logTypeList, logData } = toRefs(useLogStore())
const titleObj = { edit: '编辑', create: '写日志' }
const handleUpdate = (value, option) => {
  if(logData.value.logType !== value) {
    logData.value.logType = value
    logData.value.logSpan1 = logData.value.logSpan2 = logData.value.logSpan3 = logData.value.logSpan4 = logData.value.logSpan5 = ''
    logData.value.picturePathList = logData.value.filePathList = []
  }
}

// 编辑模式获取数据
if(route.query.type === 'edit') {
  // 获取日志数据
  api.get('/userlog/getLogDetails', { logId: route.query.id }).then((res) => {
    if(res.data.code === 20000) Object.assign(logData.value, res.data.data)
  })
}
</script>