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
      <h2 class="text-lg font-bold text-gray-700">修改密码</h2>
      <n-form
        ref="formRef"
        :model="form" 
        :rules="rules" 
        label-placement="left"
        require-mark-placement="left"
        class="mt-8 w-1/3"
        label-width="80"
      >
        <n-form-item label="旧密码：" path="original">
          <n-input v-model:value="form.original" type="password" placeholder="请输入旧密码" clearable />
        </n-form-item>
        <n-form-item label="新密码：" path="newPassWord">
          <n-input 
            v-model:value="form.newPassWord" 
            type="password"
            placeholder="请输入新密码" 
            clearable
            @input="handlePasswordInput"
            @keydown.enter.prevent
          />
        </n-form-item>
        <n-form-item 
          ref="reenteredPassWord"
          type="password"
          first
          path="reenteredPassWord"
          label="新密码：" 
        >
          <n-input 
            v-model:value="form.reenteredPassWord"
            type="password" 
            :disabled="!form.newPassWord"
            placeholder="请再次确认新密码" 
            clearable 
          />
        </n-form-item>
        <div class="mt-2 ml-2">
          <n-button type="primary" @click="handleValidateButtonClick">确认修改</n-button>
        </div>
      </n-form>
    </div>
  </n-card>
</template>

<script setup>
import api from '/src/api/index.js'
import { useMessage } from 'naive-ui'

const message = useMessage()
const router = useRouter()

const formRef = ref()
const rPasswordFormItemRef = ref()
const form = ref({
  original: '',
  newPassWord: '',
  reenteredPassWord: ''
})
const validatePasswordStartWith = (rule, value) => {
  return !!form.value.newPassWord && form.value.newPassWord.startsWith(value) && form.value.newPassWord.length >= value.length;
}
const validatePasswordSame = (rule, value) => {
  return value === form.value.newPassWord
}
const rules = {
  original: {required: true, message: "旧密码不能为空"},
  newPassWord: [{required: true, message: "新密码不能为空"}],
  reenteredPassWord: [
    {required: true, message: "请再次输入新密码", trigger: ['input', 'blur']},
    {validator: validatePasswordStartWith, message: "两次密码输入不一致", trigger: 'input'},
    {validator: validatePasswordSame, message: "两次密码输入不一致", trigger: ['blur', 'password-input']},
  ],
}
const handlePasswordInput = () => {
  if(form.value.reenteredPassWord) {
    rPasswordFormItemRef.value?.validate({ trigger: "password-input" })
  }
}

const handleValidateButtonClick = (e) => {
  e.preventDefault()
  formRef.value?.validate((errors) => {
    if (!errors) {
      api.put('/user/updatePassword', {
        newPassWord: form.value.newPassWord,
        original: form.value.original
      }).then((res) => {
        if(res.data.code === 20000) {
          message.success("验证成功")
          router.back()
        }
      })
    } else {
      console.log(errors)
      message.error("验证失败")
    }
  });
}
</script>