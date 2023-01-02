<template>
  <n-card class="w-full h-full" content-style="padding: 0;">
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
        <receiver-tab/>
      </n-tab-pane>
      <n-tab-pane tab="我发出的" name="send">
        <submit-tab/>
      </n-tab-pane>
      <n-tab-pane tab="日志评论" name="comments">
        <comments-tab/>
      </n-tab-pane>
      <template #suffix>
        <div class="px-4">
          <n-button type="primary" @click="createLog">+写日志</n-button>
        </div>
      </template>
    </n-tabs>
  </n-card>
</template>

<script setup>
import SubmitTab from './tabs/SubmitTab.vue'
import ReceiverTab from './tabs/ReceiverTab.vue'
import CommentsTab from './tabs/CommentsTab.vue'
import useLogStore from '/src/store/log.js'
import useUserStore from '/src/store/user.js'
import { useDialog } from 'naive-ui'
import { nanoid } from  'nanoid'

const router = useRouter()
const dialog = useDialog()
const { logData, userId } = toRefs(useLogStore())
const { user } = toRefs(useUserStore())

//tabs相关
const changeTabs = (value) => router.replace(`/base/log?type=${value}`)
// 写日志
const createLog = () => {
  if(logData.value.id && logData.value.id.length > 0 && userId.value === user.value.id) {
    dialog.info({
      title: '提示',
      content: '发现有未提交数据，是否继续编辑？',
      positiveText: '继续',
      negativeText: '新建',
      onPositiveClick: () => router.push('/base/log/write?type=create&save=1'),
      onNegativeClick: () => {
        useLogStore().$reset()
        logData.value.id = `log_${nanoid(10)}`
        router.push('/base/log/write?type=create&save=0')
      }
    }) 
  } else {
    useLogStore().$reset()
    logData.value.id = `log_${nanoid(10)}`
    router.push('/base/log/write?type=create&save=0')
  }
}
</script>