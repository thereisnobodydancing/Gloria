<template>
  <n-spin :show="showPageLoading">
    <n-card 
      :title="companyNames[$route.params.id - 1]"
      class="w-full h-full"
      content-style="padding: 0"
    >
      <n-tabs 
        v-model:value="defaultTab"
        type="line" 
        :tabs-padding="20" 
        pane-style="padding: 0"
        @update:value="showPageLoading = true"
      >
        <n-tab-pane name="organizationTab" tab="组织架构">
          <organization-tab :page-loading="showPageLoading" @change-state="changeLoadingState" />
        </n-tab-pane>
        <n-tab-pane v-if="user.topCompanyId === +$route.params.id" name="sectorTab" tab="我的部门">
          <sector-tab :page-loading="showPageLoading" @change-state="changeLoadingState" />
        </n-tab-pane>
      </n-tabs>
    </n-card>
  </n-spin>
</template>

<script setup>
import OrganizationTab from './tabs/OrganizationTab.vue'
import SectorTab from './tabs/SectorTab.vue'

const route = useRoute()
const showPageLoading = ref(true)
const user = JSON.parse(sessionStorage.getItem('user'))
let companyNames = ['光大健康集团有限公司', '光大健康在线科技', '光元泰合', '星石天河健康科技有限责任公司']

const defaultTab = ref('organizationTab')
const changeLoadingState = (state) => showPageLoading.value = state

watch(() => route.params.id, newId => {
  if(route.name === "AddressBook") defaultTab.value = 'organizationTab'
})
</script>