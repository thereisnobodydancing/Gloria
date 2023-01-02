
<template>
  <div class="flex-shrink-0 w-full h-16 bg-white border-b flex items-center px-5 z-20">
    <!-- logo -->
    <img :src="logoImg" alt="logo" width="101" height="36">
    <!-- avatar -->
    <div class="ml-auto p-1 rounded-lg hover:bg-gray-100">
      <n-dropdown 
        :options="options" 
        trigger="click" 
        placement="bottom-end"
        @select="handleSelect"
      >
        <div class="flex items-center cursor-pointer">
          <base-avatar :image="user.headshot" :name="user.userName" :width="36" :height="36" :radius="999" />
          <div class="ml-3">{{ user.userName }}</div>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </div>
      </n-dropdown>
    </div>
  </div>
</template>

<script setup>
import logoImg from '/src/assets/logo.png'
import useUserStore from '/src/store/user.js'
import { NIcon } from "naive-ui"
import { default as HomeOutIcon} from "@vicons/ionicons5/HomeOutline"
import { default as UserOutIcon} from "@vicons/ionicons5/PersonOutline"
import { default as LogOutIcon} from "@vicons/ionicons5/LogOutOutline"
import { useLogin } from '/src/composables/useLogin.js'

const router = useRouter()
const { user } = toRefs(useUserStore())
console.log(user)
const renderIcon = function (icon) {
  return () => h(NIcon, null, { default: () => h(icon) })
}
const options = [
  {label: '首页', key: "HomeOut", icon: renderIcon(HomeOutIcon)},
  {label: '个人中心', key: "UserOut", icon: renderIcon(UserOutIcon)},
  {label: '退出登录', key: "LogOut", icon: renderIcon(LogOutIcon)}
]
const { LogOut } = useLogin()
const handleSelect = function(key) {
  if(key === 'HomeOut') router.push('/')
  if(key === 'UserOut') router.push('/user')
  if(key === 'LogOut') LogOut()
}
</script>

<style>
.n-button--warning-type {
  @apply bg-[#f0a020]
}
</style>