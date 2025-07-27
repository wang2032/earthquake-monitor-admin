// 格式化时间
export const formatTime = (time: string | Date): string => {
    const date = new Date(time)
    return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    })
}

// 格式化震级
export const formatMagnitude = (magnitude: number): string => {
    return magnitude.toFixed(1)
}

// 获取震级颜色
export const getMagnitudeColor = (magnitude: number): string => {
    if (magnitude < 2) return '#909399'
    if (magnitude < 3) return '#67c23a'
    if (magnitude < 4) return '#e6a23c'
    return '#f56c6c'
}

// 获取震级等级
export const getMagnitudeLevel = (magnitude: number): string => {
    if (magnitude < 2) return '微震'
    if (magnitude < 3) return '小震'
    if (magnitude < 4) return '中震'
    if (magnitude < 5) return '强震'
    return '大地震'
}

// 计算两点间距离（公里）
export const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number => {
    const R = 6371 // 地球半径（公里）
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
}

// 防抖函数
export const debounce = <T extends (...args: any[]) => any>(
    func: T,
    wait: number
): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout
    return (...args: Parameters<T>) => {
        clearTimeout(timeout)
        timeout = setTimeout(() => func(...args), wait)
    }
}

// 节流函数
export const throttle = <T extends (...args: any[]) => any>(
    func: T,
    wait: number
): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean
    return (...args: Parameters<T>) => {
        if (!inThrottle) {
            func(...args)
            inThrottle = true
            setTimeout(() => inThrottle = false, wait)
        }
    }
}

// 生成随机ID
export const generateId = (): number => {
    return Date.now() + Math.random()
}

// 深拷贝
export const deepClone = <T>(obj: T): T => {
    if (obj === null || typeof obj !== 'object') return obj
    if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T
    if (obj instanceof Array) return obj.map(item => deepClone(item)) as unknown as T
    if (typeof obj === 'object') {
        const clonedObj = {} as T
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                clonedObj[key] = deepClone(obj[key])
            }
        }
        return clonedObj
    }
    return obj
}

// 验证邮箱格式
export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

// 验证手机号格式
export const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^1[3-9]\d{9}$/
    return phoneRegex.test(phone)
}

// 文件大小格式化
export const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 数字格式化
export const formatNumber = (num: number): string => {
    return num.toLocaleString('zh-CN')
}

// 百分比格式化
export const formatPercent = (value: number, total: number): string => {
    if (total === 0) return '0%'
    return ((value / total) * 100).toFixed(1) + '%'
} 