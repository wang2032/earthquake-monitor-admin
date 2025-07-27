import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface UserInfo {
    username: string
    role: string
    email?: string
    avatar?: string
}

export const useUserStore = defineStore('user', () => {
    // 用户信息
    const userInfo = ref<UserInfo | null>(null)

    // 登录状态
    const isLoggedIn = ref(false)

    // 设置用户信息
    const setUserInfo = (info: UserInfo) => {
        userInfo.value = info
        isLoggedIn.value = true
    }

    // 清除用户信息
    const clearUserInfo = () => {
        userInfo.value = null
        isLoggedIn.value = false
    }

    // 登录
    const login = async (username: string, password: string) => {
        // 模拟登录API调用
        if (username === 'admin' && password === '123456') {
            const user: UserInfo = {
                username: 'admin',
                role: 'admin',
                email: 'admin@example.com'
            }
            setUserInfo(user)
            return { success: true, message: '登录成功' }
        } else {
            return { success: false, message: '用户名或密码错误' }
        }
    }

    // 登出
    const logout = () => {
        clearUserInfo()
        localStorage.removeItem('token')
        localStorage.removeItem('userInfo')
    }

    // 初始化用户信息
    const initUserInfo = () => {
        const token = localStorage.getItem('token')
        const storedUserInfo = localStorage.getItem('userInfo')

        if (token && storedUserInfo) {
            try {
                const user = JSON.parse(storedUserInfo)
                setUserInfo(user)
            } catch (error) {
                console.error('解析用户信息失败:', error)
                logout()
            }
        }
    }

    return {
        userInfo,
        isLoggedIn,
        setUserInfo,
        clearUserInfo,
        login,
        logout,
        initUserInfo
    }
}) 