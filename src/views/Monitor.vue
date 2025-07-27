<template>
  <div class="monitor">
    <!-- 统计卡片 -->
    <el-row class="stats-row">
      <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
        <el-card class="stats-card" shadow="hover">
          <div class="stats-content">
            <div class="stats-icon success">
              <el-icon><CircleCheck /></el-icon>
            </div>
            <div class="stats-info">
              <div class="stats-number">{{ stats.onlineStations }}</div>
              <div class="stats-label">在线站点</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
        <el-card class="stats-card" shadow="hover">
          <div class="stats-content">
            <div class="stats-icon danger">
              <el-icon><CircleClose /></el-icon>
            </div>
            <div class="stats-info">
              <div class="stats-number">{{ stats.offlineStations }}</div>
              <div class="stats-label">离线站点</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
        <el-card class="stats-card" shadow="hover">
          <div class="stats-content">
            <div class="stats-icon warning">
              <el-icon><Warning /></el-icon>
            </div>
            <div class="stats-info">
              <div class="stats-number">{{ stats.alertStations }}</div>
              <div class="stats-label">预警站点</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
        <el-card class="stats-card" shadow="hover">
          <div class="stats-content">
            <div class="stats-icon primary">
              <el-icon><Location /></el-icon>
            </div>
            <div class="stats-info">
              <div class="stats-number">{{ stats.totalStations }}</div>
              <div class="stats-label">总站点数</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 监测站点分布图 -->
    <el-row class="map-row">
      <el-col :span="24">
        <el-card class="map-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span>监测站点分布图</span>
              <div class="header-actions">
                <el-button type="primary" size="small" @click="refreshMap">
                  刷新
                </el-button>
                <el-button
                  :type="autoRefresh ? 'success' : 'default'"
                  size="small"
                  @click="toggleAutoRefresh"
                >
                  {{ autoRefresh ? "停止自动刷新" : "开始自动刷新" }}
                </el-button>
              </div>
            </div>
          </template>

          <div class="map-container">
            <div class="map-placeholder">
              <el-icon class="map-icon"><Location /></el-icon>
              <p>地图加载中...</p>
              <p class="map-tip">这里将显示监测站点的地理分布</p>
            </div>

            <!-- 图例 -->
            <div class="map-legend">
              <div class="legend-item">
                <span class="legend-dot online"></span>
                <span>在线</span>
              </div>
              <div class="legend-item">
                <span class="legend-dot offline"></span>
                <span>离线</span>
              </div>
              <div class="legend-item">
                <span class="legend-dot alert"></span>
                <span>预警</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 实时监测数据 -->
    <el-row class="data-row">
      <el-col :span="24">
        <el-card class="data-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span>实时监测数据</span>
              <el-button type="primary" size="small" @click="refreshData">
                刷新数据
              </el-button>
            </div>
          </template>

          <el-table
            :data="realtimeData"
            style="width: 100%"
            stripe
            size="small"
          >
            <el-table-column prop="station" label="监测站点" width="120" />
            <el-table-column prop="magnitude" label="震级" width="80" />
            <el-table-column prop="depth" label="深度(km)" width="100" />
            <el-table-column prop="location" label="位置" />
            <el-table-column prop="time" label="时间" width="160" />
            <el-table-column prop="status" label="状态" width="80">
              <template #default="{ row }">
                <el-tag :type="getStatusType(row.status)" size="small">
                  {{ row.status }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120">
              <template #default="{ row }">
                <el-button type="text" size="small" @click="viewDetail(row)">
                  查看详情
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <!-- 站点详情对话框 -->
    <el-dialog
      v-model="detailVisible"
      title="站点详情"
      width="600px"
      :before-close="handleClose"
    >
      <div v-if="selectedStation" class="station-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="站点名称">{{
            selectedStation.station
          }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="getStatusType(selectedStation.status)">
              {{ selectedStation.status }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="震级">{{
            selectedStation.magnitude
          }}</el-descriptions-item>
          <el-descriptions-item label="深度"
            >{{ selectedStation.depth }}km</el-descriptions-item
          >
          <el-descriptions-item label="位置" :span="2">{{
            selectedStation.location
          }}</el-descriptions-item>
          <el-descriptions-item label="时间" :span="2">{{
            selectedStation.time
          }}</el-descriptions-item>
        </el-descriptions>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="detailVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

// 统计数据
const stats = ref({
  onlineStations: 115,
  offlineStations: 8,
  alertStations: 5,
  totalStations: 128,
});

// 实时监测数据
const realtimeData = ref([
  {
    station: "北京站",
    magnitude: 2.5,
    depth: 10.2,
    location: "北京市海淀区",
    time: "2024-01-15 14:30:25",
    status: "正常",
  },
  {
    station: "上海站",
    magnitude: 1.8,
    depth: 8.5,
    location: "上海市浦东新区",
    time: "2024-01-15 14:28:10",
    status: "正常",
  },
  {
    station: "广州站",
    magnitude: 3.2,
    depth: 15.6,
    location: "广州市天河区",
    time: "2024-01-15 14:25:45",
    status: "预警",
  },
  {
    station: "深圳站",
    magnitude: 2.1,
    depth: 12.3,
    location: "深圳市南山区",
    time: "2024-01-15 14:20:15",
    status: "正常",
  },
  {
    station: "成都站",
    magnitude: 2.8,
    depth: 18.7,
    location: "成都市武侯区",
    time: "2024-01-15 14:15:30",
    status: "离线",
  },
]);

// 自动刷新状态
const autoRefresh = ref(false);

// 详情对话框
const detailVisible = ref(false);
const selectedStation = ref(null);

// 获取状态类型
const getStatusType = (status: string) => {
  switch (status) {
    case "正常":
      return "success";
    case "预警":
      return "warning";
    case "离线":
      return "danger";
    default:
      return "info";
  }
};

// 刷新地图
const refreshMap = () => {
  console.log("刷新地图");
};

// 切换自动刷新
const toggleAutoRefresh = () => {
  autoRefresh.value = !autoRefresh.value;
  console.log("自动刷新:", autoRefresh.value ? "开启" : "关闭");
};

// 刷新数据
const refreshData = () => {
  console.log("刷新数据");
};

// 查看详情
const viewDetail = (station: any) => {
  selectedStation.value = station;
  detailVisible.value = true;
};

// 关闭对话框
const handleClose = () => {
  detailVisible.value = false;
  selectedStation.value = null;
};

onMounted(() => {
  console.log("实时监测页面初始化完成");
});
</script>

<style scoped>
.monitor {
  padding: 0;
  width: 100%;
  margin: 0;
}

.stats-row {
  margin-bottom: 16px;
  padding: 0;
}

.stats-card {
  height: 100px;
  transition: all 0.3s;
}

.stats-card:hover {
  transform: translateY(-2px);
}

.stats-content {
  display: flex;
  align-items: center;
  height: 100%;
}

.stats-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  font-size: 20px;
  color: white;
}

