<template>
  <div 
    class="w-full flex" 
    :style="{ height: `${clientHeight - 200}px` }"
  >
    <!-- 左侧：部门列表 -->
    <div class="flex-shrink-0 w-72 h-full border-r relative">
      <div class="w-full h-full overflow-y-scroll pl-2 pr-1 pb-8">
        <div class="px-1.5 pt-2 pb-3 sticky top-0 bg-white z-20">
          <n-input v-model:value="sectorPattern" placeholder="请输入部门名称" clearable>
            <template #prefix><n-icon :component="SearchIcon" /></template>
          </n-input>
        </div>
        <n-tree 
          block-line
          :selected-keys="defaultSelectedKeys"
          :data="sectorList"
          :cancelable="false"
          children-field="list" 
          key-field="mark" 
          label-field="sectorName"
          selectable 
          :show-irrelevant-nodes="false"
          :pattern="sectorPattern"
          @update:selected-keys="handleUpdateValue"
        >
          <template #empty>
            <div
              class="w-full flex flex-col items-center justify-center space-y-2" 
              :style="{ height: `${clientHeight - 300}px` }"
            >
              <default-empty v-if="props.pageLoading === false && sectorPattern.length === 0" />
              <search-empty v-if="props.pageLoading === false && sectorPattern.length > 0" />
              <p 
                v-if="props.pageLoading === false"
                class="text-xs text-gray-400"
              >
                {{ sectorPattern.length === 0 ? '数据为空' : '啥也没搜到' }}
              </p>
            </div>
          </template>
        </n-tree>
      </div>
    </div>
    <!-- 右侧：人员列表 -->
    <div class="flex-grow w-full h-full">
      <div 
        v-if="rightData.showEmpty"
        class="w-full h-full flex flex-col items-center justify-center"
      >
        <sector-empty />
        <p class="mt-4 text-sm text-gray-400">选个公司/部门看看吧</p>
      </div>
      <div v-else class="p-4">
        <div class="flex items-center">
          <h2 class="text-lg text-gray-500">{{ rightData.sectorName }}</h2>
          <div class="ml-auto w-96">
            <n-input 
              v-model:value="params.keyWord" 
              placeholder="搜索：请输入关键字" 
              :disabled="!basePaginationRef || basePaginationRef && basePaginationRef.total === 0 && params.keyWord.length === 0"
              clearable
            >
              <template #prefix><n-icon :component="SearchIcon" /></template>
            </n-input>
          </div>
        </div>
        <div 
          v-if="basePaginationRef" 
          class="mt-3 w-full h-10 rounded bg-gray-100 text-gray-500 px-4 leading-10 mb-2"
        >
          <span>{{ rightData.fullName }}</span>
          <span>（共{{ basePaginationRef.total }}人）</span>
        </div>
        <base-pagination
          ref="basePaginationRef"
          :url="url"
          :size="20"
          :params="params"
          @change-page="changePage"
          :style="{ height: `${clientHeight - 420}px` }"
        >
          <template #empty>
            <div 
              class="w-full flex flex-col items-center justify-center"
              :style="{ height: `${clientHeight - 420}px` }"
            >
              <user-empty v-if="params.keyWord.length === 0" />
              <search-empty v-else :width="250" :height="250" />
              <p class="mt-3 text-sm text-gray-400">{{ params.keyWord.length === 0 ? '该公司/部门暂无员工数据' : '啥也没搜到' }}</p>
            </div>
          </template>
          <template #default="slotProps">
            <div 
              id="userListId"
              class="overflow-y-scroll overflow-x-hidden" 
              :style="{ height: `${clientHeight - 380}px` }"
            >
              <div
                v-for="(item, index) in slotProps.list"
                :key="index"
                class="w-full h-14 px-4 flex items-center border-b border-b-gray-100 cursor-pointer group"
                :class="item.position  && item.position.isSectorHead ? 'bg-red-50 hover:bg-primary/10 hover:border-b-primary/30' : 'hover:bg-gray-100 hover:border-b-gray-500/20'"
                @click="showCard(item.id)"
              >
                <div class="ml-4 flex items-center space-x-2.5 cursor-pointer">
                  <base-avatar :image="item.headshot" :name="item.userName" />
                  <div>
                    <div class="flex items-center">
                      <p class="text-base min-w-[40px]">{{ item.userName }}</p>
                      <button 
                        v-if="item.position && item.position.isSectorHead" 
                        class="ml-4 px-1.5 text-white text-xs bg-primary leading-5 rounded"
                      >
                        部门负责人
                      </button>
                    </div>
                    <p class="text-sm text-gray-400 text-left">{{ item.role }}</p>
                  </div>
                </div>
                <p class="ml-auto text-gray-400 group-hover:text-primary">查看名片</p>
              </div>
            </div>
          </template>
        </base-pagination>
      </div>
    </div>
  </div>
  <!-- 名片 -->
  <business-card-modal ref="cardRef" />
