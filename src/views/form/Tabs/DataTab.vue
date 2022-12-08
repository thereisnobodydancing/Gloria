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
                  <!-- 合同条款 -->
                  <td v-if="i.type === 'contractTerms'">
                    <span>{{ i.value }}</span>
                  </td>
                  <!-- 开销明细 -->
                  <td v-if="i.type === 'expenseDetails'">{{ i.value }}</td>
                  <!-- 物品明细 -->
                  <td v-if="i.type === 'itemDetails'">{{ i.value }}</td>
                   <!-- 省市区 -->
                   <td v-if="i.type === 'selectAddress'">{{ i.value }}</td>
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