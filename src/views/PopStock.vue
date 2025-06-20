<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { fetchData } from '@/composables/fetchData'
import TopStocksChart from '@/components/charts/TopStocksChart.vue'

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

const sortOrder = ref<'asc' | 'desc'>('desc');
const toggleSort = () => {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
}

const sortedResult = computed(() => {
    return [...stockRanking.value].sort((a, b) => {
        return sortOrder.value === 'asc'
            ? a.popularity_score - b.popularity_score
            : b.popularity_score - a.popularity_score;
    });
});

onMounted(async () => {
    const response = await fetchData<Response>('/api/pop-stock')
    if (response) {
        stockRanking.value = response.result
    }
})
</script>

<template>
    <div class="container d-flex justify-content-center min-vh-100 mt-3">
        <div class="w-100" style="max-width: 1000px;">
            <TopStocksChart/>
            <table class="table table-striped  table-hover text-center shadow table-dark">
                <thead class="table-dark">
                    <tr>
                        <th>股票热度排名</th>
                        <th>股票代码</th>
                        <th>股票名称</th>
                        <th>行业</th>
                        <th class="sortedCol" @click="toggleSort" style="cursor: pointer">热度得分
                            <span v-if="sortOrder === 'desc'">▼</span>
                            <span v-else>▲</span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="stock in sortedResult" :key="stock.stock_symbol">
                        <td>{{ stock.popularity_ranking }}</td>
                        <td>{{ stock.stock_symbol }}</td>
                        <td>{{ stock.stock_name }}</td>
                        <td>{{ stock.sector }}</td>
                        <td>{{ stock.popularity_score }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<style scoped>
th {
    user-select: none;
}

.table {
    border-radius: 0.5rem;
    overflow: hidden;
}

table .sortCol:hover {
  border-bottom: 1px solid currentcolor;
}

table .sortedCol {
  border-bottom: 1px solid currentcolor;
}
</style>
