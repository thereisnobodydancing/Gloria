<template>
  <div class="w-full flex" :style="{ height: `${clientHeight - 200}px` }">
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
    <div class="flex-grow w-full h-full p-4">
      <div class="flex items-center">
        <h2 class="text-lg text-gray-500">{{ sectorName }}</h2>
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
        <span>{{ sectorName }}</span>
        <span>（共{{ basePaginationRef.total }}人）</span>
      </div>
      <base-pagination
        ref="basePaginationRef"
        url="/addressBook/structure/getSectorEmployee"
        :size="20"
        :params="params"
        @change-page="changePage"
        :style="{ height: `${clientHeight - 420}px` }"
      >
        <template #empty>
          <div 
            v-if="!props.pageLoading"
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
  <!-- 名片 -->
  <business-card-modal ref="cardRef" />
</template>

<script setup>
import api from '/src/api/index.js'
import { renderPrefix } from '/src/until/render.js'
import { default as SearchIcon } from "@vicons/ionicons5/search"

const clientHeight = ref(document.documentElement.clientHeight)
const emit = defineEmits(['changeState'])
const props = defineProps({
  pageLoading: Boolean
})


/***** 左侧——部门列表 *****/
const sectorPattern = ref('') 
const sectorList = ref([])
const defaultSelectedKeys = ref([])
api.get('/addressBook/structure/getMySectorInfo').then((res) => {
  if (res.data.code === 20000 && res.data.data.length > 0) {
    sectorList.value = res.data.data
    defaultSelectedKeys.value = [res.data.data[0].mark]
    sectorName.value = res.data.data[0].sectorName
    params.sectorId = res.data.data[0].id
    setPrefix(sectorList.value, 1)
  }
})
// 为左侧部门列表渲染icon
const setPrefix = function (list, leave) {
  list.forEach(item => {
    if(leave === 1) item.prefix = renderPrefix('company')
    if(leave >= 2) item.prefix = renderPrefix('sector')
    if (item.list && item.list.length > 0) setPrefix(item.list, leave + 1)
  })
  setTimeout(() => emit('changeState', false), 100)
}
// 点击左侧部门
// const handleUpdateValue = function(keys, option) {
//   defaultSelectedKeys.value = keys
//   if(keys.length > 0) {
//     sectorName.value = option[0].sectorName
//     params.keyWord = ''
//     params.sectorId = option[0].id
//   }
// }

/***** 右侧——人员列表 *****/
const basePaginationRef = ref()
const sectorName = ref('')
const params = reactive({
  keyWord: '',
  sectorId: null
})
// 换页置顶
const changePage = () => document.querySelector('#userListId').scrollTop = 0

/******** 名片 ********/
const cardRef = ref()
const showCard = function(id) {
  cardRef.value.showCard(id)
}

// defineExpose({
//   initData
// })
</script>