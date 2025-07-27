<template>
  <div class="analysis-page">
    <!-- 分析类型选择 -->
    <el-card class="analysis-type-card">
      <el-tabs v-model="activeTab" @tab-click="handleTabChange">
        <el-tab-pane label="趋势分析" name="trend">
          <div class="tab-content">
            <el-row>
              <el-col :span="12">
                <div class="chart-container">
                  <h4>地震频率趋势</h4>
                  <v-chart
                    :option="frequencyTrendOption"
                    style="height: 300px"
                  />
                </div>
              </el-col>
              <el-col :span="12">
                <div class="chart-container">
                  <h4>震级变化趋势</h4>
                  <v-chart
                    :option="magnitudeTrendOption"
                    style="height: 300px"
                  />
                </div>
              </el-col>
            </el-row>
          </div>
        </el-tab-pane>

        <el-tab-pane label="区域分析" name="region">
          <div class="tab-content">
            <el-row>
              <el-col :span="12">
                <div class="chart-container">
                  <h4>各地区地震分布</h4>
                  <v-chart
                    :option="regionDistributionOption"
                    style="height: 300px"
                  />
                </div>
              </el-col>
              <el-col :span="12">
                <div class="chart-container">
                  <h4>区域风险等级</h4>
                  <v-chart :option="riskLevelOption" style="height: 300px" />
                </div>
              </el-col>
            </el-row>
          </div>
        </el-tab-pane>

        <el-tab-pane label="深度分析" name="depth">
          <div class="tab-content">
            <el-row>
              <el-col :span="12">
                <div class="chart-container">
                  <h4>震源深度分布</h4>
                  <v-chart
                    :option="depthDistributionOption"
                    style="height: 300px"
                  />
                </div>
              </el-col>
              <el-col :span="12">
                <div class="chart-container">
                  <h4>深度与震级关系</h4>
                  <v-chart
                    :option="depthMagnitudeOption"
                    style="height: 300px"
                  />
                </div>
              </el-col>
            </el-row>
          </div>
        </el-tab-pane>

        <el-tab-pane label="预测分析" name="prediction">
          <div class="tab-content">
            <el-row>
              <el-col :span="24">
                <div class="prediction-panel">
                  <h4>地震预测模型</h4>
                  <el-form :model="predictionForm" inline>
                    <el-form-item label="预测时间范围">
                      <el-select
                        v-model="predictionForm.timeRange"
                        placeholder="选择时间范围"
                      >
                        <el-option label="未来7天" value="7" />
                        <el-option label="未来30天" value="30" />
                        <el-option label="未来90天" value="90" />
                      </el-select>
                    </el-form-item>
                    <el-form-item label="预测区域">
                      <el-select
                        v-model="predictionForm.region"
                        placeholder="选择区域"
                      >
                        <el-option label="全国" value="all" />
                        <el-option label="华北地区" value="north" />
                        <el-option label="华南地区" value="south" />
                        <el-option label="华东地区" value="east" />
                        <el-option label="西部地区" value="west" />
                      </el-select>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" @click="runPrediction">
                        开始预测
                      </el-button>
                    </el-form-item>
                  </el-form>

                  <div v-if="predictionResult" class="prediction-result">
                    <h5>预测结果</h5>
                    <el-alert
                      :title="predictionResult.summary"
                      :type="predictionResult.level"
                      :description="predictionResult.details"
                      show-icon
                    />
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 分析报告 -->
    <el-card class="report-card">
      <template #header>
        <div class="card-header">
          <span>分析报告</span>
          <el-button type="primary" size="small" @click="generateReport"
            >生成报告</el-button
          >
        </div>
      </template>

      <div class="report-content">
        <el-timeline>
          <el-timeline-item
            v-for="(item, index) in analysisReport"
            :key="index"
            :timestamp="item.time"
            :type="item.type"
          >
            <h4>{{ item.title }}</h4>
            <p>{{ item.content }}</p>
            <div v-if="item.data" class="report-data">
              <el-tag
                v-for="(tag, tagIndex) in item.data"
                :key="tagIndex"
                :type="tag.type"
              >
                {{ tag.label }}: {{ tag.value }}
              </el-tag>
            </div>
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart, BarChart, PieChart, ScatterChart } from "echarts/charts";
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
  ScatterChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
]);

