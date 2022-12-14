<template>
  <n-spin :show="showLoading">
    <n-card title="发起申请" class="w-full h-full" content-style="padding: 0">
      <div
        class="w-full overflow-y-scroll" 
        :style="{height: `${clientHeight - 160}px`}"
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
            :show-require-mark="item.options.required"
          >
            <!-- 单行输入文本 -->
            <template v-if="item.type === 'input'">
              <input-component :options="item.options" />
            </template>

            <!-- 多行输入文本 -->
            <template v-if="item.type === 'textarea'">
              <input-textarea-component :options="item.options" />
            </template>

            <!-- 数字输入文本 -->
            <template v-if="item.type === 'inputNumber'">
              <input-number-component :options="item.options" />
            </template>

            <!-- 选择器 -->
            <template v-if="item.type === 'select'">
              <select-component :options="item.options" />
            </template>

            <!-- 单选框 -->
            <template v-if="item.type === 'radio'">
              <radio-component :options="item.options" />
            </template>

            <!-- 多选框 -->
            <template v-if="item.type === 'checkbox'">
              <checkbox-component :options="item.options" />
            </template>

            <!-- 选择日期 -->
            <template v-if="item.type === 'datePicker'">
              <date-picker-component :options="item.options" />
            </template>

            <!-- 上传 -->
            <template v-if="item.type === 'upload'">
              <upload-component :options="item.options" />
            </template>

            <!-- 手机号 -->
            <template v-if="item.type === 'inputPhone'">
              <input-phone-component :options="item.options" />
            </template>

            <!-- 身份证号 -->
            <template v-if="item.type === 'inputId'">
              <input-id-component :options="item.options" />
            </template>

            <!-- 金额 -->
            <template v-if="item.type === 'inputPrice'">
              <input-price-component :options="item.options" />
            </template>

            <!-- 选择职位 -->
            <template v-if="item.type === 'selectPost'">
              <select-post-component :options="item.options" />
            </template>

            <!-- 选择部门 -->
            <template v-if="item.type === 'selectSector'">
              <select-sector-component :options="item.options" />
            </template>

            <!-- 选择成员 -->
            <template v-if="item.type === 'selectUser'">
              <select-user-component :options="item.options"/>
            </template>

            <!-- 合同条款 -->
            <template v-if="item.type === 'contractTerms'">
              <contract-terms-component :options="item.options" />
            </template>

            <!-- 开销明细 -->
            <template v-if="item.type === 'expenseDetails'">
              <expense-Details-component :options="item.options" />
            </template>

            <!-- 物品明细 -->
            <template v-if="item.type === 'itemDetails'">
              <item-Details-component :options="item.options" />
            </template>

            <!-- 选择地址 -->
            <template v-if="item.type === 'selectAddress'">
              <select-address-component :options="item.options" />
            </template>
          </n-form-item>
        </n-form>
        <!-- 流程 -->
        <div v-if="processInfoDTO.approvalsNodeDTOList && processInfoDTO.approvalsNodeDTOList.length > 0" class="px-10 pt-10">
          <h3 class="mb-4 text-2xl font-bold">流程：</h3>
          <div class="mt-8">
            <base-process :list="processInfoDTO.approvalsNodeDTOList" />
          </div>
        </div>
        <!-- 提交 -->
        <div v-if="formList && formList.length > 0" class="mt-4 px-10 pb-10 w-48">
          <n-button block size="large" type="primary" @click="submit">提交</n-button>
        </div>
      </div>
    </n-card>
  </n-spin>
</template>

<script setup>
import api from '/src/api/index.js'
import { useMessage } from 'naive-ui'
import useFormStore from '/src/store/form.js'

const route = useRoute()
const router = useRouter()
const message = useMessage()

const showLoading = ref(true)
const clientHeight = ref(document.documentElement.clientHeight)
const { form } = toRefs(useFormStore())

const processInfoDTO = reactive({
  templateId: null,
  form: '',
  approvalsNodeDTOList: []
  /*
  approvalsNodeDTOList: [
    {
      id: null,
      approvalUserType: null,     // 审批用户类型
      approvalsIdList: [],        // 选中的id列表
      approvalsKeyList: [],       // 选中的key列表
      approvalsOptionList: [],    // 选中的option
      multipleChoice: true,       // 多选
      nodeId: '',                 // 节点id
      nodeName: '',               // 节点名称
      nodeType: '',               // 节点类型
    },
    ……
  ]
*/
})

