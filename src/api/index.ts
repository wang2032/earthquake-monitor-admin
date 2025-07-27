// API基础配置
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

// 请求拦截器
const request = async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('token')

    const defaultOptions: RequestInit = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers
        }
    }

    const response = await fetch(`${API_BASE_URL}${url}`, {
        ...defaultOptions,
        ...options
    })

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json()
}

// 用户相关API
export const userAPI = {
    // 登录
    login: (username: string, password: string) => {
        return request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password })
        })
    },

    // 获取用户信息
    getUserInfo: () => {
        return request('/user/info')
    },

    // 更新用户信息
    updateUserInfo: (data: Record<string, unknown>) => {
        return request('/user/info', {
            method: 'PUT',
            body: JSON.stringify(data)
        })
    },

    // 修改密码
    changePassword: (oldPassword: string, newPassword: string) => {
        return request('/user/password', {
            method: 'PUT',
            body: JSON.stringify({ oldPassword, newPassword })
        })
    }
}

// 地震数据相关API
export const earthquakeAPI = {
    // 获取地震数据列表
    getEarthquakeList: (params?: Record<string, unknown>) => {
        const queryString = params ? `?${new URLSearchParams(params as Record<string, string>)}` : ''
        return request(`/earthquake/list${queryString}`)
    },

    // 获取地震详情
    getEarthquakeDetail: (id: number) => {
        return request(`/earthquake/${id}`)
    },

    // 获取实时数据
    getRealtimeData: () => {
        return request('/earthquake/realtime')
    },

    // 获取统计数据
    getStatistics: () => {
        return request('/earthquake/statistics')
    }
}

// 监测站点相关API
export const stationAPI = {
    // 获取站点列表
    getStationList: () => {
        return request('/station/list')
    },

    // 获取站点详情
    getStationDetail: (id: number) => {
        return request(`/station/${id}`)
    },

    // 更新站点状态
    updateStationStatus: (id: number, status: string) => {
        return request(`/station/${id}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status })
        })
    },

    // 配置站点
    configureStation: (id: number, config: Record<string, unknown>) => {
        return request(`/station/${id}/config`, {
            method: 'PUT',
            body: JSON.stringify(config)
        })
    }
}

// 预警相关API
export const alertAPI = {
    // 获取预警规则列表
    getAlertRules: () => {
        return request('/alert/rules')
    },

    // 创建预警规则
    createAlertRule: (rule: Record<string, unknown>) => {
        return request('/alert/rules', {
            method: 'POST',
            body: JSON.stringify(rule)
        })
    },

    // 更新预警规则
    updateAlertRule: (id: number, rule: Record<string, unknown>) => {
        return request(`/alert/rules/${id}`, {
            method: 'PUT',
            body: JSON.stringify(rule)
        })
    },

    // 删除预警规则
    deleteAlertRule: (id: number) => {
        return request(`/alert/rules/${id}`, {
            method: 'DELETE'
        })
    },

    // 获取预警记录
    getAlertRecords: (params?: Record<string, unknown>) => {
        const queryString = params ? `?${new URLSearchParams(params as Record<string, string>)}` : ''
        return request(`/alert/records${queryString}`)
    },

    // 处理预警
    handleAlert: (id: number) => {
        return request(`/alert/records/${id}/handle`, {
            method: 'PUT'
        })
    }
}

// 系统配置相关API
export const systemAPI = {
    // 获取系统配置
    getSystemConfig: () => {
        return request('/system/config')
    },

    // 更新系统配置
    updateSystemConfig: (config: Record<string, unknown>) => {
        return request('/system/config', {
            method: 'PUT',
            body: JSON.stringify(config)
        })
    },

    // 获取用户列表
    getUserList: () => {
        return request('/system/users')
    },

    // 创建用户
    createUser: (user: Record<string, unknown>) => {
        return request('/system/users', {
            method: 'POST',
            body: JSON.stringify(user)
        })
    },

    // 更新用户
    updateUser: (id: number, user: Record<string, unknown>) => {
        return request(`/system/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(user)
        })
    },

    // 删除用户
    deleteUser: (id: number) => {
        return request(`/system/users/${id}`, {
            method: 'DELETE'
        })
    },

    // 获取系统日志
    getSystemLogs: (params?: Record<string, unknown>) => {
        const queryString = params ? `?${new URLSearchParams(params as Record<string, string>)}` : ''
        return request(`/system/logs${queryString}`)
    }
}

// 数据分析相关API
export const analysisAPI = {
    // 获取趋势分析数据
    getTrendAnalysis: (params?: Record<string, unknown>) => {
        const queryString = params ? `?${new URLSearchParams(params as Record<string, string>)}` : ''
        return request(`/analysis/trend${queryString}`)
    },

    // 获取区域分析数据
    getRegionAnalysis: (params?: Record<string, unknown>) => {
        const queryString = params ? `?${new URLSearchParams(params as Record<string, string>)}` : ''
        return request(`/analysis/region${queryString}`)
    },

    // 获取深度分析数据
    getDepthAnalysis: (params?: Record<string, unknown>) => {
        const queryString = params ? `?${new URLSearchParams(params as Record<string, string>)}` : ''
        return request(`/analysis/depth${queryString}`)
    },

    // 地震预测
    predictEarthquake: (params: Record<string, unknown>) => {
        return request('/analysis/predict', {
            method: 'POST',
            body: JSON.stringify(params)
        })
    },

    // 生成分析报告
    generateReport: (params: Record<string, unknown>) => {
        return request('/analysis/report', {
            method: 'POST',
            body: JSON.stringify(params)
        })
    }
}

// 文件上传API
export const uploadAPI = {
    // 上传文件
    uploadFile: (file: File, onProgress?: (progress: number) => void) => {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest()
            const formData = new FormData()
            formData.append('file', file)

            xhr.upload.addEventListener('progress', (event) => {
                if (event.lengthComputable && onProgress) {
                    const progress = (event.loaded / event.total) * 100
                    onProgress(progress)
                }
            })

            xhr.addEventListener('load', () => {
                if (xhr.status === 200) {
                    resolve(JSON.parse(xhr.responseText))
                } else {
                    reject(new Error(`Upload failed with status: ${xhr.status}`))
                }
            })

            xhr.addEventListener('error', () => {
                reject(new Error('Upload failed'))
            })

            xhr.open('POST', `${API_BASE_URL}/upload`)
            xhr.send(formData)
        })
    }
}

// 导出所有API
export default {
    user: userAPI,
    earthquake: earthquakeAPI,
    station: stationAPI,
    alert: alertAPI,
    system: systemAPI,
    analysis: analysisAPI,
    upload: uploadAPI
} 