// 当前激活的标签页
const activeTab = ref("trend");

// 预测表单
const predictionForm = reactive({
  timeRange: "30",
  region: "all",
});

// 预测结果
const predictionResult = ref(null);

// 分析报告
const analysisReport = ref([
  {
    time: "2024-01-15 14:30",
    type: "primary",
    title: "地震频率分析",
    content: "本月地震频率较上月增加15%，主要集中在华南地区",
    data: [
      { label: "频率变化", value: "+15%", type: "warning" },
      { label: "主要区域", value: "华南", type: "info" },
    ],
  },
  {
    time: "2024-01-15 14:25",
    type: "success",
    title: "震级分布分析",
    content: "震级分布相对稳定，3级以下地震占主导地位",
    data: [
      { label: "平均震级", value: "2.8", type: "success" },
      { label: "最大震级", value: "4.2", type: "warning" },
    ],
  },
  {
    time: "2024-01-15 14:20",
    type: "warning",
    title: "风险预警",
    content: "广州地区存在地震风险，建议加强监测",
    data: [
      { label: "风险等级", value: "中等", type: "warning" },
      { label: "影响范围", value: "50km", type: "danger" },
    ],
  },
]);

// 频率趋势图表配置
const frequencyTrendOption = ref({
  tooltip: {
    trigger: "axis",
  },
  xAxis: {
    type: "category",
    data: [
      "1月",
      "2月",
      "3月",
      "4月",
      "5月",
      "6月",
      "7月",
      "8月",
      "9月",
      "10月",
      "11月",
      "12月",
    ],
  },
  yAxis: {
    type: "value",
    name: "地震次数",
  },
  series: [
    {
      name: "地震频率",
      type: "line",
      smooth: true,
      data: [120, 132, 101, 134, 90, 230, 210, 182, 191, 234, 290, 330],
      itemStyle: {
        color: "#409eff",
      },
    },
  ],
});

// 震级趋势图表配置
const magnitudeTrendOption = ref({
  tooltip: {
    trigger: "axis",
  },
  xAxis: {
    type: "category",
    data: [
      "1月",
      "2月",
      "3月",
      "4月",
      "5月",
      "6月",
      "7月",
      "8月",
      "9月",
      "10月",
      "11月",
      "12月",
    ],
  },
  yAxis: {
    type: "value",
    name: "平均震级",
  },
  series: [
    {
      name: "平均震级",
      type: "line",
      smooth: true,
      data: [2.8, 3.1, 2.5, 3.4, 3.0, 3.2, 2.9, 3.3, 2.7, 3.1, 3.5, 3.0],
      itemStyle: {
        color: "#67c23a",
      },
    },
  ],
});

// 区域分布图表配置
const regionDistributionOption = ref({
  tooltip: {
    trigger: "item",
  },
  legend: {
    orient: "vertical",
    left: "left",
  },
  series: [
    {
      name: "地震分布",
      type: "pie",
      radius: "50%",
      data: [
        { value: 35, name: "华北地区" },
        { value: 28, name: "华东地区" },
        { value: 22, name: "华南地区" },
        { value: 15, name: "其他地区" },
      ],
    },
  ],
});

// 风险等级图表配置
const riskLevelOption = ref({
  tooltip: {
    trigger: "axis",
  },
  xAxis: {
    type: "category",
    data: ["北京", "上海", "广州", "深圳", "成都", "西安"],
  },
  yAxis: {
    type: "value",
    name: "风险指数",
  },
  series: [
    {
      name: "风险等级",
      type: "bar",
      data: [65, 45, 85, 75, 55, 60],
      itemStyle: {
        color: function (params: any) {
          const colors = ["#67c23a", "#e6a23c", "#f56c6c"];
          const value = params.data;
          if (value < 50) return colors[0];
          if (value < 70) return colors[1];
          return colors[2];
        },
      },
    },
  ],
});

