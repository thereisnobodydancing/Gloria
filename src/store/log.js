import { defineStore } from 'pinia'
// import { watch } from 'vue'
const user = JSON.parse(sessionStorage.getItem('user'))

export default defineStore('template', () => {
  const userId = ref(user.id)
  // 日志类型列表
  const logTypeList = ref([
    { label: '工作日报', value: 1 },
    { label: '工作周报', value: 2 },
    { label: '工作月报', value: 3 },
    { label: '年终总结', value: 4 },
  ])
  // 日志数据
  const logData = ref({
    id: null,               // 日志id
    logType: 2,             // 日志类型
    logSpan1: '',           // 日志段落 1
    logSpan2: '',           // 日志段落 2
    logSpan3: '',           // 日志段落 3
    logSpan4: '',           // 日志段落 4
    logSpan5: '',           // 日志段落 5
    picturePathList: [],    // 图片
    filePathList: [],       // 附件
    approverList: [],       // 审批者
  })
  // 人员相关
  const userList = ref({
    keys: [],
    options: []
  })
  // watch(() => logData.value.logType, value => {
  //   logData.value.logSpan1 = logData.value.logSpan2 = logData.value.logSpan3 = logData.value.logSpan4 = logData.value.logSpan5 = ''
  //   logData.value.picturePathList = logData.value.filePathList = []
  // })
  // 日志
  const logTemplate = computed(() => {
    if(logData.value.logType === 1) return { title: '工作日报', subTitles: ['今日完成工作', '未完成工作', '需协调工作','备注']}
    if(logData.value.logType === 2) return { title: '工作周报', subTitles: ['本周完成工作', '本周工作总结', '下周工作计划', '需要协调与帮助', '备注']}
    if(logData.value.logType === 3) return { title: '工作月报', subTitles: ['本月工作内容', '本月工作总结', '下月工作计划', '需要协调与帮助', '备注']}
    if(logData.value.logType === 4) return { title: '年终总结', subTitles: ['总结']}
  })
  const getLogTemplate = function(typeId) {
    if(typeId === 1) return { title: '工作日报', subTitles: ['今日完成工作', '未完成工作', '需协调工作','备注']}
    if(typeId === 2) return { title: '工作周报', subTitles: ['本周完成工作', '本周工作总结', '下周工作计划', '需要协调与帮助', '备注']}
    if(typeId === 3) return { title: '工作月报', subTitles: ['本月工作内容', '本月工作总结', '下月工作计划', '需要协调与帮助', '备注']}
    if(typeId === 4) return { title: '年终总结', subTitles: ['总结']}
  }
  return {
    userId,
    logTypeList,      // 日志类型列表
    logData,          // 正在编辑的日志
    userList,         // 人员相关
    logTemplate,
    getLogTemplate
  }
},{
  persist: true       // 支持持久化
})