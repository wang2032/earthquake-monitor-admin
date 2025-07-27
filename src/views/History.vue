<template>
  <div class="history-page">
    <!-- 查询条件 -->
    <el-card class="query-card">
      <el-form :model="queryForm" inline>
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="queryForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>

        <el-form-item label="震级范围">
          <el-select
            v-model="queryForm.magnitudeRange"
            placeholder="选择震级范围"
          >
            <el-option label="全部" value="" />
            <el-option label="1-2级" value="1-2" />
            <el-option label="2-3级" value="2-3" />
            <el-option label="3-4级" value="3-4" />
            <el-option label="4-5级" value="4-5" />
            <el-option label="5级以上" value="5+" />
          </el-select>
        </el-form-item>

        <el-form-item label="地区">
          <el-select
            v-model="queryForm.region"
            placeholder="选择地区"
            clearable
          >
            <el-option label="北京" value="北京" />
            <el-option label="上海" value="上海" />
            <el-option label="广州" value="广州" />
            <el-option label="深圳" value="深圳" />
            <el-option label="成都" value="成都" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
          <el-button type="success" @click="handleExport">导出数据</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 统计图表 -->
    <el-row class="charts-row">
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>震级分布统计</span>
            </div>
          </template>
          <div class="chart-container">
            <v-chart
              :option="magnitudeDistributionOption"
              style="height: 300px"
            />
          </div>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>时间趋势分析</span>
            </div>
          </template>
          <div class="chart-container">
            <v-chart :option="timeTrendOption" style="height: 300px" />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 数据表格 -->
    <el-card class="table-card">
      <template #header>
        <div class="card-header">
          <span>历史地震数据</span>
          <div class="table-controls">
            <span class="total-count">共 {{ totalCount }} 条记录</span>
            <el-button size="small" @click="refreshData">刷新</el-button>
          </div>
        </div>
      </template>

      <el-table
        :data="tableData"
        style="width: 100%"
        stripe
        v-loading="loading"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="time" label="发生时间" width="180" />
        <el-table-column prop="magnitude" label="震级" width="100">
          <template #default="{ row }">
            <el-tag :type="getMagnitudeType(row.magnitude)">{{
              row.magnitude
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="depth" label="深度(km)" width="120" />
        <el-table-column prop="location" label="位置" />
        <el-table-column prop="latitude" label="纬度" width="100" />
        <el-table-column prop="longitude" label="经度" width="100" />
        <el-table-column prop="station" label="监测站点" width="120" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="viewDetail(row)">详情</el-button>
            <el-button size="small" type="primary" @click="viewMap(row)"
              >地图</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="totalCount"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 详情对话框 -->
    <el-dialog v-model="detailVisible" title="地震详情" width="800px">
      <div v-if="selectedRecord" class="detail-content">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="地震ID">{{
            selectedRecord.id
          }}</el-descriptions-item>
          <el-descriptions-item label="发生时间">{{
            selectedRecord.time
          }}</el-descriptions-item>
          <el-descriptions-item label="震级">
            <el-tag :type="getMagnitudeType(selectedRecord.magnitude)">{{
              selectedRecord.magnitude
            }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="深度"
            >{{ selectedRecord.depth }}km</el-descriptions-item
          >
          <el-descriptions-item label="位置">{{
            selectedRecord.location
          }}</el-descriptions-item>
          <el-descriptions-item label="监测站点">{{
            selectedRecord.station
          }}</el-descriptions-item>
          <el-descriptions-item label="纬度">{{
            selectedRecord.latitude
          }}</el-descriptions-item>
          <el-descriptions-item label="经度">{{
            selectedRecord.longitude
          }}</el-descriptions-item>
        </el-descriptions>

        <div class="detail-charts">
          <h4>震波图</h4>
          <div class="waveform-container">
            <div class="waveform-placeholder">震波图显示区域</div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { BarChart, LineChart, PieChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from "echarts/components";
import VChart from "vue-echarts";

use([
  CanvasRenderer,
  BarChart,
  LineChart,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
]);

// 查询表单
const queryForm = reactive({
  dateRange: [],
  magnitudeRange: "",
  region: "",
});

// 表格数据
const tableData = ref([
  {
    id: 1,
    time: "2024-01-15 14:30:25",
    magnitude: 2.5,
    depth: 10.2,
    location: "北京市海淀区",
    latitude: "39.9",
    longitude: "116.3",
    station: "北京站",
  },
  {
    id: 2,
    time: "2024-01-15 14:25:45",
    magnitude: 3.2,
    depth: 15.6,
    location: "广州市天河区",
    latitude: "23.1",
    longitude: "113.3",
    station: "广州站",
  },
  {
    id: 3,
    time: "2024-01-15 14:20:10",
    magnitude: 1.8,
    depth: 8.5,
    location: "上海市浦东新区",
    latitude: "31.2",
    longitude: "121.5",
    station: "上海站",
  },
]);

// 分页相关
const currentPage = ref(1);
const pageSize = ref(20);
const totalCount = ref(156);
const loading = ref(false);

// 选中的记录
const selectedRecords = ref([]);
const selectedRecord = ref(null);
const detailVisible = ref(false);

// 震级分布图表配置
const magnitudeDistributionOption = ref({
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

// 时间趋势图表配置
const timeTrendOption = ref({
  tooltip: {
    trigger: "axis",
  },
  legend: {
    data: ["地震次数", "平均震级"],
  },
  xAxis: {
    type: "category",
    data: ["1月", "2月", "3月", "4月", "5月", "6月"],
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
      type: "bar",
      data: [120, 132, 101, 134, 90, 230],
    },
    {
      name: "平均震级",
      type: "line",
      yAxisIndex: 1,
      data: [2.8, 3.1, 2.5, 3.4, 3.0, 3.2],
    },
  ],
});

// 获取震级类型
const getMagnitudeType = (magnitude: number) => {
  if (magnitude < 2) return "info";
  if (magnitude < 3) return "success";
  if (magnitude < 4) return "warning";
  return "danger";
};

// 查询数据
const handleQuery = () => {
  loading.value = true;
  // 模拟API调用
  setTimeout(() => {
    loading.value = false;
    console.log("查询条件:", queryForm);
  }, 1000);
};

// 重置查询
const handleReset = () => {
  queryForm.dateRange = [];
  queryForm.magnitudeRange = "";
  queryForm.region = "";
};

// 导出数据
const handleExport = () => {
  console.log("导出数据");
};

// 刷新数据
const refreshData = () => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 1000);
};

// 查看详情
const viewDetail = (row: any) => {
  selectedRecord.value = row;
  detailVisible.value = true;
};

// 查看地图
const viewMap = (row: any) => {
  console.log("查看地图:", row);
};

// 选择变化
const handleSelectionChange = (selection: any[]) => {
  selectedRecords.value = selection;
};

// 分页大小变化
const handleSizeChange = (size: number) => {
  pageSize.value = size;
  currentPage.value = 1;
  // 重新加载数据
};

// 当前页变化
const handleCurrentChange = (page: number) => {
  currentPage.value = page;
  // 重新加载数据
};

onMounted(() => {
  console.log("历史数据页面初始化完成");
});
</script>

<style scoped>
.history-page {
  padding: 0;
  width: 100%;
  margin: 0;
}

.query-card {
  margin-bottom: 20px;
  margin-left: 0;
  margin-right: 0;
}

.charts-row {
  margin-bottom: 20px;
  padding: 0;
}

.chart-card {
  height: 400px;
}

.chart-container {
  height: 300px;
}

.table-card {
  margin-bottom: 20px;
  margin-left: 0;
  margin-right: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.table-controls {
  display: flex;
  align-items: center;
  gap: 15px;
}

.total-count {
  color: #606266;
  font-size: 14px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.detail-content {
  padding: 20px 0;
}

.detail-charts {
  margin-top: 20px;
}

.detail-charts h4 {
  margin-bottom: 15px;
  color: #303133;
}

.waveform-container {
  height: 200px;
  background-color: #f5f5f5;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.waveform-placeholder {
  color: #909399;
  text-align: center;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .query-card,
  .table-card {
    margin-left: 0;
    margin-right: 0;
  }

  .charts-row {
    padding: 0;
  }
}
</style> 