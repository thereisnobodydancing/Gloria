<template>
  <n-card class="w-full h-full" content-style="padding: 0;">
    <n-tabs
      v-model:value="defaultTab"
      type="line"
      size="large"
      :tabs-padding="20"
      :tab-style="{padding: '16px 0'}"
      pane-style="padding: 0"
    >
      <n-tab-pane tab="发起申请" name="send">
        <send-tab ref="sendRef" @submit="submitForm"/>
      </n-tab-pane>
      <n-tab-pane tab="查看数据" name="data">
        <data-tab/>
      </n-tab-pane>
    </n-tabs>
  </n-card>
</template>

<script setup>
import SendTab from './Tabs/SendTab.vue'
import DataTab from './Tabs/DataTab.vue'

const route = useRoute()
const defaultTab = ref('send')

watch(() => route.params.id, newId => {
  defaultTab.value = 'send'
  nextTick(() => sendRef.value.initData(newId))
})

// 发起申请
const sendRef = ref()
const submitForm = () => defaultTab.value = 'data'
</script>