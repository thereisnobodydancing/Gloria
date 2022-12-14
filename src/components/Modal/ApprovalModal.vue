<template>
  <n-drawer v-model:show="drawer.show" :width="600" placement="right" class="p-0">
    <n-drawer-content>
      <!-- header -->
      <template #header>
        <div class="flex items-center space-x-2.5">
          <div 
            class="flex-shrink-0 w-11 h-11 rounded cursor-pointer"
            @click="showCard(4)"
          >
            <base-avatar :image="drawer.data.headshot" :name="drawer.data.userName" :width="44" :height="44" :font-size="16" />
          </div>
          <div class="w-full flex-grow">
            <p class="text-lg">{{ drawer.data.stitle }}</p>
            <p class="text-sm text-gray-500">
              <span>{{ drawer.data.createdTime }}</span>
              <span class="ml-5 text-primary">当前状态：{{ drawer.data.approvalsResult }}</span>
            </p>
          </div>
        </div>
      </template>
      <!-- content -->
      <div class="space-y-8 pt-2 pb-4">
        <div v-for="(item, index) in drawer.form" :key="index">
          <!-- 只显示可读信息 -->
          <div v-if="showRead($route.query.type, item.options.id)">
            <div class="w-full flex items-center justify-between">
              <p class="text-sm text-gray-400">{{ item.options.name }}</p>
              <div v-if="showEditBtn($route.query.type, item.options.id)">
                <n-button text @click="drawer.state[index] = !drawer.state[index]">
                  <span class="text-gray-500 hover:text-primary">{{ drawer.state[index] ? '确定' : '编辑' }}</span>
                </n-button>
              </div>
            </div>
            <!-- 只读状态 -->
            <div v-if="!drawer.state[index]">
              <template v-if="!['contractTerms', 'expenseDetails', 'itemDetails', 'selectUser'].includes(item.type)">
                <p class="text-base text-gray-600">{{ getSummary(item)}}</p>
              </template>
              <!-- 合同条款 -->
              <template v-if="item.type === 'contractTerms'">
                <div v-for="(i, idx) in item.value" class="mt-2.5 flex text-gray-600 text-sm">
                  <p class="flex-shrink-0 font-bold">条款{{ idx + 1 }}：</p>
                  <p class="bg-gray-100 w-full py-2.5 px-2.5 rounded">{{ i.content }}</p>
                </div>
              </template>
              <!-- 开销明细 -->
              <template v-if="item.type === 'expenseDetails'">
                <n-table :bordered="false" :single-line="false" size="small" class="mt-2">
                  <thead>
                    <tr>
                      <th class="w-2/3">开销用途</th>
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
                <p class="mt-2 text-sm text-gray-400 space-x-8">
                  <span>合计：{{ item.value.total }}</span>
                  <span>大写金额：{{ numToCny(item.value.total) }}</span>
                </p>
              </template>
              <!-- 物品明细 -->
              <template v-if="item.type === 'itemDetails'">
                <n-table :bordered="false" :single-line="false" size="small" class="mt-2">
                  <thead>
                    <tr>
                      <th class="w-2/3">物品名称</th>
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
              <!-- 选择成员 -->
              <template v-if="item.type === 'selectUser'">
                <div class="mt-2 w-full flex flex-wrap">
                  <div
                    v-for="(i, idx) in item.value.optionList"
                    :key="idx"
                    class="mr-6 mb-8 w-10 h-10 rounded-md cursor-pointer hover:opacity-90 relative"
                    :class="{'bg-primary': !i.picture}"
                    @click="showCard(i.id)"
                  >
                    <!-- 头像 -->
                    <base-avatar :image="i.picture" :name="i.name" />
                    <p class="mt-1 text-xs text-gray-500 line-1">{{ i.name }}</p>
                  </div>
                </div>
              </template>
            </div>
            <!-- 编辑状态 -->
            <div v-else>
              {{ item.type }}
              <!-- 单行输入框 -->
              <template v-if="item.type === 'input'">
                <n-input
                  v-model:value="item.value" 
                  :type="item.options.type" 
                  :showCount="item.options.showCount ? true : false"
                  :maxlength="item.options.showCount ? item.options.maxLength : undefined"
                  :placeholder="item.options.placeholder" 
                  clearable
                />
              </template>
              <!-- 多行输入框 -->
              <template v-if="item.type === 'textarea'">
                <n-input 
                  v-model:value="item.value" 
                  type="textarea" 
                  :showCount="item.options.showCount ? true : false"
                  :maxlength="item.options.showCount ? item.options.maxLength : undefined"
                  :placeholder="item.options.placeholder" 
                  :autosize="{minRows: 3}" 
                  clearable 
                />
              </template>
              <!-- 数字输入框 -->
              <template v-if="item.type === 'inputNumber'">
                <n-input-number
                  v-model:value="item.value" 
                  :placeholder="item.options.placeholder" 
                  :min="item.options.useMin ? item.options.min : undefined"
                  :max="item.options.useMax ? item.options.max : undefined"
                  clearable
                />
              </template>
              <!-- 选择器 -->
              <template v-if="item.type === 'select'">
                <n-select 
                  v-model:value="item.value" 
                  :options="item.options.list" 
                  :placeholder="item.options.placeholder"
                  :multiple="item.options.multiple"
                  value-field="label"
                  clearable
                />
              </template>
              <!-- 单选框组 -->
              <template v-if="item.type === 'radio'">
                <n-radio-group
                  v-model:value="item.value" 
                  name="radiogroup" 
                  class="leading-8"
                >
                  <n-space>
                    <n-radio 
                      v-for="i in item.options.list" 
                      :key="i.label" 
                      :value="i.label"
                    >
                      {{ i.label }}
                    </n-radio>
                  </n-space>
                </n-radio-group>
              </template>
              <!-- 多选框组 -->
              <template v-if="item.type === 'checkbox'">
                <n-checkbox-group v-model:value="item.value">
                  <n-space item-style="display: flex">
                    <n-checkbox 
                      v-for="i in item.options.list" 
                      :key="i.label" 
                      :value="i.label"
                    >
                      {{ i.label }}
                    </n-checkbox>
                  </n-space>
                </n-checkbox-group>
              </template>
              <!-- 日期选择器 -->
              <template v-if="item.type === 'datePicker'">
                <n-date-picker
                  v-model:formatted-value="item.value"
                  :type="item.options.type" 
                  :format="dateFeature[item.options.type]"
                  :start-placeholder="datePlaceholder[item.options.type] ? datePlaceholder[item.options.type].start : null" 
                  :end-placeholder="datePlaceholder[item.options.type] ? datePlaceholder[item.options.type].end : null"
                  clearable
                />
              </template>
              <!-- 电话号码 -->
              <template v-if="item.type === 'inputPhone'">
                <n-input
                  v-model:value="item.value" 
                  :type="item.options.type" 
                  :showCount="true"
                  :maxlength="11"
                  :placeholder="item.options.placeholder" 
                  clearable
                />
              </template>
              <!-- 身份证号 -->
              <template v-if="item.type === 'inputId'">
                <n-input
                  v-model:value="item.value" 
                  :type="item.options.type" 
                  :showCount="true"
                  :maxlength="18"
                  :placeholder="item.options.placeholder" 
                  clearable
                />
              </template>
              <!-- 金额 -->
              <template v-if="item.type === 'inputPrice'">
                <n-input-group v-if="item.options.currency">
                  <n-input-group-label 
                    class="w-32"
                    v-if="item.options.currency.length === 1"
                  >
                    {{ item.options.currency[0].label }}
                  </n-input-group-label>
                  <n-select 
                    v-if="item.options.currency.length > 1"
                    v-model:value="item.value.currency"
                    :options="item.options.currency" 
                    value-field="label"
                    placeholder="请选择币种" 
                    :style="{ width: '200px' }"
                  />
                  <n-input-number
                    v-model:value="item.value.price" 
                    :placeholder="item.options.placeholder" 
                    class="w-full"
                    clearable
                  />
                </n-input-group>
                <p v-if="item.options.showUppercase" class="mt-1 text-sm text-gray-600">{{ numToCny(item.value.price) }}</p>
              </template>
              <!-- 合同条款 -->
              <template v-if="item.type === 'contractTerms'">
                <div v-if="item.value && item.value.length > 0" class="w-full space-y-2.5">
                  <div
                    v-for="(i, idx) in item.value" 
                    class="w-full flex space-x-3"
                  >
                    <p class="flex-shrink-0 w-16 font-bold leading-8 text-right text-sm text-gray-500">条款 {{ idx + 1 }}：</p>
                    <n-input 
                      v-model:value="i.content" 
                      type="textarea" 
                      :placeholder="`请输入条款 ${idx + 1}`" 
                      clearable 
                      :autosize="{ minRows: 2}" 
                    />
                    <div 
                      class="ml-auto flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full"
                      :class="idx > 0 ? 'text-gray-500 cursor-pointer hover:bg-red-50 hover:text-red-600' : 'text-gray-300 cursor-not-allowed'"
                      @click="() => {if(idx > 0) { item.value.splice(idx, 1) }}"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                  </div>
                  <n-button type="tertiary" class="block ml-20" @click="() => {item.value.push({ content: '' })}">+增加条款</n-button>
                </div>
              </template>
              <!-- 开销明细 -->
              <template v-if="item.type === 'expenseDetails'">
                <div v-if="item.value.expenseList && item.value.expenseList.length > 0" class="w-full space-y-2.5">
                  <div
                    v-for="(i, idx) in item.value.expenseList" 
                    :key="idx"
                    class="flex items-center space-x-2.5"
                  >
                    <div class="w-2/3">
                      <n-input v-model:value="i.expenseUse" placeholder="请输入开销用途" clearable />
                    </div>
                    <div class="w-1/3">
                      <n-input 
                        v-model:value="i.amountSpent" 
                        type="number" 
                        placeholder="请输入开销金额" 
                        clearable 
                        @input="item.value.total = '' + item.value.expenseList.reduce((sum, item) => +sum + +item.amountSpent, 0)" 
                      />
                    </div>
                    <div
                      class="ml-auto flex-shrink-0 p-1 rounded-full"
                      :class="idx > 0 ? 'text-gray-500 cursor-pointer hover:bg-red-50 hover:text-red-600' : 'text-gray-300 cursor-not-allowed'"
                      @click="() => {
                        if(idx > 0) item.value.expenseList.splice(idx, 1)
                        if(i.amountSpent) item.value.total = '' + item.value.expenseList.reduce((sum, item) => +sum + +item.amountSpent, 0)
                      }"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                  </div>
                  <n-button type="tertiary" class="block" @click="item.value.expenseList.push({ expenseUse: '',  amountSpent: '' })">+增加明细</n-button>
                  <p v-if="item.value.total" class="mt-1 text-sm text-gray-500 space-x-10">
                    <span>开销总计：{{ item.value.total }}</span>
                    <span>大写金额：{{ numToCny(item.value.total) }}</span>
                  </p>
                </div>
              </template>
              <!-- 物品明细 -->
              <template v-if="item.type === 'itemDetails'">
                <div 
                  v-if="item.value && item.value.length > 0" 
                  class="w-full"  
                >
                  <div class="w-full space-y-6">
                    <div
                      v-for="(i, idx) in item.value"
                      :key="idx"
                      class="mt-2 space-y-4"
                    >
                      <div class="flex items-center">
                        <p class="font-bold text-sm">明细 {{ idx+1 }}</p>
                        <button 
                          v-if="idx > 0"
                          class="ml-auto text-primary text-sm"
                          @click="() => {if(idx > 0) item.value.splice(idx, 1)}"
                        >
                          删除
                        </button>
                      </div>
                      <div class="ml-2 space-y-2">
                        <!-- 物品名称 -->
                        <div class="w-full flex items-center">
                          <p class="text-sm text-gray-400 w-20 flex-shrink-0 leading-8">物品名称：</p>
                          <n-input v-model:value="i.name" placeholder="请输入物品名称" clearable />
                        </div>
                        
                        <!-- 物品数量 -->
                        <div class="w-full flex items-center">
                          <p class="text-sm text-gray-400 w-20 flex-shrink-0 leading-8">物品数量：</p>
                          <n-input-number v-model:value="i.num" placeholder="请输入物品数量" clearable class="w-full" />
                        </div>
                      </div>
                    </div>
                    <n-button type="tertiary" @click="item.value.push({ name: '',  num: null })">+增加物品明细</n-button>
                  </div>
                </div>
              </template>
              <!-- 选择职位 -->
              <template v-if="item.type === 'selectPost'">
                <n-select
                  v-model:value="item.value.id"
                  :options="positionOptions"
                  label-field="positionName"
                  value-field="id" 
                  :placeholder="item.options.placeholder"
                  :multiple="item.options.multiple"
                  clearable
                  @update:value="(keys, option) => {
                    if(!keys) item.value.name = ''
                    if(keys && !item.options.multiple) item.value.name = option.positionName
                    if(keys && item.options.multiple) item.value.name = option.map(i => i.positionName).join('、')
                  }"
                />
              </template>
              <!-- 选择部门 -->
              <template v-if="item.type === 'selectSector'">
                <n-tree-select
                  v-model:value="item.value.id"
                  :options="sectorList"
                  placeholder="请选择部门"
                  children-field="list"
                  key-field="sectorId"
                  label-field="sectorName"
                  :multiple="item.options.multiple"
                  :cascade="item.options.multiple"
                  :checkable="item.options.multiple"
                  filterable
                  clearable
                  @update:value="(keys, option) => {
                    if(!keys) item.value.name = ''
                    if(keys && !item.options.multiple) item.value.name = option.sectorName
                    if(keys && item.options.multiple) item.value.name = option.map(i => i.sectorName).join('、')
                  }"
                />
              </template>
              <!-- 选择成员 -->
              <!-- 选择成员 -->
              <template v-if="item.type === 'selectUser'">
                <div class="mt-2 w-full flex flex-wrap">
                  <div
                    v-for="(i, idx) in item.value.optionList"
                    :key="idx"
                    class="mr-6 mb-8 w-10 h-10 rounded-md cursor-pointer hover:opacity-90 relative"
                    :class="{'bg-primary': !i.picture}"
                    @click="showCard(i.id)"
                  >
                    <!-- 头像 -->
                    <base-avatar :image="i.picture" :name="i.name" />
                    <p class="mt-1 text-xs text-gray-500 line-1">{{ i.name }}</p>
                    <!-- 删除符号 -->
                    <div
                      class="absolute -top-3 -right-4"
                      @click.prevent.stop="() => {
                        item.value.keyList.splice(item.value.keyList.indexOf(i.key), 1)
                        item.value.idList.splice(item.value.idList.indexOf(i.id), 1)
                        item.value.optionList.splice(idx, 1)
                      }"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-6 h-6 text-gray-300 hover:text-red-500">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
      <!-- footer -->
      <template #footer v-if="['pending', 'initiated'].includes($route.query.type)">
        <div v-if="$route.query.type === 'pending'" class="flex items-center space-x-4">
          <div class="w-28" @click="handleApproval(true)">
            <n-button type="primary" block size="large">通过</n-button>
          </div>
          <div class="w-28" @click="handleApproval(false)">
            <n-button type="primary" block ghost size="large">不通过</n-button>
          </div>
        </div>
        <div v-if="$route.query.type === 'initiated'" class="w-28">
          <n-button
            type="primary" 
            block 
            ghost 
            size="large"
            :disabled="drawer.data.approvalsResult === '已撤销'"
            @click="cancelApproval(drawer.data.proTabId)"
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
import { useApproval } from '/src/composables/useApproval.js'
import { useDateData } from '/src/composables/useDateData.js'
import { numToCny } from '/src/until/index.js'
const emit = defineEmits(['approve', 'cancel'])
const props = defineProps({
  data: Object
})

