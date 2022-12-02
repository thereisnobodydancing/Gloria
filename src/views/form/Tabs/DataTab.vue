<!-- 查看数据 -->
<template>
  <div 
    class="py-3 pl-3 pr-2"
    :style="{height: `${clientHeight - 230}px`}"
  >
    <base-pagination
      ref="paginationRef"
      url="/process/getMySubmit"
      :params="params"
      :size="20"
    >
      <template #default="slotProps">
        <div 
          class="overflow-y-scroll reactive" 
          :style="{height: `${clientHeight - 230}px`}"
        >
          <n-table :bordered="false">
            <thead class="sticky top-0">
              <tr>
                <th v-for="(item, index) in JSON.parse(slotProps.list[0].form)" :key="index">{{ item.options.name }}</th>
                <th>审批状态</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in slotProps.list" :key="index">
                <template v-for="(i, idx) in JSON.parse(item.form)" :key="idx">
                  <!-- 字符串直接显示 -->
                  <td v-if="['textarea', 'input', 'inputPhone', 'inputId', 'inputNumber', 'radio'].includes(i.type)">{{ i.value ? i.value : '-' }}</td>
                  <!-- 选择器 -->
                  <td v-if="['select', 'checkbox', 'selectSector', 'selectPost'].includes(i.type)">
                    <template v-if="i.value">
                      <span v-if="typeof(i.value) === 'string'">{{ i.value }}</span>
                      <div v-else class="space-x-2">
                        <span v-for="(text, num) in i.value" :key="num">{{ text }}</span>
                      </div>
                    </template>
                    <span v-else>-</span>
                  </td>
                  <!-- 日期 -->
                  <td v-if="i.type === 'datePicker'">{{ typeof(i.value) === 'object' ? `${i.value[0]} 至 ${i.value[1]}` : i.value }}</td>
                  <!-- 上传 -->
                  <td v-if="i.type === 'upload'">
                    <template v-if="(i.value && i.value.length > 0)">
                      <a v-for="data in i.value" :href="data.url" target="_blank" class="underline hover:text-primary block">{{ data.name }}</a>
                    </template>
                    <span v-else>-</span>
                  </td>
                  <!-- 选择成员 -->
                  <td v-if="i.type === 'selectUser'">-</td>
                  <!-- 金额 -->
                  <td v-if="i.type === 'inputPrice'">
                    <span>{{ i.value ? `${i.value.price} (${i.value.currency})` : `-` }}</span>
                  </td>
                </template>
                <td>{{ item.approvalsResult }}</td>
              </tr>
            </tbody>
          </n-table>
        </div>
      </template>
    </base-pagination>
  </div>
</template>

<script setup>
const clientHeight = ref(document.documentElement.clientHeight)
const route = useRoute()
const params = ref({
  templateId: route.params.id
})
</script>

<style scoped>
th {
  @apply font-bold
}
td {
  @apply text-gray-500
}
</style>

<!-- 
[{"type":"input","name":"单行输入框","options":{"id":"input_8nuW7TF7a_","name":"请假理由","type":"text","placeholder":"请输入请假理由","showCount":false,"maxLength":10,"width":"3/3","desc":"我们不接受没有理由的请假","required":true},"value":"fg"},{"type":"inputPhone","name":"电话号码","options":{"id":"inputPhone_WpcuxwM8dI","name":"电话号码","placeholder":"请输入11位电话号码","width":"3/3","desc":"有手机的输入手机号","required":true},"value":"15412312312"},{"type":"selectSector","name":"选择部门","options":{"id":"selectSector_XT1TWNotL_","name":"选择部门","multiple":false,"placeholder":"请选择部门","width":"1/3","desc":"哪个部门的","required":true},"value":"新媒体运营部"},{"type":"selectPost","name":"选择职位","options":{"id":"selectPost_A4xM_IR7-M","name":"选择职位","placeholder":"请选择职位","multiple":false,"width":"1/3","desc":"你是干啥的，交代一下","required":true},"value":"前端工程师"},{"type":"inputId","name":"身份证号","options":{"id":"inputId_sXngDiatrL","name":"身份证号","placeholder":"请输入18位身份证号","width":"3/3","desc":"请假还要身份证号？","required":false},"value":null},{"type":"selectUser","name":"选择成员","options":{"id":"selectUser_9xtGkDM7nI","name":"选择成员","useMax":false,"max":1,"desc":"糖果超甜","required":true}},{"type":"textarea","name":"多行输入框","options":{"id":"textarea_kxgtVhZa0l","name":"备注","placeholder":"请输入备注","showCount":false,"maxLength":30,"width":"3/3","desc":"特殊情况可以填写备注","required":false},"value":null}] -->