<template>
  <n-spin :show="showSiderLoading">
    <div class="flex-shrink-0 w-64 h-full border-r">
      <div 
        class="overflow-y-scroll pb-10 relative"
        :style="{height: `${clientHeight - 64}px`}"
      >
        <router-link to="/" class="px-4 pt-2 pb-4 block sticky top-0 bg-white z-20">
          <n-button block size="large" type="primary">工作台</n-button>
        </router-link>
        <n-menu
          v-model:value="$route.meta.name"
          :options="menuOptions"
        />
      </div>
    </div>
  </n-spin>
</template>

<script setup>
import api from '/src/api/index.js'
import { RouterLink } from "vue-router"
import { renderBuild, renderLog, renderBulletin, renderApproval, renderCube, renderUser } from '/src/until/render.js'

const clientHeight = document.documentElement.clientHeight
const showSiderLoading = ref(true)

const menuOptions = ref([
  {
    label: '通用管理',
    key: 'Base',
    type: 'group',
    children: [
      {label: () => h(RouterLink, {to: '/base/log?type=receiver'}, {default: () => '日志'}), key: 'BaseLog', icon: renderLog(), children: null},
      {label: () => h(RouterLink, {to: '/base/bulletin?type=receiver'}, {default: () => '公告'}), key: 'BaseBulletin', icon: renderBulletin(), children: null}
    ]
  },
  {
    label: '审批中心',
    key: 'Approval',
    type: 'group',
    children: [
      {label: () => h(RouterLink, {to: '/approval?type=pending'}, {default: () => '审批中心'}), key: 'Approval', icon: renderApproval(), children: null}
    ]
  },
  {
    label: '个人中心',
    key: 'User',
    type: 'group',
    children: [
      {label: () => h(RouterLink, {to: '/user'}, {default: () => '个人信息'}), key: 'User', icon: renderUser(), children: null}
    ]
  }
])

const getFormSider = function(label, name, list) {
  menuOptions.value.splice(menuOptions.value.length - 1, 0, {
    label: label,
    key: name,
    type: 'group',
    children: list.map(i => {
      return  {
        label: () => h(RouterLink, {to: `/form/${i.navigateId}`}, {default: () => `${i.navigateName}`}),
        key: `Form${i.navigateId}`, 
        icon: renderCube(), 
        children: null
      }
    })
  })
}
api.get('/common/navigation').then((res) => {
  res.data.data.forEach(item => {
    // 1-通讯录
    if(item.navigationName === 'AddressBook' && item.list.length > 0) {
      menuOptions.value.unshift({
        label: '通讯录',
        key: 'AddressBook',
        type: 'group',
        children: item.list.map(i => {
          return  {
            label: () => h(RouterLink, {to: `/addressbook/${i.navigateId}`}, {default: () => `${i.navigateName}`}), 
            key: `AddressBook${i.navigateId}`, 
            icon: renderBuild(), 
            children: null
          }
        })
      })
    }
    // 2-假勤数据
    if(item.navigationName === 'FormLeave' && item.list.length > 0) getFormSider('假勤管理', 'FormLeave', item.list)
    // 3-人事管理
    if(item.navigationName === 'FormPersonnel' && item.list.length > 0) getFormSider('人事管理', 'FormPersonnel', item.list)
    // 4-业务管理
    if(item.navigationName === 'FormOperations' && item.list.length > 0) getFormSider('业务管理', 'FormOperations', item.list)
    // 5-财务管理
    if(item.navigationName === 'FormFinance' && item.list.length > 0) getFormSider('财务管理', 'FormFinance', item.list)
    // 6-行政管理
    if(item.navigationName === 'FormAdministration' && item.list.length > 0) getFormSider('行政管理', 'FormAdministration', item.list)
    // 7-其他
    if(item.navigationName === 'FormOther' && item.list.length > 0) getFormSider('其他', 'FormOther', item.list)
  })
  nextTick(() => showSiderLoading.value = false)
})
</script>