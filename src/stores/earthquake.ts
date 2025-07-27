import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface EarthquakeData {
    id: number
    time: string
    magnitude: number
    depth: number
    location: string
    latitude: number
    longitude: number
    station: string
}

export interface StationData {
    id: number
    name: string
    location: string
    status: 'online' | 'offline' | 'warning'
    lastUpdate: string
    coordinates: string
}

export interface AlertData {
    id: number
    time: string
    rule: string
    level: 'low' | 'medium' | 'high' | 'urgent'
    location: string
    magnitude: number
    status: 'pending' | 'handled'
    notified: boolean
}

export const useEarthquakeStore = defineStore('earthquake', () => {
    // 地震数据
    const earthquakeData = ref<EarthquakeData[]>([])

    // 监测站点数据
    const stationData = ref<StationData[]>([])

    // 预警数据
    const alertData = ref<AlertData[]>([])

    // 统计数据
    const statistics = ref({
        totalAlerts: 0,
        activeStations: 0,
        todayEvents: 0,
        avgMagnitude: 0
    })

    // 计算属性
    const onlineStations = computed(() =>
        stationData.value.filter(station => station.status === 'online')
    )

    const warningStations = computed(() =>
        stationData.value.filter(station => station.status === 'warning')
    )

    const offlineStations = computed(() =>
        stationData.value.filter(station => station.status === 'offline')
    )

    const pendingAlerts = computed(() =>
        alertData.value.filter(alert => alert.status === 'pending')
    )

    // 添加地震数据
    const addEarthquakeData = (data: EarthquakeData) => {
        earthquakeData.value.unshift(data)
        updateStatistics()
    }

    // 更新站点状态
    const updateStationStatus = (stationId: number, status: StationData['status']) => {
        const station = stationData.value.find(s => s.id === stationId)
        if (station) {
            station.status = status
            station.lastUpdate = new Date().toLocaleString()
        }
    }

    // 添加预警
    const addAlert = (alert: AlertData) => {
        alertData.value.unshift(alert)
        updateStatistics()
    }

    // 处理预警
    const handleAlert = (alertId: number) => {
        const alert = alertData.value.find(a => a.id === alertId)
        if (alert) {
            alert.status = 'handled'
        }
    }

    // 更新统计数据
    const updateStatistics = () => {
        const today = new Date().toDateString()
        const todayEvents = earthquakeData.value.filter(data =>
            new Date(data.time).toDateString() === today
        ).length

        const avgMagnitude = earthquakeData.value.length > 0
            ? earthquakeData.value.reduce((sum, data) => sum + data.magnitude, 0) / earthquakeData.value.length
            : 0

        statistics.value = {
            totalAlerts: alertData.value.length,
            activeStations: onlineStations.value.length,
            todayEvents,
            avgMagnitude: Math.round(avgMagnitude * 10) / 10
        }
    }

    // 初始化模拟数据
    const initMockData = () => {
        // 模拟地震数据
        earthquakeData.value = [
            {
                id: 1,
                time: '2024-01-15 14:30:25',
                magnitude: 2.5,
                depth: 10.2,
                location: '北京市海淀区',
                latitude: 39.9,
                longitude: 116.3,
                station: '北京站'
            },
            {
                id: 2,
                time: '2024-01-15 14:25:45',
                magnitude: 3.2,
                depth: 15.6,
                location: '广州市天河区',
                latitude: 23.1,
                longitude: 113.3,
                station: '广州站'
            }
        ]

        // 模拟站点数据
        stationData.value = [
            {
                id: 1,
                name: '北京站',
                location: '北京市海淀区',
                status: 'online',
                lastUpdate: '2024-01-15 14:30:25',
                coordinates: '116.3, 39.9'
            },
            {
                id: 2,
                name: '上海站',
                location: '上海市浦东新区',
                status: 'online',
                lastUpdate: '2024-01-15 14:28:10',
                coordinates: '121.5, 31.2'
            },
            {
                id: 3,
                name: '广州站',
                location: '广州市天河区',
                status: 'warning',
                lastUpdate: '2024-01-15 14:25:45',
                coordinates: '113.3, 23.1'
            }
        ]

        // 模拟预警数据
        alertData.value = [
            {
                id: 1,
                time: '2024-01-15 14:30:25',
                rule: '高震级预警',
                level: 'high',
                location: '广州市天河区',
                magnitude: 3.2,
                status: 'pending',
                notified: true
            },
            {
                id: 2,
                time: '2024-01-15 14:25:10',
                rule: '浅层地震预警',
                level: 'medium',
                location: '北京市海淀区',
                magnitude: 2.5,
                status: 'handled',
                notified: true
            }
        ]

        updateStatistics()
    }

    // 获取地震数据
    const fetchEarthquakeData = async (params?: any) => {
        // 模拟API调用
        console.log('获取地震数据:', params)
        return earthquakeData.value
    }

    // 获取站点数据
    const fetchStationData = async () => {
        // 模拟API调用
        console.log('获取站点数据')
        return stationData.value
    }

    // 获取预警数据
    const fetchAlertData = async () => {
        // 模拟API调用
        console.log('获取预警数据')
        return alertData.value
    }

    return {
        // 状态
        earthquakeData,
        stationData,
        alertData,
        statistics,

        // 计算属性
        onlineStations,
        warningStations,
        offlineStations,
        pendingAlerts,

        // 方法
        addEarthquakeData,
        updateStationStatus,
        addAlert,
        handleAlert,
        updateStatistics,
        initMockData,
        fetchEarthquakeData,
        fetchStationData,
        fetchAlertData
    }
}) 