/*******  表单相关  ******/
const formRef = ref()
const formList = ref([])
const rules = ref({})
// 校验手机号
const checkMobile = (rule, value) => {
  if(value && value.length > 0) {
    if(!/^1[3456789]\d{9}$/.test(value)) return new Error("手机号格式不正确")
    if(/^1[3456789]\d{9}$/.test(value)) return true
  }
}
// 校验身份证号
const checkId = (rule, value) => {
  if(value && value.length > 0) {
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
const checkProSelect = (rule, obj) => {
  if(!obj.id || obj.id.length === 0) return new Error("您还没有进行选择")
}
// 校验人员
const checkUser = (rule, obj) => {
  if(!obj.optionList || obj.optionList.length === 0) return new Error("没有选择人员")
  return true
}
// 校验合同条款
const checkContract = (rule, arr) => {
  if(arr.find(item => !item.content)) return new Error("存在空白条款项，请填写完整")
  return true
}
// 校验开销明细
const checkExpense = (rule, arr) => {
  if(arr.expenseList.find(item => !item.expenseUse || !item.amountSpent)) return new Error("存在未填写的明细，请填写完整")
  return true
}

// 校验物品明细
const checkItemDetails = (rule, arr) => {
  if(arr.find(item => !item.name || item.num === null)) return new Error("存在未填写的明细，请填写完整")
  return true
}

// 获取数据
onMounted(() => getData(route.params.id))
const getData = (id) => {
  showLoading.value = true
  api.get('/process/getProcessTemplate', { templateId: id }).then((res) => {
    if(res.data.code === 20000) {
      processInfoDTO.templateId = res.data.data.templateId
      // 表单
      if(res.data.data.form) {
        formList.value = JSON.parse(res.data.data.form)
        JSON.parse(res.data.data.form).forEach((item, index) => {
          // 单行输入、多行输入、数字输入、选择器、单选组
          if(['inputNumber', 'radio','textarea', 'input'].includes(item.type)) {
            form.value[item.options.id] = null
            if(item.options.required) rules.value[item.options.id] = [{required: true, message: `${item.options.name}不能为空`}]
          }
          // 多选框组
          if(['checkbox'].includes(item.type)) {
            form.value[item.options.id] = null
            if(item.options.required) {
              rules.value[item.options.id] = [{required: true, type: 'array', message: `${item.options.name}不能为空`, trigger: ['blur', 'change']}]
            }
          }
          // 选择器
          if(['select'].includes(item.type)) {
            form.value[item.options.id] = null
            if(item.options.required) {
              rules.value[item.options.id] = [{
                required: true, 
                type: item.options.multiple ? 'array' : 'string', 
                message: `${item.options.name}不能为空`
              }]
            }
          }
          // 选择部门、选择职位、选择地址
          if(['selectSector', 'selectPost', 'selectAddress'].includes(item.type)) {
            form.value[item.options.id] = { name: '', id: null }
            if(item.options.required) rules.value[item.options.id] = [{validator: checkProSelect, trigger: ['blur', 'change']}]
          }
          // 日期选择器
          if(item.type === 'datePicker') {
            form.value[item.options.id] = null
            if(['date', 'datetime', 'month', 'year', 'quarter'].includes(item.options.type) && item.options.required) {
              rules.value[item.options.id] = [{required: true, message: `${item.options.name}不能为空`}]
            }
            if(['daterange', 'datetimerange', 'monthrange', 'yearrange', 'quarterrange'].includes(item.options.type) && item.options.required) {
              rules.value[item.options.id] = [{required: true, type: 'array', message: `${item.options.name}不能为空`, trigger: ['blur', 'change']}]
            }
          }
          // 上传
          if(['upload'].includes(item.type)) {
            form.value[item.options.id] = []
            if(item.options.required) rules.value[item.options.id] = [
              {required: true, type: 'array', message: `${item.options.name}不能为空`, trigger: ['blur', 'change']}
            ]
          }
          // 手机号
          if(item.type === 'inputPhone') {
            form.value[item.options.id] = null
            if(!item.options.required) rules.value[item.options.id] = [
              {validator: checkMobile, min: 11, max: 11, message: `${item.options.name}格式错误`, trigger: ['blur', 'change']}
            ]
            if(item.options.required) rules.value[item.options.id] = [
              {required: true, message: `${item.options.name}不能为空`},
              {validator: checkMobile, min: 11, max: 11, message: `${item.options.name}格式错误`, trigger: ['blur', 'change']}
            ]
          }
          // 身份证号
          if(item.type === 'inputId') {
            form.value[item.options.id] = null
            if(!item.options.required) rules.value[item.options.id] = [
              {validator: checkId, min: 18, max: 18, message: `${item.options.name}格式错误`, trigger: ['blur', 'change']}
            ]
            if(item.options.required) rules.value[item.options.id] = [
              {required: true, message: `${item.options.name}不能为空`},
              {validator: checkId, min: 18, max: 18, message: `${item.options.name}格式错误`, trigger: ['blur', 'change']}
            ]
          }
          // 金额
          if(item.type === 'inputPrice') {
            form.value[item.options.id] = { currency: item.options.currency.length === 1 ? item.options.currency[0].label : null, price: null }
            if(item.options.required) rules.value[item.options.id] = [{ validator: checkPrice, trigger: ['blur', 'change']}]
          }
          // 选择成员
          if(item.type === 'selectUser') {
            form.value[item.options.id] = { optionList: [], keyList: [], idList: [] }
            if(item.options.required) rules.value[item.options.id] = [{ validator: checkUser, trigger: ['blur', 'change']}]
          }
          // 合同条款
          if(item.type === 'contractTerms') {
            form.value[item.options.id] = [{ content: '' }]
            if(item.options.required) rules.value[item.options.id] = [{validator: checkContract, trigger: ['blur', 'change']}]
          }
          // 开销明细
          if(item.type === 'expenseDetails') {
            form.value[item.options.id] = {
              expenseList: [{ expenseUse: '',  amountSpent: '' }],
              total: ''
            }
            if(item.options.required) rules.value[item.options.id] = [{validator: checkExpense}]
          }
          // 物品明细
          if(item.type === 'itemDetails') {
            form.value[item.options.id] = [{ name: '', num: null }]
            if(item.options.required) rules.value[item.options.id] = [{validator: checkItemDetails}]
          }
        })
      }
      // 流程
      if(res.data.data.list && res.data.data.list.length > 0) {
        res.data.data.list.forEach((item, index) => {
          processInfoDTO.approvalsNodeDTOList[index] = {}
          processInfoDTO.approvalsNodeDTOList[index].id = item.id
          processInfoDTO.approvalsNodeDTOList[index].approvalUserType = item.approvalUser
          processInfoDTO.approvalsNodeDTOList[index].multipleChoice = item.multipleChoice
          processInfoDTO.approvalsNodeDTOList[index].nodeId = item.nodeId
          processInfoDTO.approvalsNodeDTOList[index].nodeName = item.nodeName
          processInfoDTO.approvalsNodeDTOList[index].nodeRow = item.nodeRow
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
// 提交表单
const submit = () => {
  formRef.value?.validate((errors) => {
    if (errors) message.error("表单不完整")
    if (!errors) {
      if(processInfoDTO.approvalsNodeDTOList.find(item => item.approvalsOptionList.length === 0)) {
        message.warning('流程不完善')
      } else {
        showLoading.value = true
        formList.value.forEach(item => item['value'] = form.value[item.options.id])
        processInfoDTO.form = JSON.stringify(formList.value)
        api.post('/process/create', processInfoDTO).then((res) => {
          if(res.data.code === 20000) {
            showLoading.value = false
            message.success('提交成功')
            router.push('/approval?type=initiated')
          }
        })
      }
    }
  })
}
// 数据的初始化
const initData = (newId) => {
  processInfoDTO.approvalsNodeDTOList = formList.value = []
  processInfoDTO.templateId = null
  processInfoDTO.form = ''
  useFormStore().$reset()
  rules.value = {}
  getData(newId)
}

watch(() => route.params.id, newId => {
  if(route.name === 'Form') nextTick(() => initData(newId))
})
</script>