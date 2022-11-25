<!-- 周报模板（新建、编辑） -->
<template>
  <!-- Toolbar -->
  <div class="flex justify-center bg-white border-t border-b">
    <template v-for="i in logTemplate.subTitles.length" :key="i">
      <Toolbar
        v-show="active === i"
        :editor="editorRef[`logSpan${i}`]" 
        :defaultConfig="toolbarConfig"
      />
    </template>
  </div>
  <div 
    id="weeklyLog"
    class="py-4 overflow-y-scroll"
    :style="{height: `${clientHeight - 185}px`}"
  >
    <div class="w-[800px] mx-auto bg-white rounded px-9">
      <!-- title -->
      <div class="px-6 pt-14 pb-7 border-b">
        <h2 class="ml-2 text-3xl font-bold">{{ logTemplate.title }}</h2>
      </div>
      <!-- content -->
      <div class="space-y-8 px-6 pt-10 pb-8 border-b">
        <!-- '本周完成工作', '本周工作总结', '下周工作计划', '需要协调与帮助', '备注' -->
        <div v-for="i in logTemplate.subTitles.length" :key="i" class="space-y-2">
          <h3 class="ml-2 text-lg font-bold">{{ logTemplate.subTitles[i - 1] }}</h3>
          <Editor
            v-model="logData[`logSpan${i}`]"
            :defaultConfig="editorConfig" 
            class="overflow-y-hidden min-h-[120px]"
            @onFocus="active = i"
            @onCreated="(editor) => handleCreated(editor, i)"
          />
        </div>
        <!-- 图片 -->
        <div class="ml-2">
          <h3 class="text-lg font-bold mb-4">图片：</h3>
          <base-upload 
            :file-list="logData.picturePathList"
            :action="action"
            accept="image/*" 
            @change="changeImgUpload" 
          />
        </div>
        <!-- 附件 -->
        <div class="ml-2">
          <h3 class="mb-4 text-lg font-bold">附件：</h3>
          <base-upload 
            :file-list="logData.filePathList"
            :action="action" 
            type="text" 
            @change="changeFileUpload" 
          >
            <n-button>上传文件</n-button>
          </base-upload>
        </div>
      </div>
      <div class="p-8 space-y-8">
        <!-- 发送人 -->
        <div>
          <h3 class="text-lg font-bold mb-4">发送给：</h3>
          <div class="flex flex-wrap">
            <div
              v-for="(item, index) in userList.options"
              :key="index"
              class="w-11 text-center mr-5 mb-4 space-y-2 cursor-pointer"
              :class="{'hover:opacity-75': $route.query.type === 'create'}"
              @click="removeUser(index)"
            >
              <div class="w-11 h-11 rounded relative">
                <div 
                  v-show="$route.query.type === 'create'"
                  class="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gray-400"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 text-white">
                    <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                  </svg>
                </div>
                <base-avatar :image="item.picture" :name="item.name" :width="44" :height="44" />
              </div>
              <p class="text-xs line-clamp-1">{{ item.name }}</p>
            </div>
            <button 
              v-show="$route.query.type === 'create'"
              class="w-11 h-11 border border-dashed rounded border-gray-300 hover:border-primary"
              @click="showAddUserModal"
            >
              <p class="-mt-1 text-3xl font-light hover:text-primary">+</p>
            </button>
          </div>
        </div>
        <!-- 提交 -->
        <div class="w-24">
          <n-button 
            type="primary" 
            block
            :disabled="btnDisabled"
            @click="submit"
          >
            提交
          </n-button>
        </div>
      </div>
    </div>
  </div>
  <!-- 选择审批周报人员 -->
  <add-user-modal ref="addUserRef" @confirm="addUser" />
</template>

<script setup>
import api from '/src/api/index.js'
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { useEditor } from '/src/composables/useEditor.js'
import { useDialog, useMessage } from 'naive-ui'
import useLogStore from '/src/store/log.js'

const route = useRoute()
const router = useRouter()
const clientHeight = document.documentElement.clientHeight
const action = `${import.meta.env.VITE_APP_URL}/userlog/upload`
const message = useMessage()
const { logData, logTemplate, userList } = toRefs(useLogStore())

