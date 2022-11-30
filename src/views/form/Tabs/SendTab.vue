<!-- 发起申请 -->
<template>
  <n-spin :show="showLoading">
    <div
      class="w-full overflow-y-scroll" 
      :style="{height: `${clientHeight - 150}px`}"
    >
      <!-- 表单 -->
      <n-form
        ref="formRef"
        :model="form" 
        :rules="rules" 
        label-placement="left"
        require-mark-placement="left"
        class="px-10 mt-4 w-7/12"
        label-width="130"
      >
        <n-form-item 
          v-for="(item, index) in formList" 
          :key="index" 
          :path="item.options.id"
          :label="`${item.options.name}：`"
        >
          <!-- 单行输入文本 -->
          <template v-if="item.type === 'input'">
            <input-component :options="item.options" @change="(value) => form[item.options.id] = value" />
          </template>

          <!-- 多行输入文本 -->
          <template v-if="item.type === 'textarea'">
            <input-textarea-component :options="item.options" @change="(value) => form[item.options.id] = value" />
          </template>

          <!-- 数字输入文本 -->
          <template v-if="item.type === 'inputNumber'">
            <input-number-component :options="item.options" @change="(value) => form[item.options.id] = value" />
          </template>

          <!-- 选择器 -->
          <template v-if="item.type === 'select'">
            <select-component :options="item.options" @change="(value) => form[item.options.id] = value" />
          </template>

          <!-- 单选框 -->
          <template v-if="item.type === 'radio'">
            <radio-component :options="item.options" @change="(value) => form[item.options.id] = value" />
          </template>

          <!-- 多选框 -->
          <template v-if="item.type === 'checkbox'">
            <checkbox-component :options="item.options" @change="(value) => form[item.options.id] = value" />
          </template>

          <!-- 选择日期 -->
          <template v-if="item.type === 'datePicker'">
            <date-picker-component :options="item.options" @change="(value) => form[item.options.id] = value" />
          </template>

          <!-- 上传 -->
          <template v-if="item.type === 'upload'">
            <upload-component :options="item.options" @change="(list) => form[item.options.id] = list" />
          </template>

          <!-- 手机号 -->
          <template v-if="item.type === 'inputPhone'">
            <input-phone-component :options="item.options" @change="(value) => form[item.options.id] = value" />
          </template>

          <!-- 身份证号 -->
          <template v-if="item.type === 'inputId'">
            <input-id-component :options="item.options" @change="(value) => form[item.options.id] = value" />
          </template>

          <!-- 金额 -->
          <template v-if="item.type === 'inputPrice'">
            <input-price-component 
              :options="item.options" 
              @change="(currency, price) => {
                form[item.options.id].currency = currency
                form[item.options.id].price = price
            }" />
          </template>

          <!-- 选择职位 -->
          <template v-if="item.type === 'selectPost'">
            <select-post-component :options="item.options" @change="(value) => form[item.options.id] = value" />
          </template>

          <!-- 选择部门 -->
          <template v-if="item.type === 'selectSector'">
            <select-sector-component :options="item.options" @change="(value) => form[item.options.id] = value" />
          </template>
        </n-form-item>
      </n-form>
      <!-- 流程 -->
      <div v-if="processInfoDTO.approvalsNodeDTOList && processInfoDTO.approvalsNodeDTOList.length > 0" class="px-10 pt-10">
        <h3 class="mb-4 text-2xl font-bold">流程：</h3>
        <div class="mt-8">
          <div v-for="(item, index) in processInfoDTO.approvalsNodeDTOList" :key="index">
            <div class="flex space-x-4">
              <div class="flex-shrink-0 w-10 h-10 rounded bg-white shadow py-1.5">
                <svg v-if="item.nodeType === 1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" class="text-orange-500 w-[1.65rem] h-[1.65rem] mx-auto">
                  <path d="M32 512h448v-64H32v64zm384-256h-66.56c-16.26 0-29.44-13.18-29.44-29.44v-9.46c0-27.37 8.88-53.41 21.46-77.72c9.11-17.61 12.9-38.39 9.05-60.42c-6.77-38.78-38.47-70.7-77.26-77.45C212.62-9.04 160 37.33 160 96c0 14.16 3.12 27.54 8.69 39.58C182.02 164.43 192 194.7 192 226.49v.07c0 16.26-13.18 29.44-29.44 29.44H96c-53.02 0-96 42.98-96 96v32c0 17.67 14.33 32 32 32h448c17.67 0 32-14.33 32-32v-32c0-53.02-42.98-96-96-96z" fill="currentColor"></path>
                </svg>
                <svg v-if="item.nodeType === 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-7 h-7 text-primary mx-auto">
                  <path fill-rule="evenodd" d="M7.502 6h7.128A3.375 3.375 0 0118 9.375v9.375a3 3 0 003-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 00-.673-.05A3 3 0 0015 1.5h-1.5a3 3 0 00-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6zM13.5 3A1.5 1.5 0 0012 4.5h4.5A1.5 1.5 0 0015 3h-1.5z" clip-rule="evenodd" />
                  <path fill-rule="evenodd" d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 013 20.625V9.375zM6 12a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V12zm2.25 0a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75zM6 15a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V15zm2.25 0a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75zM6 18a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V18zm2.25 0a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75z" clip-rule="evenodd" />
                </svg>
                <svg v-if="item.nodeType === 3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-7 h-7 text-blue-500 mx-auto">
                  <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                </svg>
              </div>
              <div class="space-y-0.5">
                <p class="text-lg font-bold leading-5 text-gray-600">{{ item.nodeName }}</p>
                <p class="text-sm text-gray-400">
                  <span v-if="item.approvalUserType === 0">指定成员（共{{ item.approvalsOptionList.length }}人）</span>
                  <span v-if="item.approvalUserType === 1">自选</span>
                  <span v-if="item.approvalUserType === 2">部门主管</span>
                  <span v-if="item.approvalUserType === 3">直属上级</span>
                  <span v-if="item.approvalUserType === 4">指定角色成员（共{{ item.approvalsOptionList.length }}人）</span>
                  <span v-if="item.approvalUserType === 5">发起人自己</span>
                </p>
              </div>
            </div>
            <div class="w-7/12 h-full pt-2 pb-4">
              <div
                class="ml-5 pl-8 pr-4 pt-2 min-h-[3rem]"
                :class="{'border-l': processInfoDTO.approvalsNodeDTOList.length - 1 > index}"
              >
                <template v-if="item.approvalUserType !== 1">
                  <div class="flex flex-wrap">
                    <div 
                      v-for="(userInfo, userIndex) in item.approvalsOptionList" :key="userIndex" 
                      class="mr-4 mb-3 w-11 space-y-1 cursor-pointer hover:opacity-80"
                      @click="showCard(userInfo.id)"
                    >
                      <base-avatar :image="userInfo.headshot" :name="userInfo.name" />
                      <p class="text-sm text-gray-500 line-1">{{ userInfo.name }}</p>
                    </div>
                  </div>
                </template>
                <!-- 自选 -->
                <template v-if="item.approvalUserType === 1">
                  <div class="w-full flex flex-wrap">
                    <div 
                      v-for="(userInfo, userIndex) in item.approvalsOptionList" :key="userIndex" 
                      class="mr-4 mb-3 w-11 cursor-pointer relative hover:opacity-80"
                      @click="showCard(userInfo.id)"
                    >
                      <div class="w-11 h-11 rounded relative">
                        <div 
                          class="absolute -top-1.5 -right-1 w-4 h-4 rounded-full bg-gray-400 hover:bg-gray-600"
                          @click.stop="removeUser(index, userIndex)"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 text-white">
                            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                          </svg>
                        </div>
                        <base-avatar :image="userInfo.headshot" :name="userInfo.name" />
                      </div>
                      <p class="text-sm text-gray-500 line-1">{{ userInfo.name }}</p>
                    </div>
                    <button 
                      class="w-11 h-11 border border-dashed rounded border-gray-300 mb-3 hover:border-primary"
                      @click="showAddUserModal(index)"
                    >
                      <p class="-mt-2 text-3xl font-light hover:text-primary">+</p>
                    </button>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 提交 -->
      <div v-if="formList && formList.length > 0" class="mt-4 px-10 pb-10 w-48">
        <n-button block size="large" type="primary" @click="submit">提交</n-button>
      </div>
    </div>
  </n-spin>
  <!-- 选择人员 -->
  <add-user-modal ref="addUserRef" @confirm="addUser" />
  <!-- 名片 -->
  <business-card-modal ref="cardRef" />
