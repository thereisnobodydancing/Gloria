<template>
  <n-drawer v-model:show="showDrawer" :width="500" placement="right">
    <n-drawer-content>
      <!-- header -->
      <template #header>
        <div class="flex items-center space-x-2.5">
          <div 
            class="flex-shrink-0 w-11 h-11 rounded cursor-pointer"
            @click="showCard(4)"
          >
            <base-avatar :image="props.data.headshot" :name="props.data.userName" :width="44" :height="44" :font-size="16" />
          </div>
          <div class="w-full flex-grow">
            <p class="text-lg">{{ props.data.stitle }}</p>
            <p class="text-sm text-gray-500">
              <span>{{ props.data.createdTime }}</span>
              <span class="ml-5 text-primary">当前状态：{{ props.data.approvalsResult }}</span>
            </p>
          </div>
        </div>
      </template>
      <!-- content -->
      <div class="space-y-8 pt-2 pb-4">
        <div v-for="(item, index) in JSON.parse(props.data.form)" :key="index">
          <div v-if="['processed', 'initiated'].includes($route.query.type) || ['pending', 'received'].includes($route.query.type) && props.data.formReadPerm.includes(item.options.id)">
            <div class="mb-2 flex items-center space-x-2.5 w-full justify-between">
              <p class="text-gray-800 font-bold">{{ item.options.name }}</p>
              <n-button v-if="['pending', 'received'].includes($route.query.type) && props.data.formUpdatePerm.includes(item.options.id)" text>
                <span class="text-gray-500 hover:text-primary">编辑</span>
              </n-button>
            </div>
            <template v-if="!['contractTerms', 'expenseDetails', 'itemDetails'].includes(item.type)">
              <p class="text-sm text-gray-500">{{ getSummary(item)}}</p>
            </template>
            <!-- 合同条款 -->
            <template v-if="item.type === 'contractTerms'">
              <div v-for="(i, idx) in item.value" class="text-sm flex">
                <p class="flex-shrink-0">条款{{ idx + 1 }}：</p>
                <p class="text-gray-500">{{ i.content }}</p>
              </div>
            </template>
            <!-- 开销明细 -->
            <template v-if="item.type === 'expenseDetails'">
              <n-table :bordered="false" :single-line="false" size="small">
                <thead>
                  <tr>
                    <th>开销用途</th>
                    <th>开销金额</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(i, idx) in item.value.expenseList">
                    <td>{{ i.expenseUse }}</td>
                    <td>{{ i.amountSpent }}</td>
                  </tr>
                </tbody>
              </n-table>
              <p class="text-sm">合计：{{ item.value.total }}</p>
            </template>
            <!-- 物品明细 -->
            <template v-if="item.type === 'itemDetails'">
              <n-table :bordered="false" :single-line="false" size="small">
                <thead>
                  <tr>
                    <th>物品名称</th>
                    <th>物品数量</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(i, idx) in item.value">
                    <td>{{ i.name }}</td>
                    <td>{{ i.num }}</td>
                  </tr>
                </tbody>
              </n-table>
            </template>
          </div>
        </div>
      </div>
      <!-- footer -->
      <template #footer v-if="['pending', 'initiated'].includes($route.query.type)">
        <div v-if="$route.query.type === 'pending'" class="flex items-center space-x-4">
          <div class="w-28" @click="handleApproval(props.data, true)">
            <n-button type="primary" block size="large">通过</n-button>
          </div>
          <div class="w-28" @click="handleApproval(props.data, false)">
            <n-button type="primary" block ghost size="large">不通过</n-button>
          </div>
        </div>
        <div v-if="$route.query.type === 'initiated'" class="w-28">
          <n-button
            type="primary" 
            block 
            ghost 
            size="large"
            :disabled="props.data.approvalsResult === '已撤销'"
            @click="cancelApproval(props.data.proTabId)"
          >
            撤销申请
          </n-button>
        </div>
      </template>
    </n-drawer-content>
  </n-drawer>
  <!-- 名片 -->
  <business-card-modal ref="cardRef" />
</template>

<script setup>
import { useApproval } from '/src/composables/useApproval.js'
const emit = defineEmits(['approve', 'cancel'])
const props = defineProps({
  data: Object
})
const showDrawer = ref(false)
const { getSummary } = useApproval()

// 同意/拒绝审批
const handleApproval = (data, flag) => {
  emit('approve', data, flag)
}

// 撤销申请
const cancelApproval = (id) => {
  emit('cancel', id)
}

/******** 名片 ********/
const cardRef = ref()
const showCard = function(id) {
  cardRef.value.showCard(id)
}

defineExpose({
  showDrawer
})
</script>