<template>
  <n-card class="w-full h-full" content-style="padding: 0">
    <n-tabs 
      :default-value="$route.query.type"
      type="line"
      size="large"
      :tabs-padding="20"
      :tab-style="{padding: '16px 0'}"
      pane-style="padding: 0"
      @update:value="changeTabs"
    >
      <n-tab-pane v-for="(item, index) in tabList" :key="index" :name="item.name" :tab="item.tab" />
      <template #suffix>
        <div class="flex items-center w-full space-x-4 px-4">
          <div class="ml-auto w-80">
            <n-select 
              v-model:value="params.templateId" 
              :options="templateList" 
              label-field="templateName" 
              value-field="templateId" 
              placeholder="筛选：请选择审批模版" 
              clearable 
            />
          </div>
          <div class="ml-4 w-96">
            <n-input placeholder="搜索：请输入关键词" clearable @update:value="searchUpdate">
              <template #prefix>
                <n-icon :component="SearchIcon" />
              </template>
            </n-input>
          </div>
        </div>
      </template>
    </n-tabs>
    <div 
      class="w-full py-3 pl-3 pr-2" 
      :style="{ height: `${clientHeight - 145}px` }"
    >
      <base-pagination
        ref="basePaginationRef"
        :url="urlObj[$route.query.type]"
        :params="params"
        :size="20"
      >
        <template #empty>
          <div
            class="w-full flex flex-col items-center justify-center space-y-2" 
            :style="{height: `${clientHeight - 150}px`}"
          >
            <default-empty v-if="params.keyWord.length === 0" :width="200" :height="200" />
            <search-empty v-if="params.keyWord.length > 0" :width="200" :height="200" />
            <p class="text-xs text-gray-400">{{ params.keyWord.length === 0 ? '数据为空' : '啥也没搜到' }}</p>
          </div>
        </template>
        <template #default="slotProps">
          <div 
            class="overflow-y-scroll reactive" 
            :style="{height: `${clientHeight - 230}px`}"
          >
            <table :bordered="false">
              <thead>
                <tr>
                  <th class="w-28">审批编号</th>
                  <th>标题</th>
                  <th>摘要</th>
                  <th class="w-32">发起人</th>
                  <th>发起时间</th>
                  <th>完成时间</th>
                  <th>审批状态</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in slotProps.list" :key="index">
                  <!-- 审批编号 -->
                  <td class="w-28">{{ item.proTabId || '-' }}</td>
                  <!-- 标题 -->
                  <td>{{ item.stitle || '-' }}</td>
                  <!-- 摘要 -->
                  <td>
                    <template v-for="(i, idx) in JSON.parse(item.form)" :key="idx">
                      <div v-if="(idx < 3)" class="leading-6 flex items-center">
                        <p class="flex-shrink-0">{{ i.options.name }}：</p>
                        <p class="line-1">{{ getSummary(i) }}</p>
                      </div>
                    </template>
                  </td>
                  <!-- 发起人 -->
                  <td>{{ item.userName || '-' }}</td>
                  <!-- 发起时间 -->
                  <td>{{ item.createdTime || '-' }}</td>
                  <!-- 完成时间 -->
                  <td>{{ item.endTime || '-' }}</td>
                  <!-- 审批状态 -->
                  <td>{{ item.approvalsResult || '-' }}</td>
                  <!-- 操作 -->
                  <td class="space-x-6">
                    <!-- 待处理 -->
                    <template v-if="$route.query.type === 'pending'">
                      <n-button text type="success" class="hover:underline" @click="handleApproval(item, true)">同意</n-button>
                      <n-button text type="error" class="hover:underline" @click="handleApproval(item, false)">拒绝</n-button>
                    </template>
                    <!-- 已发起 -->
                    <template v-if="$route.query.type === 'initiated'">
                      <n-button text :disabled="item.approvalsResult === '已撤销'" @click="cancelApproval(item.proTabId)">
                        <span class="text-gray-400 hover:underline">撤销申请</span>
                      </n-button>
                    </template>
                    <n-button text type="primary" class="hover:underline" @click="showDetail(item)">查看详情</n-button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
      </base-pagination>
    </div>
  </n-card>
  <n-drawer v-model:show="showDrawer" :width="600" placement="right">
    <n-drawer-content>
      <template #header>
        <div class="flex items-center space-x-2.5">
          <div 
            class="flex-shrink-0 w-11 h-11 rounded cursor-pointer"
            @click="showCard(4)"
          >
            <base-avatar :image="drawerData.headshot" :name="drawerData.userName" :width="44" :height="44" :font-size="16" />
          </div>
          <div class="w-full flex-grow">
            <p class="text-lg">{{ drawerData.stitle }}</p>
            <p class="text-sm text-gray-500">
              <span>{{ drawerData.createdTime }}</span>
              <span class="ml-5 text-primary">当前状态：{{ drawerData.approvalsResult }}</span>
            </p>
          </div>
        </div>
      </template>
      <!-- content -->
      <div class="space-y-8 pt-2 pb-4">
        <div 
          v-for="(item, index) in JSON.parse(drawerData.form)" 
          :key="index"
          class="space-y-2.5"
        >
          <p class="text-lg font-bold">{{ item.options.name }}</p>
          <p 
            v-if="!['contractTerms', 'expenseDetails', 'itemDetails'].includes(item.type)" 
            class="text-sm text-gray-500"
          >
            {{ getSummary(item)}}
          </p>
          <!-- 合同条款 -->
          <template v-if="item.type === 'contractTerms'">
            <div v-for="(i, idx) in item.value" class="text-sm flex">
              <p class="flex-shrink-0">条款{{ idx + 1 }}：</p>
              <p class="text-gray-500">{{ i.content }}</p>
            </div>
          </template>
          <!-- 开销明细 -->
          <template v-if="item.type === 'expenseDetails'">
            <n-table :bordered="false" :single-line="false" size="small">
              <thead>
                <tr>
                  <th>开销用途</th>
                  <th>开销金额</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(i, idx) in item.value.expenseList">
                  <td>{{ i.expenseUse }}</td>
                  <td>{{ i.amountSpent }}</td>
                </tr>
              </tbody>
            </n-table>
            <p class="text-sm">合计：{{ item.value.total }}</p>
          </template>
          <!-- 物品明细 -->
          <template v-if="item.type === 'itemDetails'">
            <n-table :bordered="false" :single-line="false" size="small">
              <thead>
                <tr>
                  <th>物品名称</th>
                  <th>物品数量</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(i, idx) in item.value">
                  <td>{{ i.name }}</td>
                  <td>{{ i.num }}</td>
                </tr>
              </tbody>
            </n-table>
          </template>
        </div>
      </div>
      <template #footer v-if="['pending', 'initiated'].includes($route.query.type)">
        <div v-if="$route.query.type === 'pending'" class="flex items-center space-x-4">
          <div class="w-28" @click="handleApproval(drawerData, true)">
            <n-button type="primary" block size="large">通过</n-button>
          </div>
          <div class="w-28" @click="handleApproval(drawerData, false)">
            <n-button type="primary" block ghost size="large">不通过</n-button>
          </div>
        </div>
        <div v-if="$route.query.type === 'initiated'" class="w-28">
          <n-button 
            type="primary" 
            block 
            ghost 
            size="large"
            :disabled="drawerData.approvalsResult === '已撤销'"
            @click="cancelApproval(drawerData.proTabId)"
          >
            撤销申请
          </n-button>
        </div>
      </template>
    </n-drawer-content>
  </n-drawer>
  <!-- 名片 -->
  <business-card-modal ref="cardRef" />
