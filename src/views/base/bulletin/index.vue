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
      <n-tab-pane tab="我收到的" name="receiver">
        <receiver-tab :typeId="typeId" :keyWord="searchValue" />
      </n-tab-pane>
      <n-tab-pane tab="我发出的" name="send">
        <submit-tab :typeId="typeId" :keyWord="searchValue"/>
      </n-tab-pane>
      <template #suffix>
        <div class="w-full flex justify-end space-x-4 px-4">
          <!-- select -->
          <div class="w-60">
            <n-select v-model:value="typeId" :options="typeList" label-field="name" value-field="id" placeholder="筛选：请选择公告类型" clearable />
          </div>
          <!-- search -->
          <div class="w-72">
            <n-input placeholder="搜索：请输入关键词" clearable @update:value="searchUpdate">
              <template #prefix>
                <n-icon :component="SearchIcon" />
              </template>
            </n-input>
          </div>
          <!-- 写公告 -->
          <n-button type="primary" @click="$router.push(`/base/bulletin/write/?type=create`)">+写公告</n-button>
        </div>
      </template>
    </n-tabs>
  </n-card>
</template>

<script setup>
import api from '/src/api/index.js'
import { default as SearchIcon } from "@vicons/ionicons5/search"
import SubmitTab from './tabs/SubmitTab.vue'
import ReceiverTab from './tabs/ReceiverTab.vue'

const router = useRouter()

//tabs相关
const changeTabs = (value) => router.replace(`/base/bulletin?type=${value}`)

// 筛选
const typeList = ref([])
const typeId = ref(null)
api.get('/announcement/getAnnounceTypeList').then((res) => {
  if(res.data.code === 20000) typeList.value = res.data.data
})

// 搜索
const searchValue = ref('')
const searchUpdate = function(text) {
  searchValue.value = text
}
</script>