watch(() => logData.value.logType, newType => {
  document.querySelector('#weeklyLog').scrollTop = 0
  logTemplate.value.subTitles.forEach((item, index) => {
    if(editorRef[`logSpan${index}`]) editorRef[`logSpan${index}`].clear()
  })
})

// 编辑器相关
const active = ref(1)
const { toolbarConfig, editorConfig } = useEditor(message, action)
const editorRef = shallowReactive({
  logSpan1: null,
  logSpan2: null,
  logSpan3: null,
  logSpan4: null,
  logSpan5: null,
})
const handleCreated = (editor, index) => editorRef[`logSpan${index}`] = editor

onBeforeUnmount(() => {
  logTemplate.value.subTitles.forEach((item, index) => {
    if(editorRef[`logSpan${index}`]) editorRef[`logSpan${index}`].destroy()
  })
})

// 上传图片
const changeImgUpload = (imgList) => logData.value.picturePathList = imgList
// 上传附件
const changeFileUpload = (fileList) => logData.value.filePathList = fileList
// 文件格式去id转换
const filterFile = (arr) => {
  let newFile = arr.map(item => {
    return { id: !isNaN(item.id) ? item.id: null, name: item.name, status: item.status, url: item.url}
  })
  return newFile
}

/***** 人员相关 ******/
onMounted(() => {
  if(route.query.type === 'edit') {
    api.get('/userlog/getLogReceiver', { logId: route.query.id }).then((res) => {
      if(res.data.code === 20000 && res.data.data && res.data.data.length > 0) filterUserData(res.data.data)
    })
  }
  if(route.query.type === 'create' && route.query.save === '0') {
    api.get('/userlog/getReceiveUser', { isSubmit: true }).then((res) => {
      if(res.data.code === 20000 && res.data.data && res.data.data.length > 0) filterUserData(res.data.data)
    })
  }
})
const filterUserData = (arr) => {
  arr.forEach((item, index) => {
    logData.value.approverList[index] = item.id
    userList.value.keys[index] = `u${item.id}`
    userList.value.options[index] = {
      checkboxDisabled: false,
      id: item.id,
      key: `u${item.id}`,
      list: null,
      name: item.userName,
      picture: item.headshot ? item.headshot : "",
      type: "user"
    }
  })
}
const addUserRef = ref()
// 展开Modal
const showAddUserModal = () => {
  if(route.query.type === 'create') addUserRef.value.showModal(userList.value.options, userList.value.keys, logData.value.approverList)
}
// 添加人员
const addUser = function({options, keys, ids}) {
  userList.value.options = options
  userList.value.keys = keys
  logData.value.approverList = ids
}
// 删除人员
const removeUser = function(index) {
  if(route.query.type === 'create') {
    userList.value.options.splice(index, 1)
    userList.value.keys.splice(index, 1)
    logData.value.approverList.splice(index, 1)
  }
}
/***** 提交 ******/
const btnDisabled = ref(false)
const submit = function() {
  if(logData.value.approverList.length === 0) {
    message.warning('请选择日志接收人')
    btnDisabled.value = false
    return
  }
  btnDisabled.value = true
  logData.value.picturePathList = filterFile(logData.value.picturePathList)
  logData.value.filePathList = filterFile(logData.value.filePathList)
  if(route.query.type === 'create') createLog()
  if(route.query.type === 'edit') editLog()
}
// 创建日志
const createLog = function() {
  logData.value.id = null
  api.post('/userlog/addUserLog', logData.value).then((res) => {
    if(res.data.code === 20000) {
      message.success('日志提交成功')
      useLogStore().$reset()
      router.replace('/base/log?type=send&sf=1') // sf => showfirst
    }
    setTimeout(() => btnDisabled.value = false, 200)
  })
}
// 修改日志
const editLog = function() {
  logData.value.id = route.query.id
  api.put('/userlog/updateLog', logData.value).then((res) => {
    if(res.data.code === 20000) {
      message.success('日志修改成功')
      router.replace('/base/log?type=send')
      useLogStore().$reset()
    }
    setTimeout(() => btnDisabled.value = false, 200)
  })
}
</script>