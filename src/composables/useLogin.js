import api from '/src/api/index.js'
import { useRouter } from 'vue-router'
import { useDialog, useMessage } from 'naive-ui'
import useUserStore from '/src/store/user.js'

export function useLogin() {
  const dialog = useDialog()
  const message = useMessage()
  const router = useRouter()

  // 登录Form
  const form = reactive({
    mobile: localStorage.getItem('mobile') ? localStorage.getItem('mobile') : '',
    password: ''
  })
  // 忘记密码
  const forgetPwd = () => message.info('真厉害，密码都能忘')
  // 登录按钮的禁用状态
  const btnDisabled = ref(false)
  const { user } = toRefs(useUserStore())
  // 登录
  const login = function () {
    if (!form.mobile || !form.password) { message.warning('请填写完整信息!'); return }
    btnDisabled.value = true
    api.post('/open/login', form).then((res) => {
      if (res.data.code !== 20000) form.password = ''
      if (res.data.code === 20000) {
        user.value = res.data.data.user
        sessionStorage.setItem('token', res.data.data.token)
        localStorage.setItem('mobile', res.data.data.user.mobile) 
        message.success(`欢迎你，${res.data.data.user.userName}`)
        router.push('/')
      }
      setTimeout(() => btnDisabled.value = false, 200)
    })
    setTimeout(() => btnDisabled.value = false, 2000)
  }
  // 退出登录
  const LogOut = function() {
    dialog.warning({
      title: '提示',
      content: '你确定要退出登录吗？',
      positiveText: '确定',
      negativeText: '不确定',
      onPositiveClick: () => {
        ['token', 'user'].forEach(item => sessionStorage.removeItem(item))
        router.replace('/login')
        message.success('已成功退出登录')
      },
      onNegativeClick: () => {}
    })
  }
  return {
    form,
    forgetPwd,
    btnDisabled,
    login,
    LogOut,
  }
}