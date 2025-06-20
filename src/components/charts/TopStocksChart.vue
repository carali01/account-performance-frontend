<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { fetchData } from '@/composables/fetchData'
import * as echarts from 'echarts/core';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent
} from 'echarts/components';
import { BarChart } from 'echarts/charts';
import { LabelLayout } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  BarChart,
  CanvasRenderer,
  LabelLayout
]);

interface StockRanking {
    popularity_ranking: number;
    stock_symbol: string;
    stock_name: string;
    sector: string;
    popularity_score: number

}

interface Response {
    result: StockRanking[]
}

const stockRanking = ref<StockRanking[]>([])

const chartRef = ref<HTMLDivElement | null>(null)

const drawChart = () => {
    if (chartRef.value) {
        const chart = echarts.init(chartRef.value)

        const option = {
            title: {
                text: 'TOP10 热门股票',
                left: 'center',
                textStyle: {
                    fontSize: 20,
                    color: "rgba(251, 251, 251, 1)"
                },
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'shadow' }
            },
            xAxis: {
                type: 'category',
                data: stockRanking.value.map((item: StockRanking) => item.stock_name),
                axisLabel: {
                    // rotate: 30,
                    fontSize: 13,
                    color: "rgba(251, 251, 251, 1)"
                }
            },
            yAxis: {
                type: 'value',
                name: '热度得分',
                nameTextStyle: {
                    color: "rgba(251, 251, 251, 1)",
                    fontSize: 13,
                },
                axisLabel: {
                    fontSize: 13,
                    color: "rgba(251, 251, 251, 1)"
                },
            },
            series: [
                {
                    name: '得分',
                    type: 'bar',
                    data: stockRanking.value.map((item: StockRanking) => item.popularity_score),
                    label: {
                        show: true,
                    },
                    // itemStyle: {
                    //     color: '#4CAF50'
                    // }
                }
            ]
        }

        chart.setOption(option)
        window.addEventListener('resize', () => chart.resize())
    }
}

onMounted(async () => {
    const response = await fetchData<Response>('/api/top-pop-stock')
    if (response) {
        stockRanking.value = response.result

        drawChart()
    }
})
</script>

<template>
    <!-- <div class="container mt-4"> -->
    <div ref="chartRef" class="chart"></div>
    <!-- </div> -->
</template>


<style scoped>
.chart {
    position: relative;
    width: 100%;
    height: 400px;
    overflow: hidden;
}
</style>