</template>

<script setup>
import api from '/src/api/index.js'
import { useMessage } from 'naive-ui'

const route = useRoute()
const emit = defineEmits(['submit'])
const message = useMessage()
const clientHeight = ref(document.documentElement.clientHeight)
const showLoading = ref(true)

const processInfoDTO = reactive({
  templateId: null,
  form: '',
  approvalsNodeDTOList: []
    // {
    //   id: null,
    //   approvalUserType: null,     // 审批用户类型
    //   approvalsIdList: [],        // 选中的id列表
    //   approvalsKeyList: [],       // 选中的key列表
    //   approvalsOptionList: [],    // 选中的option
    //   multipleChoice: true,       // 多选
    //   nodeId: '',                 // 节点id
    //   nodeName: '',               // 节点名称
    //   nodeType: '',               // 节点类型
    // }
})

/*******  表单相关  ******/
const formRef = ref()
const formList = ref([])
const form = ref({})
const rules = ref({})

/*******  流程相关  ******/
const addUserRef = ref()
const processActive = ref(0)
// 开弹窗
const showAddUserModal = (index) => {
  processActive.value = index
  let userData = processInfoDTO.approvalsNodeDTOList[index]
  addUserRef.value.showModal(userData.approvalsOptionList, userData.approvalsKeyList, userData.approvalsIdList)
}
// 添加人员
const addUser = function({options, keys, ids}) {
  console.log(options)
  let userData = processInfoDTO.approvalsNodeDTOList[processActive.value]
  userData.approvalsOptionList = options
  userData.approvalsKeyList = keys
  userData.approvalsIdList = ids
}
// 删除人员
const removeUser = (index, userIndex) => {
  let userData = processInfoDTO.approvalsNodeDTOList[index]
  userData.approvalsOptionList.splice(userIndex, 1)
  userData.approvalsKeyList.splice(userIndex, 1)
  userData.approvalsIdList.splice(userIndex, 1)
}
// 校验手机号
const checkMobile = (rule, value) => {
  if(value.length > 0) {
    if(!/^1[3456789]\d{9}$/.test(value)) return new Error("手机号格式不正确")
    if(/^1[3456789]\d{9}$/.test(value)) return true
  }
}
// 校验身份证号
const checkId = (rule, value) => {
  if(value.length > 0) {
    if(!/^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(value)) return new Error("身份证号格式不正确")
    if(/^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(value)) return true
  }
}
// 校验金额
const checkPrice = (rule, obj) => {
  if(!obj.currency) return new Error("没有选择货币类型")
  if(!obj.price) return new Error("没有输入金额")
  return true
}
// 获取数据
const getData = (id) => {
  showLoading.value = true
  api.get('/process/getProcessTemplate', { templateId: id }).then((res) => {
    if(res.data.code === 20000) {
      processInfoDTO.templateId = res.data.data.templateId
      // 表单
      if(res.data.data.form) {
        formList.value = JSON.parse(res.data.data.form)
        JSON.parse(res.data.data.form).forEach((item, index) => {
          // 单行输入、多行输入、数字输入、选择器、单选组、多选组、选择职位、选择部门
          if(['inputNumber', 'select', 'radio', 'checkbox','textarea', 'input', 'selectPost', 'selectSector'].includes(item.type)) {
            form.value[item.options.id] = null
            if(item.options.required) rules.value[item.options.id] = [{required: true, message: `${item.options.name}不能为空`}]
          }
          // 日期选择器
          if(item.type === 'datePicker') {
            form.value[item.options.id] = null
            if(['date', 'datetime', 'month', 'year', 'quarter'].includes(item.options.type)) {
              if(item.options.required) rules.value[item.options.id] = [{required: true, message: `${item.options.name}不能为空`}]
            }
            if(['daterange', 'datetimerange', 'monthrange', 'yearrange', 'quarterrange'].includes(item.options.type)) {
              if(item.options.required) rules.value[item.options.id] = [{required: true, type: 'array', message: `${item.options.name}不能为空`, trigger: ['blur', 'change']}]
            }
          }
          // 上传
          if(['upload'].includes(item.type)) {
            form.value[item.options.id] = []
            if(item.options.required) rules.value[item.options.id] = [{required: true, type: 'array', message: `${item.options.name}不能为空`, trigger: ['blur', 'change']}]
          }
          // 手机号
          if(item.type === 'inputPhone') {
            form.value[item.options.id] = null
            rules.value[item.options.id] = [{ validator: checkMobile, min: 11, max: 11, message: `${item.options.name}格式错误`, trigger: ['blur', 'change']}]
            if(item.options.required) rules.value[item.options.id].push({required: true, message: `${item.options.name}不能为空`})
          }
          // 身份证号
          if(item.type === 'inputId') {
            form.value[item.options.id] = null
            rules.value[item.options.id] = [{ validator: checkId, min: 18, max: 18, message: `${item.options.name}格式错误`, trigger: ['blur', 'change']}]
            if(item.options.required) rules.value[item.options.id].push({required: true, message: `${item.options.name}不能为空`})
          }
          // 金额
          if(item.type === 'inputPrice') {
            form.value[item.options.id] = { currency: item.options.currency.length === 1 ? item.options.currency[0].label : null, price: '' }
            rules.value[item.options.id] = [{ validator: checkPrice, trigger: ['blur', 'change']}]
          }
        })
      }
      // 流程
      if(res.data.data.list && res.data.data.list.length > 0) {
        res.data.data.list.forEach((item, index) => {
          processInfoDTO.approvalsNodeDTOList[index] = {}
          processInfoDTO.approvalsNodeDTOList[index].id = item.id
          processInfoDTO.approvalsNodeDTOList[index].approvalUserType = item.userSimpleVOList ? item.approvalUser : 1
          processInfoDTO.approvalsNodeDTOList[index].multipleChoice = item.multipleChoice
          processInfoDTO.approvalsNodeDTOList[index].nodeId = item.nodeId
          processInfoDTO.approvalsNodeDTOList[index].nodeName = item.nodeName
          processInfoDTO.approvalsNodeDTOList[index].nodeType = item.nodeType
          processInfoDTO.approvalsNodeDTOList[index].approvalsOptionList = item.userSimpleVOList ? item.userSimpleVOList : []
          processInfoDTO.approvalsNodeDTOList[index].approvalsIdList = item.userSimpleVOList ? item.userSimpleVOList.map(i => i.id) : []
          processInfoDTO.approvalsNodeDTOList[index].approvalsKeyList = item.userSimpleVOList ? item.userSimpleVOList.map(i => `u${i.id}`) : []
        })
      }
    }
    setTimeout(() => showLoading.value = false, 200)
  })
}
onMounted(() => getData(route.params.id))
const initData = (newId) => {
  processInfoDTO.approvalsNodeDTOList = formList.value = []
  processInfoDTO.templateId = null
  processInfoDTO.form = ''
  form.value = {}
  rules.value = {}
  getData(newId)
}
// 提交表单
const submit = () => {
  formRef.value?.validate((errors) => {
    if (errors) message.error("表单不完整")
    if (!errors) {
      if(processInfoDTO.approvalsNodeDTOList.find(item => item.approvalsOptionList.length === 0)) {
        message.warning('流程不完善')
      } else {
        formList.value.forEach(item => item['value'] = form.value[item.options.id])
        processInfoDTO.form = JSON.stringify(formList.value)
        api.post('/process/create', processInfoDTO).then((res) => {
          alert('提交成功')
          emit('submit')
        })
      }
    }
  })
}

/******** 名片 ********/
const cardRef = ref()
const showCard = function(id) {
  cardRef.value.showCard(id)
}

defineExpose({
  initData
})
</script>
