import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'


const routes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: '/dashboard'
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/Login.vue'),
        meta: { title: '登录' }
    },
    {
        path: '/',
        component: () => import('../views/Layout.vue'),
        children: [
            {
                path: 'dashboard',
                name: 'Dashboard',
                component: () => import('../views/Dashboard.vue'),
                meta: { title: '仪表盘', requiresAuth: true }
            },
            {
                path: 'monitor',
                name: 'Monitor',
                component: () => import('../views/Monitor.vue'),
                meta: { title: '实时监测', requiresAuth: true }
            },
            {
                path: 'history',
                name: 'History',
                component: () => import('../views/History.vue'),
                meta: { title: '历史数据', requiresAuth: true }
            },
            {
                path: 'analysis',
                name: 'Analysis',
                component: () => import('../views/Analysis.vue'),
                meta: { title: '数据分析', requiresAuth: true }
            },
            {
                path: 'alerts',
                name: 'Alerts',
                component: () => import('../views/Alerts.vue'),
                meta: { title: '预警管理', requiresAuth: true }
            },
            {
                path: 'settings',
                name: 'Settings',
                component: () => import('../views/Settings.vue'),
                meta: { title: '系统设置', requiresAuth: true }
            }
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token')

    if (to.meta.requiresAuth && !token) {
        next('/login')
    } else if (to.path === '/login' && token) {
        next('/dashboard')
    } else {
        next()
    }
})

export default router 