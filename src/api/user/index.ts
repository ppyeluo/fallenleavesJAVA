import request from '@/utils/request'
import type { Address, Result, userInfo } from './type'


enum API {
    // 用户登录
    LOGIN_URL = '/api/login',
    // 根据token获取用户信息
    USERINFO_URL = '/api/userInfo',
    // 用户退出登录
    LOGOUT_URL = '/api/logout',
    // 用户注册
    REGISTER_URL = '/api/register',
    // 得到用户地址
    ADDRESS_URL = '/api/getUserAddress',
    // 头像上传
    UPLOADAVATAR_URL = '/api/uploadAvatar',
    // 更新头像
    UPDATEAVATAR_URL = '/api/updateAvatar',
    // 发送验证码
    VALICATECODE_URL = '/api/validatecode',
}

// 用户登录
export const reqLogin = (data:any) => request.post<any, Result<any>>(API.LOGIN_URL, data)
// 获取用户信息
export const reqUserInfo = () => request.get<any, Result<userInfo>>(API.USERINFO_URL)
// 退出登录
export const reqLogout = () => request.get<any, Result<any>>(API.LOGOUT_URL)
// 用户注册
export const reqRegister = (data:any) => request.post<any, Result<any>>(API.REGISTER_URL, data)
// 得到用户地址
export const getAddress = () => request.get<any, Result<Address[]>>(API.ADDRESS_URL)
// 头像上传
export const reqUploadAvatar = (file:File) => request.post<any, Result<any>>(API.UPLOADAVATAR_URL, { avatar:file }, { headers: { 'Content-Type': 'multipart/form-data' } })
// 更新头像
export const reqUpdateAvatar = (avatar:string) => request.get<any, Result<string>>(API.UPDATEAVATAR_URL+`?avatar='${avatar}'`)
// 发送验证码
export const reqValidatecode = (phone:string) => request.get<any, Result<any>>(API.VALICATECODE_URL+`/${phone}`)