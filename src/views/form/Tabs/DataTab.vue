<!-- 查看数据 -->
<template>
  <div :style="{height: `${clientHeight - 220}px`}">
    <base-pagination
      ref="paginationRef"
      url="/process/getMySubmit"
      :params="params"
      :size="20"
    >
      <template #default="slotProps">
        <div 
          class="overflow-y-scroll reactive" 
          :style="{height: `${clientHeight - 220}px`}"
        >
          <n-table :bordered="false" class="p-6">
            <thead class="sticky top-0">
              <tr>
                <th v-for="(item, index) in JSON.parse(slotProps.list[0].form)" :key="index">{{ item.options.name }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in slotProps.list" :key="index">
                <template v-for="(i, idx) in JSON.parse(item.form)" :key="idx">
                  <!-- 字符串直接显示 -->
                  <td v-if="['textarea', 'input', 'inputPhone', 'inputId', 'inputNumber', 'radio'].includes(i.type)">{{ i.value }}</td>
                  <!-- 选择器 -->
                  <td v-if="['select', 'checkbox'].includes(i.type)">
                    <span v-if="typeof(i.value) === 'string'">{{ i.value }}</span>
                    <div v-else class="space-x-2">
                      <span v-for="(text, num) in i.value" :key="num">{{ text }}</span>
                    </div>
                  </td>
                  <!-- 日期 -->
                  <td v-if="i.type === 'datePicker'">{{ typeof(i.value) === 'object' ? `${i.value[0]} 至 ${i.value[1]}` : i.value }}</td>
                  <!-- 上传 -->
                  <td v-if="i.type === 'upload'">
                    <div v-for="data in i.value">
                      <a :href="data.url" target="_blank" class="underline hover:text-primary">{{ data.name }}</a>
                    </div>
                  </td>
                </template>
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