</template>

<script setup>
import api from '/src/api/index.js'
import { debounce } from 'lodash'
import { NIcon, useDialog, useMessage } from "naive-ui"
import { default as SearchIcon } from "@vicons/ionicons5/search"

const dialog = useDialog()
const message = useMessage()
const router = useRouter()
const clientHeight = ref(document.documentElement.clientHeight)
const basePaginationRef = ref()

const tabList = [
  { name: 'pending', tab: '待处理' },                                 
  { name: 'processed', tab: '已处理' },
  { name: 'initiated', tab: '已发起' },
  { name: 'received', tab: '我收到的' },
]
let urlObj = {
  pending: '/process/pendingApproval',
  processed: '/process/getAlreadyApproved',
  initiated: '/process/getMySubmit',
  received: '/process/getReceiveCopyTo'
}
const changeTabs = (value) => router.replace(`/approval?type=${value}`)
const params = ref({
  keyWord: '',
  templateId: null
})

// 模版列表
let templateList = ref([])
api.get('/process/getTemplateList').then((res) => {
  if(res.data.data && res.data.data.length > 0) {
    templateList.value = [].concat.apply([], res.data.data.map(item => { return item.templateVOList }))
  }
})

// 搜索
const searchUpdate = debounce((text) => {
  params.value.keyWord = text
}, 300, { leading: false, trailing: true})