</template>

<script setup>
import api from '/src/api/index.js'
import { renderPrefix } from '/src/until/render.js'
import { default as SearchIcon } from "@vicons/ionicons5/search"

const route = useRoute()
const clientHeight = ref(document.documentElement.clientHeight)
const emit = defineEmits(['changeState'])
const props = defineProps({
  pageLoading: Boolean
})

const initData = function() {
  sectorPattern.value = url.value = ''
  defaultSelectedKeys.value = []
  rightData.showEmpty = true
  rightData.fullName = rightData.sectorName = ''
  params.keyWord = ''
  params.companyId = params.sectorId = null
}

/***** 左侧——部门列表 *****/
const sectorPattern = ref('') 
const sectorList = ref([])
const getSectorList = function (id) {
  emit('changeState', true)
  api.get('/addressBook/structure/getCompanyStructureByCompanyId', {topCompanyId: id}).then((res) => {
    if (res.data.code === 20000 && res.data.data.length > 0) {
      sectorList.value = res.data.data
      setPrefix(sectorList.value, 1)
    }
    setTimeout(() => emit('changeState', false), 100)
  })
}
getSectorList(route.params.id)
watch(() => route.params.id, newId => {
  if(route.name === "AddressBook") {
    initData()
    getSectorList(newId)
  }
})
// 为左侧部门列表渲染icon
const setPrefix = function (list, leave) {
  list.forEach(item => {
    if(leave === 1) item.prefix = renderPrefix('company')
    if(leave >= 2) item.prefix = renderPrefix('sector')
    if (item.list && item.list.length > 0) setPrefix(item.list, leave + 1)
  })
}
// 点击左侧部门
const handleUpdateValue = function(keys, option) {
  defaultSelectedKeys.value = keys
  if(keys.length > 0) {
    rightData.fullName = option[0].fullName
    rightData.sectorName = option[0].sectorName
    params.keyWord = ''
    params.sectorId = keys[0][0] === 's' ? option[0].id : null
    params.companyId = keys[0][0] === 'c' ? option[0].id : null
    url.value = keys[0][0] === 'c' ? '/addressBook/structure/getCompanyUserList' : '/addressBook/structure/getSectorEmployee'
    rightData.showEmpty = false                 // 关闭空状态
  }
}

/***** 右侧——人员列表 *****/
const basePaginationRef = ref()
const defaultSelectedKeys = ref([])
const rightData = reactive({
  showEmpty: true,
  fullName: '',
  sectorName: ''
})
const url = ref('')
const params = reactive({
  keyWord: '',
  companyId: null,
  sectorId: null
})
// 换页置顶
const changePage = () => document.querySelector('#userListId').scrollTop = 0

/******** 名片 ********/
const cardRef = ref()
const showCard = function(id) {
  cardRef.value.showCard(id)
}

defineExpose({
  initData
})
</script>