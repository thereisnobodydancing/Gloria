<!-- 添加员工（按组织架构） -->
<template>
  <n-modal 
    v-model:show="modal.show"
    :mask-closable="false"
  >
    <n-card
      :title="props.title"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
      closable
      style="width: 700px"
      @close="closeModal"
    >
      <div class="w-full h-[600px] flex">
        <!-- left -->
        <div class="flex-shrink-0 border-r w-1/2 min-h-full px-5 pb-5">
          <!-- 搜索 -->
          <n-input v-model:value="modal.pattern" placeholder="搜索" clearable>
            <template #prefix>
              <n-icon :component="SearchIcon" />
            </template>
          </n-input>
          <!-- 树列表 -->
          <n-spin :show="showListLoading" class="w-full h-[530px]">
            <div 
              class="mt-4 w-full h-[530px] overflow-y-scroll"
              :class="{'flex items-center justify-center': modal.options.length === 0}"
            >
              <n-tree
                :checked-keys="select.keys"
                :show-irrelevant-nodes="modal.showIrrelevantNodes"
                block-line
                cascade
                checkable
                :data="modal.options"
                :pattern="modal.pattern"
                :check-strategy="props.strategy"
                children-field="list"
                label-field="name"
                @update:checked-keys="handleChedkedKeysChange"
              />
            </div>
          </n-spin>
        </div>
        <!-- right -->
        <div class="flex-shrink-0 w-1/2 min-h-full px-5 pb-5 space-y-4">
          <p v-if="props.rightTitle" class="text-sm">{{ props.rightTitle }} （{{ select.options.length }} {{ props.max ? `/${props.max}` : '' }}）</p>
          <p v-else class="text-sm">已选择（{{ select.options.length }} {{ props.max ? `/${props.max}` : '' }}）</p>
          <div class="w-full h-[490px] overflow-y-scroll">
            <div 
              v-if="select.options.length > 0"
              class="flex flex-wrap"
            >
              <div
                v-for="(item, index) in select.options"
                :key="index"
                class="mb-2.5 mr-2.5 h-[34px] rounded bg-gray-100 flex items-center pl-1 cursor-default"
                :class="whiteList.includes(item.id) ? 'pr-2.5' : 'pr-1'"
              >
                <!-- 头像 -->
                <div 
                  class="flex-shrink-0 w-[26px] h-[26px] rounded"
                  :class="{
                    'py-[3px] bg-primary': !item.picture && item.type === 'user',
                    'py-[3px] bg-blue-500': !item.picture && item.type === 'sector'
                  }"
                >
                  <img v-if="item.picture" :src="item.picture" :alt="item.name" width="26" height="26" class="rounded">
                  <svg v-if="!item.picture && item.type === 'user'" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mx-auto text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <svg v-if="!item.picture && item.type === 'sector'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mx-auto text-white">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                  </svg>
                </div>
                <!-- 名字 -->
                <p class="ml-2.5 text-xs">{{ item.name }}</p>
                <!-- clear -->
                <svg 
                  v-if="!whiteList.includes(item.id)"
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 20 20" 
                  fill="currentColor" 
                  class="ml-3 w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600"
                  @click="removeOption(item.key, item.id, index)"
                >
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>
            <div v-else class="h-full flex items-center justify-center">
              <n-empty size="large" />
            </div>
          </div>
          <div class="flex space-x-4">
            <button 
              class="ml-auto w-16 h-8 border border-primary text-primary text-sm rounded"
              @click="closeModal"
            >
              取消
            </button>
            <button 
              class="w-16 h-8 bg-primary text-white text-sm rounded hover:opacity-80 disabled:opacity-80 disabled:cursor-not-allowed"
              :disabled="modal.btnDisabled"
              @click="confirm"
            >
              确定
            </button>
          </div>
        </div>
      </div>
    </n-card>
  </n-modal>
</template>

<script setup>
import api from '/src/api/index.js'
import { default as SearchIcon} from "@vicons/ionicons5/search"
import { renderPrefix } from '/src/until/render.js'

const emit = defineEmits(['confirm', 'cancel'])
const props = defineProps({
  title: {
    type: String,
    default: '添加成员'
  },
  max: {
    type: Number,
    default: null
  },
  rightTitle: {
    type: String,
    default: ''
  },
  strategy: {
    type: String,
    default: 'child'
  }
})
const modal = reactive({
  show: false,
  options: [],
  pattern: '',
  showIrrelevantNodes: true,
  btnDisabled: true    
})

const select = reactive({
  keys: [],     // 选中项的key数组
  ids: [],      // 选中项的id数组
  options: []   // 选中项的内容数组
})
// 获取左侧options
const showListLoading = ref(true)
const getOptions = function() {
  api.get('/addressBook/structure/getSectorAndUser').then((res) => {
    modal.options = res.data.data
    setSuffix(modal.options)
  })
}
const setSuffix = function(list) {
  list.forEach(item => {
    if(item.type === 'sector') item.suffix = renderPrefix('sector_sub')
    if (item.list && item.list.length > 0) setSuffix(item.list)
  })
  showListLoading.value = false
}

// 白名单id
const whiteList = ref([])

// 弹出Modal
const showModal = function(options=[], keys=[], ids=[], wList=[]) {
  getOptions()
  modal.btnDisabled = props.max ? options.length > props.max : options.length === 0
  select.options = options
  select.keys = keys.length > 0 ? keys : []
  select.ids = ids.length > 0 ? ids : []
  whiteList.value = wList
  modal.show = true
}

// 	节点勾选项发生变化时的回调函数
const handleChedkedKeysChange = function(keys, option) {
  modal.btnDisabled = props.max ? option.length > props.max : option.length === 0
  select.options = option
  // select.keys = option.map(item => { if(item.type === 'user') return item.key })
  // select.ids = option.map(item => { if(item.type === 'user') return item.id })
  select.keys = option.map(item => item.key)
  select.ids = option.map(item => item.id)
}

// 右侧删除一个
const removeOption = function(key, id, index) {
  select.keys.splice(select.keys.indexOf(key), 1)
  select.ids.splice(select.ids.indexOf(id), 1)
  select.options.splice(index, 1)
  modal.btnDisabled = props.max ? select.options.length > props.max : select.options.length === 0
}

// 初始化数据
const initModal = function() {
  modal.pattern = ''
  select.keys = select.ids = select.options = []
}

// 关闭Modal
const closeModal = function() {
  emit('cancel')
  modal.show = false
  initModal()
}

// 确定
const confirm = function() {
  emit('confirm', select)
  modal.show = false
  initModal()
}

defineExpose({
  showModal,
  initModal
})
</script>