<template>
  <n-card class="w-full h-full" content-style="padding: 0">
    <n-tabs 
      type="line"
      size="large"
      :tabs-padding="20"
      :tab-style="{padding: '16px 0'}"
      pane-style="padding: 0"
    >
      <n-tab-pane v-for="(item, index) in tabList" :key="index" :name="item.id" :tab="item.tab" />
      <template #suffix>
        <div class="flex items-center w-full space-x-4 px-4">
          <div class="ml-auto w-80">
            <n-select v-model:value="params.typeId" :options="typeList" label-field="name" value-field="id" placeholder="筛选：请选择审批类型" clearable />
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
  </n-card>
</template>

<script setup>
import api from '/src/api/index.js'
import { pickBy, debounce } from 'lodash'
import { NIcon, useDialog, useMessage } from "naive-ui"
import { default as SearchIcon } from "@vicons/ionicons5/search"

const dialog = useDialog()
const message = useMessage()

const tabList = [
  { id: '1', tab: '待处理' },
  { id: '2', tab: '已处理' },
  { id: '3', tab: '已发起' },
  { id: '4', tab: '我收到的' },
]

const params = ref({
  typeId: null
})
</script>