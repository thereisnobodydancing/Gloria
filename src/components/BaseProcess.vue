<template>
  <div v-for="(item, index) in props.list" :key="index">
    <div class="flex space-x-4">
      <div class="flex-shrink-0 w-10 h-10 rounded bg-white shadow py-1.5">
        <svg v-if="item.nodeType === 1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" class="text-orange-500 w-[1.65rem] h-[1.65rem] mx-auto">
          <path d="M32 512h448v-64H32v64zm384-256h-66.56c-16.26 0-29.44-13.18-29.44-29.44v-9.46c0-27.37 8.88-53.41 21.46-77.72c9.11-17.61 12.9-38.39 9.05-60.42c-6.77-38.78-38.47-70.7-77.26-77.45C212.62-9.04 160 37.33 160 96c0 14.16 3.12 27.54 8.69 39.58C182.02 164.43 192 194.7 192 226.49v.07c0 16.26-13.18 29.44-29.44 29.44H96c-53.02 0-96 42.98-96 96v32c0 17.67 14.33 32 32 32h448c17.67 0 32-14.33 32-32v-32c0-53.02-42.98-96-96-96z" fill="currentColor"></path>
        </svg>
        <svg v-if="item.nodeType === 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-7 h-7 text-primary mx-auto">
          <path fill-rule="evenodd" d="M7.502 6h7.128A3.375 3.375 0 0118 9.375v9.375a3 3 0 003-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 00-.673-.05A3 3 0 0015 1.5h-1.5a3 3 0 00-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6zM13.5 3A1.5 1.5 0 0012 4.5h4.5A1.5 1.5 0 0015 3h-1.5z" clip-rule="evenodd" />
          <path fill-rule="evenodd" d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 013 20.625V9.375zM6 12a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V12zm2.25 0a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75zM6 15a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V15zm2.25 0a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75zM6 18a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V18zm2.25 0a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75z" clip-rule="evenodd" />
        </svg>
        <svg v-if="item.nodeType === 3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-7 h-7 text-blue-500 mx-auto">
          <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
        </svg>
      </div>
      <div class="space-y-0.5">
        <p class="text-lg font-bold leading-5 text-gray-600">{{ item.nodeName }}</p>
        <p 
          v-if="item.approvalUserType !== 1 && item.approvalsOptionList.length > 0" 
          class="text-sm text-gray-400"
        >
          <span v-if="item.approvalUserType === 0">指定成员（共{{ item.approvalsOptionList.length }}人）</span>
          <span v-if="item.approvalUserType === 2">部门主管</span>
          <span v-if="item.approvalUserType === 3">直属上级</span>
          <span v-if="item.approvalUserType === 4">指定角色成员（共{{ item.approvalsOptionList.length }}人）</span>
          <span v-if="item.approvalUserType === 5">发起人自己</span>
        </p>
        <p v-else class="text-sm text-gray-400">自选</p>
      </div>
    </div>
    <div class="w-7/12 h-full pt-2 pb-4">
      <div
        class="ml-5 pl-8 pr-4 pt-2 min-h-[3rem]"
        :class="{'border-l': props.list.length - 1 > index}"
      >
        <template v-if="(item.approvalUserType !== 1 && item.approvalsOptionList)">
          <div class="flex flex-wrap">
            <div 
              v-for="(userInfo, userIndex) in item.approvalsOptionList" :key="userIndex" 
              class="mr-4 mb-3 w-11 space-y-1 cursor-pointer hover:opacity-80"
              @click="showCard(userInfo.id)"
            >
              <base-avatar :image="userInfo.headshot" :name="userInfo.name" />
              <p class="text-sm text-gray-500 line-1">{{ userInfo.name }}</p>
            </div>
          </div>
        </template>
        <!-- 自选 -->
        <template v-if="(item.approvalUserType === 1 || item.approvalsOptionList.length === 0)">
          <div class="w-full flex flex-wrap">
            <div 
              v-for="(userInfo, userIndex) in item.approvalsOptionList" :key="userIndex" 
              class="mr-4 mb-3 w-11 cursor-pointer relative hover:opacity-80"
              @click="showCard(userInfo.id)"
            >
              <div class="w-11 h-11 rounded relative">
                <div 
                  class="absolute -top-1.5 -right-1 w-4 h-4 rounded-full bg-gray-400 hover:bg-gray-600"
                  @click.stop="removeUser(index, userIndex)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 text-white">
                    <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                  </svg>
                </div>
                <base-avatar :image="userInfo.headshot" :name="userInfo.name" />
              </div>
              <p class="text-sm text-gray-500 line-1">{{ userInfo.name }}</p>
            </div>
            <button 
              class="w-11 h-11 border border-dashed rounded border-gray-300 mb-3 hover:border-primary"
              @click="showAddUserModal(index)"
            >
              <p class="-mt-2 text-3xl font-light hover:text-primary">+</p>
            </button>
          </div>
        </template>
      </div>
    </div>
  </div>
  <!-- 选择人员 -->
  <add-user-modal ref="addUserRef" @confirm="addUser" />
  <!-- 名片 -->
  <business-card-modal ref="cardRef" />
</template>

<script setup>
const props = defineProps({
  list: Array
})

const addUserRef = ref()
const processActive = ref(0)
// 开弹窗
const showAddUserModal = (index) => {
  processActive.value = index
  let userData = props.list[index]
  addUserRef.value.showModal(userData.approvalsOptionList, userData.approvalsKeyList, userData.approvalsIdList)
}
// 添加人员
const addUser = function({options, keys, ids}) {
  console.log(options)
  let userData = props.list[processActive.value]
  userData.approvalsOptionList = options
  userData.approvalsKeyList = keys
  userData.approvalsIdList = ids
}
// 删除人员
const removeUser = (index, userIndex) => {
  let userData = props.list[index]
  userData.approvalsOptionList.splice(userIndex, 1)
  userData.approvalsKeyList.splice(userIndex, 1)
  userData.approvalsIdList.splice(userIndex, 1)
}

/******** 名片 ********/
const cardRef = ref()
const showCard = function(id) {
  cardRef.value.showCard(id)
}
</script>