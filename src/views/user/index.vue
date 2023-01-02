<template>
  <n-spin :show="showLoading">
    <div
      class="w-full p-2 overflow-y-scroll" 
      :style="{height: `${clientHeight - 90}px`}"
    >
      <main class="w-full h-full space-y-10">
        <!-- 个人卡片 -->
        <section class="w-full h-[12.5rem] bg-gradient-to-b from-primary/10 to-white shadow rounded-md p-10 flex items-center">
          <!-- 头像 -->
          <div v-if="userInfo.userName" class="w-[6.25rem] h-[6.25rem] rounded-full cursor-default relative group overflow-hidden">
            <base-avatar :image="userInfo.headshot" :name="userInfo.userName" :width="100" :height="100" :font-size="40" :radius="999" />
            <span 
              class="absolute bottom-0 w-full h-[1.88rem] bg-gray-900/60 leading-[1.88rem] text-center text-sm text-white cursor-pointer"
              @click="$router.push('/change-avatar')"
            >
              修改
            </span>
          </div>
          <!-- 主要信息 -->
          <div class="ml-[1.81rem] space-y-2">
            <p class="text-[1.75rem]">{{ userInfo.userName }}</p>
            <p class="text-gray-500 space-x-7">
              <span>职位：{{ userInfo.roleName }}</span>
              <span>联系方式：{{ userInfo.mobile }}</span>
            </p>
          </div>
          <!-- btn -->
          <div class="ml-auto space-x-4">
            <n-button size="large" type="primary" ghost @click="$router.push('/change-password')">修改密码</n-button>
            <n-button size="large" type="primary" @click="LogOut">退出登录</n-button>
          </div>
        </section>
        <!-- 个人信息 -->
        <section class="space-y-4">
          <h2 class="text-xl">个人信息</h2>
          <div class="w-full p-10 bg-white rounded-md shadow space-y-6">
            <!-- 姓名 -->
            <div class="text-lg">
              <p class="w-32 font-bold inline-block"><span class="text-primary mr-1">*</span>姓名：</p>
              <span class="text-gray-500">{{ userInfo.userName || '-' }}</span>
            </div>
            <!-- 邮箱 -->
            <div class="text-lg">
              <p class="w-32 font-bold inline-block"><span class="text-primary mr-1">*</span>邮箱：</p>
              <span class="text-gray-500">{{ userInfo.emailNumber || '-' }}</span>
            </div>
            <!-- 联系方式 -->
            <div class="text-lg">
              <p class="w-32 font-bold inline-block"><span class="text-primary mr-1">*</span>联系方式：</p>
              <span class="text-gray-500">{{ user.mobile || '-' }}</span>
            </div>
            <!-- 职位 -->
            <div class="text-lg">
              <p class="w-32 font-bold inline-block"><span class="text-primary mr-1">*</span>职位：</p>
              <span class="text-gray-500">{{ userInfo.roleName || '-' }}</span>
            </div>
            <!-- 所属部门 -->
            <div class="text-lg">
              <p class="w-32 font-bold inline-block"><span class="text-primary mr-1">*</span>所属部门：</p>
              <span class="text-gray-500">{{ userInfo.sectorName || '-' }}</span>
            </div>
            <!-- 直属主管 -->
            <div class="text-lg">
              <p class="w-32 font-bold inline-block"><span class="text-primary mr-1">*</span>直属主管：</p>
              <span class="text-gray-500">{{ userInfo.leader || '-' }}</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  </n-spin>
</template>

<script setup>
import api from '/src/api/index.js'
import { useLogin } from '/src/composables/useLogin.js'
import useUserStore from '/src/store/user.js'

const { LogOut } = useLogin()
const { user } = toRefs(useUserStore())
const showLoading = ref(true)
const clientHeight = ref(document.documentElement.clientHeight)

// 获取登录人信息
const userInfo = ref({})
api.get('/addressBook/structure/getEmployeeInfo', { userId: user.value.id }).then((res) => {
  if(res.data.code === 20000) Object.assign(userInfo.value, res.data.data)
  setTimeout(() => showLoading.value = false, 200)
})

</script>