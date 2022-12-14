<template>
  <n-card class="w-full h-full" content-style="padding: 0">
    <n-tabs
      v-model:value="active"
      type="line"
      size="large"
      :tabs-padding="20"
      :tab-style="{padding: '16px 0'}"
      pane-style="padding: 0"
      @update:value="changeTabs"
    >
      <n-tab-pane 
        v-for="(item, index) in tabList" 
        :key="index" 
        :name="item.name" 
        :tab="item.tab" 
      />
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
  <approval-modal 
    ref="approvalRef" 
    @approve="handleApproval"
    @cancel="cancelApproval"
  />
</template>

<script setup>
import api from '/src/api/index.js'
import { debounce } from 'lodash'
import { NIcon, useDialog, useMessage } from "naive-ui"
import { default as SearchIcon } from "@vicons/ionicons5/search"
import { useApproval } from '/src/composables/useApproval.js'

const dialog = useDialog()
const message = useMessage()
const route = useRoute()
const router = useRouter()
const clientHeight = ref(document.documentElement.clientHeight)
const basePaginationRef = ref()
// Tabs组件
const active = ref(route.query.type)
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
const params = ref({
  keyWord: '',
  templateId: null
})
const changeTabs = (value) => {
  params.keyWord = ''
  params.templateId = null
  router.replace(`/approval?type=${value}`)
}
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
const { getSummary } = useApproval()

// 查看详情
const approvalRef = ref()
const showDetail = (data) => {
  approvalRef.value.drawer.show = true
  approvalRef.value.drawer.data = data
  approvalRef.value.drawer.form = JSON.parse(data.form)
  approvalRef.value.drawer.state = new Array(JSON.parse(data.form).length).fill(false)
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
        approvalRef.value.drawer.show = false
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
        approvalRef.value.drawer.show = false
      })
    },
    onNegativeClick: () => {}
  })
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