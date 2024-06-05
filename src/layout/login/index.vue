<template>
    <el-dialog 
      v-model="userStore.loginDialogVisible" width="30%" 
      :close-on-click-modal="false"
      @close="closeDialog" 
      :z-index="10">
        <div v-show="state === 'login'" class="login_container">
            <div class="title"><span class="active">登录</span>&nbsp;&frasl;&nbsp;<span @click="changeState('register')">注册</span></div>
            <div class="bg_image"></div>
            <div class="content" @keyup.enter="login">
                <el-form
                ref="loginFormRef"
                :model="loginForm"
                :rules="rules"
                >
                    <el-form-item prop="phone">
                        <el-input v-model="loginForm.phone" prefix-icon="User" placeholder="请输入您的手机号"></el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input v-model="loginForm.password" prefix-icon="Lock" type="password" show-password placeholder="请输入您的密码"></el-input>
                    </el-form-item>
                </el-form>
                <div class="login_btn"><el-button @click="login" type="primary" style="width: 100%;">登录</el-button></div>
            </div>
        </div>
        <div v-show="state === 'register'" class="login_container">
            <div class="title"><span @click="changeState('login')">登录</span>&nbsp;&frasl;&nbsp;<span class="active">注册</span></div>
            <div class="bg_image"></div>
            <div class="content" @keyup.enter="register">
                <el-form
                ref="registerFormRef"
                :model="registerForm"
                :rules="rules"
                >
                    <el-form-item prop="phone">
                        <el-input v-model="registerForm.phone" prefix-icon="User" placeholder="请输入您的手机号"></el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input v-model="registerForm.password" prefix-icon="Lock" type="password" show-password placeholder="请输入您的密码"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="registerForm.code" prefix-icon="Promotion" placeholder="请输入您的验证码">
                            <template #append>
                                <span @click="sendVerificationCode" :class="countdown > 0 ? 'disabled' : 'undisabled'">
                                    {{ countdown > 0 ? `重新发送(${countdown}s)` : '发送验证码' }}
                                </span>
                            </template>
                        </el-input>
                    </el-form-item>
                </el-form>
                <div class="login_btn"><el-button @click="register" type="primary" style="width: 100%;">注册</el-button></div>
            </div>
        </div>
    </el-dialog>
    <KeepAlive>
        <DragPopWidget v-if="route.meta.dragPopWidget" />
    </KeepAlive>
</template>

<script setup lang='ts'>
defineOptions({ name: 'Login' })
import useUserStore from '@/store/modules/user'
import DragPopWidget from '@/layout/dragPopWidget/index.vue'
import { onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { reqValidatecode } from '@/api/user';
import type { FormInstance } from 'element-plus'
import { Result } from '@/api/user/type';
import MyMessage from '@/utils/myMessage';

const route = useRoute()

const userStore = useUserStore()
const loginFormRef = ref<FormInstance>()
const registerFormRef = ref<FormInstance>()
// 登录表单
let loginForm = ref({
    phone: '',
    password: ''
})
// 注册表单
let registerForm = ref({
    phone: '',
    password: '',
    code: ''
})
// 声明当前用户是在进行登录状态还是注册状态，默认登录状态
let state = ref<'login' | 'register'>('login')
const changeState = (s:'login' | 'register') => {
  Object.assign(loginForm.value, { phone: '', password: '' })
  Object.assign(registerForm.value, { phone: '', password: '', code: '' })
  state.value = s
}
// 表单验证
const rules = {
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1\d{10}$/, message: '手机号格式错误', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9\W_]+$/,
      message: '密码只能包含数字、字母和特殊字符',
      trigger: 'blur',
    },
    { min: 6, message: '密码长度至少6位', trigger: 'blur' },
  ],
}
// 关闭登录框时，清空表单数据，设置默认打开为login
const closeDialog = () => {
    state.value = 'login'
    Object.assign(loginForm.value, { phone: '', password: '' })
    Object.assign(registerForm.value, { phone: '', password: '', code: '' })
}
// 验证码倒计时
const countdown = ref<number>(0);
let countdownInterval: ReturnType<typeof setInterval> | null = null;
// 发送验证码
async function sendVerificationCode() {
  if (countdown.value === 0) {
    countdown.value = 60
    countdownInterval = setInterval(() => {
      countdown.value--
      if (countdown.value === 0) {
        clearInterval(countdownInterval!)
        countdownInterval = null
      }
    }, 1000)
    const res:Result<any> = await reqValidatecode(registerForm.value.phone)
    console.log(res.code)
  }
} 
// 页面卸载时关闭定时器，节省性能
onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval)
  }
})
// 登录
const login = async () => {
  if(!loginFormRef.value) return
  await loginFormRef.value.validate(async (valid, _fields) => {
    if (valid) {
      await userStore.userLogin(loginForm.value)
      closeDialog()
    } else {
      MyMessage({
        type:'error',
        message:'请检查输入是否正确！'
      })
    }
  })
}
// 注册
const register = async () => {
  if(!registerFormRef.value) return  
  await registerFormRef.value.validate(async (valid, _fields) => {
    if (valid) {
      await userStore.userRegister(registerForm.value)
      closeDialog()
    } else {
      MyMessage({
        type:'error',
        message:'请检查输入是否正确！'
      })
    }
  })
}
</script>

<style scoped lang='scss'>
.undisabled{
    cursor: pointer;
}
.disabled {
  cursor: not-allowed;
}
.login_container{
  position: relative;
  width: 100%;
  height: 350px;
  margin: 0 auto;

  .title{
    position: absolute;
    top: 0;
    right: 0;
    width: 40%;
    height: 30%;
    display: flex;
    align-items: baseline;
    margin-top: 10%;
    margin-left: 10%;
    span{
        cursor: pointer;
    }

    .active{
        color: $main-color;
        font-size: 1.1em;
    }
  }
  .bg_image{
    position: absolute;
    top: 0;
    left: 0;
    width: 60%;
    height: 40%;
    background-image: url('@/assets/images/login_bg.png');
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
  }
  .content{
    position: absolute;
    right: 0;
    bottom: 0;
    width: 70%;
    height: 60%;
    margin-right: 15%;
  }
}
</style>