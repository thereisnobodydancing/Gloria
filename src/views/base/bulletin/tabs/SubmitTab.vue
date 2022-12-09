<!-- 我发出的公告 -->
<template>
  <div 
    class="w-full overflow-y-scroll" 
    :style="{ height: `${clientHeight - 145}px` }"
  >
    <base-pagination
      ref="basePaginationRef"
      url="/announcement/getMySubmmit"
      :params="{keyWord: props.keyWord, typeId: props.typeId}"
      :size="10"
      :style="{height: `${clientHeight - 200}px`}"
    >
      <template #empty>
        <div 
          class="w-full flex flex-col items-center justify-center space-y-2" 
          :style="{height: `${clientHeight - 150}px`}"
        >
          <default-empty v-if="props.keyWord.length === 0" :width="200" :height="200" />
          <search-empty v-else :width="200" :height="200" />
          <p class="text-gray-400 text-sm"> {{ props.keyWord.length === 0 ? '数据为空' : '啥也没搜到' }}</p>
        </div>
      </template>
      <template #default="slotProps">
        <div 
          class="w-full overflow-y-scroll p-5 space-y-3"
          :style="{height: `${clientHeight - 220}px`}"
        >
          <div 
            v-for="(item, index) in slotProps.list"
            :key="index"
            class="w-full h-32 cursor-pointer shadow-sm bg-gray-50/50 hover:shadow hover:bg-gray-50 p-2.5 flex items-center rounded"
            @click="$router.push(`/base/bulletin/detail/${item.id}?type=submit`)"
          >
            <div class="w-full h-full flex flex-col items-start justify-around px-2">
              <h3 class="text-base">{{ item.title }}</h3>
              <div class="text-sm text-gray-400 w-2/3">
                <p v-html="item.contents" class="line-1" />
              </div>
              <div class="text-xs text-gray-400 flex items-center space-x-7">
                <p class="inline-block space-x-4">
                  <span>{{ item.companyName }}</span>
                  <span>{{ item.createdTime }}</span>
                </p>
                <div class="space-x-4">
                  <button 
                    class="text-primary/70 hover:text-primary hover:underline"
                    @click.stop="$router.push(`/base/bulletin/write?id=${item.id}&type=edit`)"
                  >
                    编辑
                  </button>
                  <button 
                    class="text-primary/70 hover:text-primary hover:underline"
                    @click.stop="removeBulletin(item.id)"
                  >
                    删除
                  </button>
                </div>
              </div>
            </div>
            <div class="w-48 h-full bg-red-50 text-primary font-bold text-3xl text-center leading-[6.5rem] rounded font-serif">{{ item.typeName }}</div>
          </div>
        </div>
      </template>
    </base-pagination>
  </div>
</template>

<script setup>
import api from '/src/api/index.js'
import { useDialog, useMessage } from 'naive-ui'

const clientHeight = ref(document.documentElement.clientHeight)
const message = useMessage()
const dialog = useDialog()
const props = defineProps({
  pageLoading: Boolean,
  keyWord: String,
  typeId: Number
})


const basePaginationRef = ref()
const removeBulletin = function(id) {
  dialog.warning({
    title: '提示',
    content: '你确定要删除这篇公告吗？',
    positiveText: '确定',
    negativeText: '不确定',
    onPositiveClick: () => {
      api.delete('/announcement/deleteAnnounce', { announceId: id }).then((res) => {
        if(res.data.code === 20000) {
          message.success('删除成功')
          basePaginationRef.value.askApi()
        }
        
      })
    },
    onNegativeClick: () => {}
  })
}
</script>