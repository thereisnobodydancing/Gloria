<template>
  <n-card class="w-full h-full" content-style="padding: 0;">
    <n-tabs
      type="line"
      size="large"
      :tabs-padding="20"
      :tab-style="{padding: '16px 0'}"
      pane-style="padding: 0"
    >
      <n-tab-pane name="发起申请">
        <send-tab/>
      </n-tab-pane>
      <n-tab-pane name="我收到的">
        <receiver-tab/>
      </n-tab-pane>
      <n-tab-pane name="查看数据">
        <data-tab/>
      </n-tab-pane>
    </n-tabs>
  </n-card>
</template>

<script setup>
import SendTab from './Tabs/SendTab.vue'
import ReceiverTab from './Tabs/ReceiverTab.vue'
import DataTab from './Tabs/DataTab.vue'
</script>