<template>
  <n-card 
    class="w-full h-full" 
    header-style="padding: 0" 
    content-style="padding: 0"
  >
    <template #header> 
      <div 
        class="w-full h-14 border-b leading-[3.5rem] px-6 font-normal text-gray-600 hover:text-gray-900 cursor-pointer"
        @click="$router.back()"
      >
        &lt; 返回上一页
      </div>
    </template>
    <div 
      class="w-full h-full px-6 py-4 overflow-y-scroll"
    >
      <h2 class="text-lg font-bold text-gray-700">修改头像</h2>
      <div class="mt-14 px-12 w-full flex items-center">
       <div class="pr-6 border-r">
          <base-upload 
            :action="`${baseUrl}/user/uploadUserHeadShot`"
            :file-list="avatarList"
            type="image-card"
            :max="1"
            @change="changeFileUpload"
          />
       </div>
       <div class="px-6 text-center space-y-4">
          <base-avatar 
            :image="avatarList.length > 0 ? avatarList[0].url : user.headshot" 
            :name="user.userName" 
            :width="60" 
            :height="60" 
            :font-size="20" 
            :radius="999"
          />
          <p class="text-xs text-gray-500">{{ avatarList.length > 0 ? '预览头像' : '当前头像' }}</p>
        </div>
      </div>
      <p class="mt-8 px-12 text-sm text-gray-400">请选择图片上传：大小180 * 180像素支持JPG、PNG等格式，图片需小于2M</p>
      <div class="mt-8 px-12 w-52">
        <n-button 
          type="primary" 
          size="large" 
          block 
          @click="changeAvatar"
          :disabled="avatarList.length === 0"
        >
          修改
        </n-button>
      </div>
    </div>
  </n-card>
</template>

<script setup>
import api from '/src/api/index.js'
import { useMessage } from 'naive-ui'
import useUserStore from '/src/store/user.js'
  
const message = useMessage()
const router = useRouter()
const baseUrl = import.meta.env.VITE_APP_URL
const { user } = toRefs(useUserStore())

const avatarList = ref([])
const changeFileUpload = (file) => {
  avatarList.value = file
}

const changeAvatar = () => {
  api.post('/user/updateHeadShot', { headshot: avatarList.value[0].url }).then((res) => {
    if(res.data.code === 20000) {
      message.success(res.data.msg)
      user.value.headshot = avatarList.value[0].url
      router.go(-1)
    }
  })
}
</script>