// 深度分布图表配置
const depthDistributionOption = ref({
  tooltip: {
    trigger: "axis",
  },
  xAxis: {
    type: "category",
    data: ["0-5km", "5-10km", "10-15km", "15-20km", "20-25km", "25km以上"],
  },
  yAxis: {
    type: "value",
    name: "地震次数",
  },
  series: [
    {
      name: "深度分布",
      type: "bar",
      data: [25, 35, 28, 20, 15, 7],
      itemStyle: {
        color: "#909399",
      },
    },
  ],
});

// 深度与震级关系图表配置
const depthMagnitudeOption = ref({
  tooltip: {
    trigger: "item",
  },
  xAxis: {
    type: "value",
    name: "深度(km)",
  },
  yAxis: {
    type: "value",
    name: "震级",
  },
  series: [
    {
      name: "深度-震级关系",
      type: "scatter",
      data: [
        [5, 2.1],
        [8, 2.5],
        [12, 3.2],
        [15, 2.8],
        [18, 3.5],
        [22, 3.8],
        [25, 4.1],
        [30, 3.9],
        [35, 4.5],
        [40, 4.2],
      ],
      itemStyle: {
        color: "#409eff",
      },
    },
  ],
});

// 预测图表配置
const predictionChartOption = ref({
  tooltip: {
    trigger: "axis",
  },
  legend: {
    data: ["历史数据", "预测数据"],
  },
  xAxis: {
    type: "category",
    data: [
      "1月",
      "2月",
      "3月",
      "4月",
      "5月",
      "6月",
      "7月",
      "8月",
      "9月",
      "10月",
      "11月",
      "12月",
    ],
  },
  yAxis: {
    type: "value",
    name: "地震次数",
  },
  series: [
    {
      name: "历史数据",
      type: "line",
      data: [120, 132, 101, 134, 90, 230, 210, 182, 191, 234, 290, 330],
      itemStyle: {
        color: "#409eff",
      },
    },
    {
      name: "预测数据",
      type: "line",
      data: [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        280,
        320,
      ],
      itemStyle: {
        color: "#f56c6c",
      },
      lineStyle: {
        type: "dashed",
      },
    },
  ],
});

// 处理标签页变化
const handleTabChange = (tab: any) => {
  console.log("切换到标签页:", tab.props.name);
};

// 运行预测
const runPrediction = () => {
  console.log("开始预测:", predictionForm);

  // 模拟预测结果
  predictionResult.value = {
    summary: "预测完成",
    level: "info",
    details: `基于历史数据分析，未来${predictionForm.timeRange}天内，${
      predictionForm.region === "all" ? "全国" : "选定区域"
    }预计发生地震${Math.floor(Math.random() * 20) + 10}次，平均震级约2.8级。`,
  };
};

// 生成报告
const generateReport = () => {
  console.log("生成分析报告");
};

onMounted(() => {
  console.log("数据分析页面初始化完成");
});
</script>

<style scoped>
.analysis-page {
  padding: 0;
  width: 100%;
  margin: 0;
}

.analysis-type-card {
  margin-bottom: 20px;
  margin-left: 0;
  margin-right: 0;
}

.tab-content {
  padding: 20px 0;
}

.chart-container {
  margin-bottom: 20px;
}

.chart-container h4 {
  margin-bottom: 15px;
  color: #303133;
  font-size: 16px;
}

.prediction-panel {
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.prediction-panel h4 {
  margin-bottom: 20px;
  color: #303133;
}

.prediction-result {
  margin: 20px 0;
}

.prediction-result h5 {
  margin-bottom: 10px;
  color: #303133;
}

.report-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.report-content {
  padding: 20px 0;
}

.report-data {
  margin-top: 10px;
}

.report-data .el-tag {
  margin-right: 10px;
  margin-bottom: 5px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .analysis-type-card {
    margin-left: 0;
    margin-right: 0;
  }
}
</style> 