.stats-icon.success {
  background-color: #67c23a;
}

.stats-icon.danger {
  background-color: #f56c6c;
}

.stats-icon.warning {
  background-color: #e6a23c;
}

.stats-icon.primary {
  background-color: #409eff;
}

.stats-info {
  flex: 1;
}

.stats-number {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 4px;
}

.stats-label {
  font-size: 14px;
  color: #909399;
}

.map-row {
  margin-bottom: 16px;
  padding: 0;
}

.map-card {
  height: 400px;
  transition: all 0.3s;
}

.map-card:hover {
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.map-container {
  position: relative;
  height: 320px;
  background-color: #f8f9fa;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.map-placeholder {
  text-align: center;
  color: #909399;
}

.map-icon {
  font-size: 48px;
  margin-bottom: 16px;
  color: #c0c4cc;
}

.map-tip {
  font-size: 12px;
  margin-top: 8px;
}

.map-legend {
  position: absolute;
  bottom: 20px;
  left: 20px;
  display: flex;
  gap: 20px;
  background: white;
  padding: 10px 15px;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.legend-dot.online {
  background-color: #67c23a;
}

.legend-dot.offline {
  background-color: #f56c6c;
}

.legend-dot.alert {
  background-color: #e6a23c;
}

.data-row {
  margin-bottom: 16px;
  padding: 0;
}

.data-card {
  transition: all 0.3s;
}

.data-card:hover {
  transform: translateY(-2px);
}

.station-detail {
  padding: 20px 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .monitor {
    padding: 0;
    margin: 0;
  }

  .stats-card {
    height: 80px;
    margin-bottom: 8px;
  }

  .stats-icon {
    width: 40px;
    height: 40px;
    font-size: 16px;
    margin-right: 12px;
  }

  .stats-number {
    font-size: 20px;
  }

  .map-card {
    height: 300px;
    margin-bottom: 16px;
  }

  .map-container {
    height: 220px;
  }

  .map-legend {
    position: static;
    margin-top: 15px;
    justify-content: center;
  }

  .header-actions {
    flex-direction: column;
    gap: 5px;
  }

  .stats-row,
  .map-row,
  .data-row {
    padding: 0;
    margin-bottom: 8px;
  }
}
</style> 