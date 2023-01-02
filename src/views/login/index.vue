<template>
  <!-- component -->
  <div 
    class="bg-no-repeat bg-cover bg-center relative"
    style="background-image: url(https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-1.2.1&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=1951&amp;q=80)"
  >
    <div class="absolute bg-gradient-to-b from-teal-700/80 via-teal-600/90 to-orange-100/90 opacity-75 inset-0 z-0" />
    <div class="min-h-screen sm:flex sm:flex-row mx-0 justify-center">
      <div class="flex-col flex  self-center p-10 sm:max-w-5xl xl:max-w-2xl  z-10">
        <div class="self-start hidden lg:flex flex-col  text-white">
          <h1 class="mb-3 font-bold text-5xl">欢迎登录光大管理系统</h1>
          <p class="pr-3">Welcome to log in to the office automation management background of Everbright, if you encounter the situation of unable to log in, please press Ctrl+F5 to refresh the page, or cannot log in, please change the browser and try again.</p>
        </div>
      </div>
      <div class="flex justify-center self-center z-10">
        <div class="p-12 bg-white mx-auto rounded-2xl">
          <div class="mb-4">
            <h3 class="font-semibold text-2xl text-black/80">登录</h3>
            <p class="mt-1 text-black/50">请输入您的账号密码</p>
          </div>
          <div class="space-y-5">
            <div class="space-y-2">
              <label class="text-sm font-medium text-black/70 tracking-wide">账号</label>
              <input
                v-model="form.mobile"
                class=" w-full text-base px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                placeholder="请输入您的账号"
              >
            </div>
            <div class="space-y-2">
              <label class="mb-5 text-sm font-medium text-black/70 tracking-wide">密码</label>
              <input
                v-model="form.password"
                type="password"
                class="w-full content-center text-base px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                placeholder="请输入您的密码"
              >
            </div>
            <p
              class="text-sm text-right text-primary/60 hover:text-primary cursor-pointer select-none"
              @click="forgetPwd"
            >
              忘记密码?
            </p>
            <div>
              <button
                type="submit"
                class="w-full flex justify-center bg-primary/70 backdrop-blur hover:bg-primary/90 disabled:bg-primary/40 text-gray-100 p-3 rounded-full tracking-wide font-semibold  shadow-lg cursor-pointer transition ease-in duration-500"
                :disabled="btnDisabled"
                @click="login"
              >
                登录
              </button>
            </div>
          </div>
          <div class="pt-5 text-center text-black/40 text-xs">Copyright ©Everbright 2022</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useLogin } from '/src/composables/useLogin.js'
const { form, forgetPwd, btnDisabled, login } = useLogin()
</script>