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

interface SectorRanking {
    sector: string
    total_popularity: number
    stock_count: number
}


interface Response {
    result: SectorRanking[]
}

const sectorRanking = ref<SectorRanking[]>([])

const chartRef = ref<HTMLDivElement | null>(null)

const drawChart = () => {
    if (chartRef.value) {
        const chart = echarts.init(chartRef.value)

        const option = {
            title: {
                text: 'TOP10 热门行业',
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
                data: sectorRanking.value.map((item: SectorRanking) => item.sector),
                axisLabel: {
                    // rotate: 30,
                    fontSize: 13,
                    color: "rgba(251, 251, 251, 1)"
                },
            },
            yAxis: {
                type: 'value',
                name: '总热度',
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
                    name: '热度',
                    type: 'bar',
                    data: sectorRanking.value.map((item: SectorRanking) => item.total_popularity),
                    label: {
                        show: true,
                        // position: 'top'
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
    const response = await fetchData<Response>('/api/top-pop-sector')
    if (response) {
        sectorRanking.value = response.result

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
