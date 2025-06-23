<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router';
import { fetchData } from '@/composables/fetchData'
import StarRating from '@/components/StarRating.vue'
import PostsView from '@/components/PostsView.vue';

import * as echarts from 'echarts/core';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent
} from 'echarts/components';
import { PieChart, LineChart } from 'echarts/charts';
import { LabelLayout } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';


echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  PieChart,
  LineChart,
  CanvasRenderer,
  LabelLayout
]);

type EChartsCoreOption = echarts.EChartsCoreOption;
type LabelFormatter = {
  name: string,
  percent: number
}

const route = useRoute()

interface PerformanceResult {
  rank: string;
  score: number;
  platform: string;
  [key: string]: string | number | null; // Allow other properties
}

interface InfluenceFactor {
  influence_score: number;
  [key: string]: string | number;
}

interface ObjData {
  [key: string]: string | number | null;
}

interface DetailResponse {
  performanceResult: PerformanceResult[]
  influenceFactor: InfluenceFactor[]
  regressionResults: ObjData[]
  sectorDistribution: ObjData[]
  stockSignals: ObjData[]
}

const performanceResult = ref<PerformanceResult>(
  {
    rank: '',
    score: 0,
    platform: '',
  }
)
const influenceFactor = ref<InfluenceFactor>({
  influence_score: 0,
})
const regressionResults = ref<ObjData[]>([])
const sectorDistribution = ref<ObjData[]>([])
const stockSignals = ref<ObjData[]>([])

// pie chart, sector distribution
const chartRef = ref()
const drawSectorDistribution = () => {
  const top = sectorDistribution.value.length > 15 ? '30%' : '8%';
  const pieChart = echarts.init(chartRef.value);
  const option: EChartsCoreOption = {
    tooltip: {
      trigger: 'item',
      // formatter: '{b}: {d}%'
    },
    legend: {
      top: '1%',
      left: 'center',
      textStyle: {
        fontSize: 15,
        color: "rgba(251, 251, 251, 1)"
      },
      padding: [0, 0, 50, 0]
    },
    series: [
      {
        name: 'Count',
        type: 'pie',
        radius: '50%',
        data: sectorDistribution.value,
        emphasis: {
          // label: {show: true},
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        label: {
          // formatter: '{b}: {d}%',
          formatter: function (params: LabelFormatter) {
            return `${params.name}: ${params.percent.toFixed(1)}%`;
          },

          fontSize: 14,
          color: "rgba(251, 251, 251, 1)"
        },
        top: top
      }
    ]
  }

  pieChart.setOption(option);

  window.addEventListener("resize", () => {
    pieChart.resize();
  });
}

// line chart, n day returns
const returnRef = ref()
const drawReturnChart = () => {
  const lineChart = echarts.init(returnRef.value)
  const dates = stockSignals.value.map(signal => signal.signal_date_f);
  const nday_return = stockSignals.value.map(signal => signal.nday_return);
  const option = {
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: dates,
      axisTick: { alignWithLabel: true },
      // splitLine: {
      //     show: true
      // }
      axisLabel: {
        color: "rgba(251, 251, 251, 1)"
      }
    },
    yAxis: {
      type: 'value',
      name: '20-Day Return (%)',
      nameTextStyle: {
        color: "rgba(251, 251, 251, 1)"
      },
      axisLabel: {
        fontSize: 13,
        color: "rgba(251, 251, 251, 1)"
      },
      scale: true // true: the axis may not contain zero position
    },
    series: [
      {
        name: 'Return',
        data: nday_return,
        type: 'line',
        symbol: 'circle', // Symbol type at the two ends of the line
      }
    ]
  }

  lineChart.setOption(option);

  window.addEventListener("resize", () => {
    lineChart.resize();
  });

}


onMounted(async () => {
  const response = await fetchData<DetailResponse>('/api/detail/' + encodeURIComponent(route.params.analyst as string))
  if (response) {
    performanceResult.value = response.performanceResult[0]
    influenceFactor.value = response.influenceFactor[0]
    regressionResults.value = response.regressionResults
    sectorDistribution.value = response.sectorDistribution
    stockSignals.value = response.stockSignals

    drawSectorDistribution()
    drawReturnChart()
  }
})
</script>