const drawer = reactive({
  show: false,
  data: {},
  form: [],
  state: []
})

const { getSummary } = useApproval()
const { datePlaceholder, dateFeature } = useDateData()

// 显示默认
const showRead = (type, id) => {
  if(['processed', 'initiated'].includes(type)) return true
  if(['pending', 'received'].includes(type) && drawer.data.formReadPerm.includes(id)) return true
  return false
}
// 显示编辑按钮
const showEditBtn = (type, id) => {
  if(['pending', 'received'].includes(type) && drawer.data.formUpdatePerm.includes(id)) return true
  return false
}

// 职位列表
const positionOptions = ref([])
api.get('/position/getCompanyRoleList').then((res) => {
  positionOptions.value = res.data.data
})
// 部门列表
const sectorList = ref([])
api.get('/addressBook/structure/getSectorList').then((res) => {
  if(res.data.code === 20000) sectorList.value = res.data.data
})

// 同意/拒绝审批
const handleApproval = (flag) => {
  drawer.data.form = JSON.stringify(drawer.form)
  emit('approve', drawer.data, flag)
}

// 撤销申请
const cancelApproval = (id) => {
  emit('cancel', id)
}

/******** 名片 ********/
const cardRef = ref()
const showCard = function(id) {
  cardRef.value.showCard(id)
}

defineExpose({
  drawer
})
</script>

<style>
.n-tree-node-content__text {
  @apply text-sm !important
}
</style>