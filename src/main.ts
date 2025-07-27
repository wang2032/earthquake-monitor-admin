import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

import App from './App.vue'
import router from './router'

import './assets/main.css'

const app = createApp(App)

// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.use(createPinia())
app.use(router)
app.use(ElementPlus, {
    locale: zhCn,
})

app.mount('#app')

// 初始化状态管理
import { useUserStore } from './stores/user'
import { useEarthquakeStore } from './stores/earthquake'

const userStore = useUserStore()
const earthquakeStore = useEarthquakeStore()

// 初始化用户信息
userStore.initUserInfo()

// 初始化模拟数据
earthquakeStore.initMockData()