onUnmounted(() => {
  searchUpdate.cancel()
})

// 摘要
const getSummary = ({type, value, options}) => {
  if(!value) return '-'
  if(value) {
    // 选择成员
    if(type === 'selectUser') {
      if(!value.optionList || value.optionList.length === 0) return '-'
      if(value.optionList || value.optionList.length > 0) return value.optionList.map(item => item.name).join('、')
    }
    // 选择日期
    if(type === 'datePicker' && typeof(value) === 'object') return value.join(' 至 ')
    // 金额
    if(type === 'inputPrice') return !value.price ? '-' : `${value.price} (${value.currency})`
    // 多选框组
    if(['checkbox'].includes(type)) return value.join('、')
    // 选择器
    if(['select'].includes(type) && options.multiple) return value.join('、')
    // 特殊
    if(['selectSector', 'selectPost', 'selectAddress'].includes(type)) return value.name
    if(['contractTerms', 'expenseDetails', 'itemDetails'].includes(type)) return '……'
    return value
  }
}

// 审批
const handleApproval = function(data, flag) {
  dialog.warning({
    title: '提示',
    content: `你确定要${flag ? '同意' : '拒绝'}该审批申请吗？`,
    positiveText: '确定',
    negativeText: '不确定',
    onPositiveClick: () => {
      api.put('/process/approval', {
        comment: '',
        flag: flag,
        processId: data.procInstId,
        requestId: data.proTabId,
        taskId: data.taskId,
        templateId: data.templateId,
        form: data.form
      }).then((res) => {
        if(res.data.code === 20000) message.success('操作成功')
        basePaginationRef.value.askApi()
        showDrawer.value = false
      })
    },
    onNegativeClick: () => {}
  })
}
// 撤销
const cancelApproval = (id) => {
  dialog.warning({
    title: '提示',
    content: `你确定要撤销该审批申请吗？`,
    positiveText: '确定',
    negativeText: '不确定',
    onPositiveClick: () => {
      api.post('/process/repealRequest', { requestId: id }).then((res) => {
        if(res.data.code === 20000) message.success('撤销成功')
        basePaginationRef.value.askApi()
        showDrawer.value = false
      })
    },
    onNegativeClick: () => {}
  })
}

// 查看详情
const showDrawer = ref(false)
const drawerData = ref({})
const showDetail = (data) => {
  drawerData.value = data
  showDrawer.value = true
}

/******** 名片 ********/
const cardRef = ref()
const showCard = function(id) {
  cardRef.value.showCard(id)
}
</script>

<style>
table {
  @apply w-full table-fixed !important
}
thead tr th {
  @apply sticky top-0 text-left leading-10 py-2 px-4 bg-gray-100 rounded-sm z-10 !important
}
td {
  @apply text-gray-500 border-b border-gray-100 leading-10 px-4 py-2.5
}
</style>