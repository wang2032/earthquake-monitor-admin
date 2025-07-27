<template>
  <div class="dashboard">
    <!-- 统计卡片 -->
    <el-row class="stats-row">
      <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
        <el-card class="stats-card" shadow="hover">
          <div class="stats-content">
            <div class="stats-icon warning">
              <el-icon><Warning /></el-icon>
            </div>
            <div class="stats-info">
              <div class="stats-number">{{ stats.totalAlerts }}</div>
              <div class="stats-label">今日预警</div>
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
              <div class="stats-number">{{ stats.activeStations }}</div>
              <div class="stats-label">监测站点</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
        <el-card class="stats-card" shadow="hover">
          <div class="stats-content">
            <div class="stats-icon success">
              <el-icon><DataLine /></el-icon>
            </div>
            <div class="stats-info">
              <div class="stats-number">{{ stats.todayEvents }}</div>
              <div class="stats-label">今日事件</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
        <el-card class="stats-card" shadow="hover">
          <div class="stats-content">
            <div class="stats-icon info">
              <el-icon><TrendCharts /></el-icon>
            </div>
            <div class="stats-info">
              <div class="stats-number">{{ stats.avgMagnitude }}</div>
              <div class="stats-label">平均震级</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row class="charts-row">
      <el-col :xs="24" :lg="12">
        <el-card class="chart-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span>最近7天地震趋势</span>
            </div>
          </template>
          <div class="chart-container">
            <v-chart :option="trendChartOption" style="height: 280px" />
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :lg="12">
        <el-card class="chart-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span>震级分布</span>
            </div>
          </template>
          <div class="chart-container">
            <v-chart :option="magnitudeChartOption" style="height: 280px" />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 实时监测数据 -->
    <el-row class="data-row">
      <el-col :xs="24" :lg="16">
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
                <el-tag
                  :type="row.status === '正常' ? 'success' : 'danger'"
                  size="small"
                >
                  {{ row.status }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <el-col :xs="24" :lg="8">
        <el-card class="alert-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span>最新预警</span>
            </div>
          </template>

          <div class="alert-list">
            <div
              v-for="alert in recentAlerts"
              :key="alert.id"
              class="alert-item"
              :class="alert.level"
            >
              <div class="alert-header">
                <span class="alert-title">{{ alert.title }}</span>
                <span class="alert-time">{{ alert.time }}</span>
              </div>
              <div class="alert-content">{{ alert.content }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart, BarChart, PieChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from "echarts/components";
import VChart from "vue-echarts";

use([
  CanvasRenderer,
  LineChart,
  BarChart,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
]);

// 统计数据
const stats = ref({
  totalAlerts: 5,
  activeStations: 128,
  todayEvents: 23,
  avgMagnitude: 3.2,
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
]);

// 最新预警
const recentAlerts = ref([
  {
    id: 1,
    title: "广州地区地震预警",
    content: "检测到3.2级地震，请相关部门注意防范",
    time: "14:25",
    level: "warning",
  },
  {
    id: 2,
    title: "系统维护通知",
    content: "系统将于今晚22:00-24:00进行维护",
    time: "10:30",
    level: "info",
  },
]);

// 趋势图表配置
const trendChartOption = ref({
  tooltip: {
    trigger: "axis",
  },
  legend: {
    data: ["地震次数", "平均震级"],
  },
  xAxis: {
    type: "category",
    data: ["1-9", "1-10", "1-11", "1-12", "1-13", "1-14", "1-15"],
  },
  yAxis: [
    {
      type: "value",
      name: "次数",
      position: "left",
    },
    {
      type: "value",
      name: "震级",
      position: "right",
    },
  ],
  series: [
    {
      name: "地震次数",
      type: "line",
      data: [12, 15, 8, 20, 18, 25, 23],
    },
    {
      name: "平均震级",
      type: "line",
      yAxisIndex: 1,
      data: [2.8, 3.1, 2.5, 3.4, 3.0, 3.2, 3.2],
    },
  ],
});

// 震级分布图表配置
const magnitudeChartOption = ref({
  tooltip: {
    trigger: "item",
  },
  legend: {
    orient: "vertical",
    left: "left",
  },
  series: [
    {
      name: "震级分布",
      type: "pie",
      radius: "50%",
      data: [
        { value: 45, name: "1-2级" },
        { value: 30, name: "2-3级" },
        { value: 15, name: "3-4级" },
        { value: 8, name: "4-5级" },
        { value: 2, name: "5级以上" },
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: "rgba(0, 0, 0, 0.5)",
        },
      },
    },
  ],
});

// 刷新数据
const refreshData = () => {
  // 模拟数据刷新
  console.log("刷新数据");
};

onMounted(() => {
  // 初始化数据
  console.log("仪表盘初始化完成");
});
</script>

<style scoped>
.dashboard {
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

.stats-icon.warning {
  background-color: #e6a23c;
}

.stats-icon.primary {
  background-color: #409eff;
}

.stats-icon.success {
  background-color: #67c23a;
}

.stats-icon.info {
  background-color: #909399;
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

.charts-row {
  margin-bottom: 16px;
  padding: 0;
}

.chart-card {
  height: 360px;
  transition: all 0.3s;
}

.chart-card:hover {
  transform: translateY(-2px);
}

.chart-container {
  height: 280px;
}

.data-row {
  margin-bottom: 16px;
  padding: 0;
}

.data-card {
  height: 400px;
  transition: all 0.3s;
}

.data-card:hover {
  transform: translateY(-2px);
}

.alert-card {
  height: 400px;
  transition: all 0.3s;
}

.alert-card:hover {
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.alert-list {
  max-height: 320px;
  overflow-y: auto;
}

.alert-item {
  padding: 12px;
  margin-bottom: 12px;
  border-radius: 6px;
  border-left: 3px solid;
}

.alert-item.warning {
  background-color: #fdf6ec;
  border-left-color: #e6a23c;
}

.alert-item.info {
  background-color: #f4f4f5;
  border-left-color: #909399;
}

.alert-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.alert-title {
  font-weight: bold;
  color: #303133;
  font-size: 14px;
}

.alert-time {
  font-size: 12px;
  color: #909399;
}

.alert-content {
  font-size: 13px;
  color: #606266;
  line-height: 1.4;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .dashboard {
    padding: 0;
    margin: 0;
  }

  .stats-row,
  .charts-row,
  .data-row {
    padding: 0;
    margin-bottom: 8px;
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

  .chart-card {
    height: 300px;
    margin-bottom: 16px;
  }

  .chart-container {
    height: 220px;
  }

  .data-card,
  .alert-card {
    height: 350px;
    margin-bottom: 16px;
  }
}
</style> 