<template>
  <main class="container py-3">
    <div class="mb-2">
      <h2 class="text-center text-light fw-bold">{{ route.params.analyst }}</h2>
      <template v-if="influenceFactor.influence_score">
        <h5 class="text-center">Influence Score: {{ influenceFactor.influence_score }}</h5>
      </template>
      <template v-if="performanceResult.rank">
        <h5 class="text-center">Accuracy Score: {{ performanceResult.score }}</h5>
        <h4 class="text-center fw-bold">
          <StarRating :rank="performanceResult.rank" />
        </h4>
      </template>
    </div>

    <!-- Performance Summary -->
    <div v-if="performanceResult" class="card shadow mb-4 text-bg-dark ">
      <div class="card-header text-bg-dark fw-bold text-center">Performance Summary</div>
      <div class="card-body p-1">
        <table class="table table-dark  table-hover">
          <tbody>
            <template v-for="(key) in Object.keys(performanceResult)" :key="key">
              <tr v-if="performanceResult[key] != null && key !== 'score' && key !== 'rank' && key !== 'platform'">
                <th class="col-4 text-end">{{ key }}</th>
                <td class="text-start">{{ performanceResult[key] }}</td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>

    <div class="row d-flex justify-content-between align-items-center mb-4">
      <div v-if="influenceFactor.post_sum" class="col-lg-6 col-md-6 col-sm-12">
        <!-- Influence Factor -->
        <div class="card shadow text-bg-dark">
          <div class="card-header text-bg-dark fw-bold text-center">Influence Factor</div>
          <div class="card-body p-1">
            <table class="table  table-hover table-dark">
              <tbody>
                <template v-for="(key) in Object.keys(influenceFactor)" :key="key">
                  <tr v-if="influenceFactor[key] != null">
                    <th class="col-4 text-end">{{ key }}</th>
                    <td class="text-start">{{ influenceFactor[key] }}</td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div :class="influenceFactor.post_sum ? 'col-lg-6 col-md-6 col-sm-12' : 'col-12'">
        <!-- Regression Results -->
        <div v-if="regressionResults.length > 0" class="card shadow text-bg-dark">
          <div class="card-header text-bg-dark fw-bold text-center">Regression Analysis</div>
          <div class="card-body p-1">
            <table class="table table-hover table-dark">
              <thead>
                <tr>
                  <th class="col-5">Model</th>
                  <th>Value</th>
                  <th>P-Value</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(result, i) in regressionResults" :key="i">
                  <td>{{ result.model }}</td>
                  <td>{{ result.value }}</td>
                  <td>{{ result.p_value }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts -->
    <div class="row g-4  mb-4">
      <div class="col-lg-6 col-md-12 col-sm-12">
        <div class="card shadow text-bg-dark">
          <div class="card-header text-bg-dark fw-bold text-center">Sector Distribution</div>
          <div class="card-body">
            <div ref="chartRef" class="chart"></div>
          </div>
        </div>
      </div>
      <div class="col-lg-6 col-md-12 col-sm-12">
        <div class="card shadow text-bg-dark">
          <div class="card-header text-bg-dark fw-bold text-center">Performance Over Time</div>
          <div class="card-body">
            <div ref="returnRef" class="chart"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Posts -->
     <PostsView />

  </main>
</template>



<!-- <template>
  <main>
    <h3>{{ route.params.analyst }}</h3>
    <div v-if="performanceResult">
      <table class="table table-bordered">
        <tbody>
          <template v-for="(key) in Object.keys(performanceResult)" :key="key">
          <tr v-if="performanceResult[key]">
            <th scope="col" class="col-4">
              {{ key }}
            </th>
            <td>
              {{ performanceResult[key] }}
            </td>
          </tr>
          </template>
        </tbody>
      </table>
    </div>

    <div v-if="regressionResults.length > 0">
      <table class="table table-bordered">
        <thead>
          <tr>
            <th scope="col" class="col-4"></th>
            <th scope="col">value</th>
            <th scope="col">p-value</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(result, i) in regressionResults" :key="i">
            <td>
              {{ result.model }}
            </td>
            <td>
              {{ result.value }}
            </td>
            <td>
              {{ result.p_value }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div ref="chartRef" class="chart"></div>
    <div ref="returnRef" class="chart"></div>
  </main>
</template> -->

<!-- <style>
.chart {
  position: relative;
  height: 450px;
  overflow: hidden;
}
</style> -->

<style scoped>
.chart {
  position: relative;
  height: 450px;
  overflow: hidden;
}

.card {
  border-radius: 0.5rem;
}

.table {
  border-radius: 0.5rem;
}

.card-header {
  font-size: 1.1rem;
  background-color: white;
  border-bottom: 1px solid currentcolor;
}

.table th,
.table td {
  vertical-align: middle;
}
</style>
