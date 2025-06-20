<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { fetchData } from '@/composables/fetchData'
import TopSectorsChart from '@/components/charts/TopSectorsChart.vue'

interface SectorRanking {
  sector: string;
  total_popularity: number;
  stock_count: number;
}

interface Response {
  result: SectorRanking[]
}

const sectorRanking = ref<SectorRanking[]>([])


const sortKey = ref<'total_popularity' | 'stock_count'>('total_popularity')
const sortOrder = ref<'asc' | 'desc'>('desc')


const toggleSort = (key: 'total_popularity' | 'stock_count') => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'desc'
  }
}

const sortedSectorRanking = computed(() => {
  return [...sectorRanking.value].sort((a, b) => {
    const key = sortKey.value
    return sortOrder.value === 'asc'
      ? a[key] - b[key]
      : b[key] - a[key]
  })
})


onMounted(async () => {
  const response = await fetchData<Response>('/api/pop-sector')
  if (response) {
    sectorRanking.value = response.result
  }
})
</script>

<template>
  <div class="container d-flex justify-content-center min-vh-100 mt-3">
    <div class="w-100" style="max-width: 1000px;">
      <TopSectorsChart />
      <table class="table table-striped table-hover text-center shadow table-dark">
        <thead class="table-dark">
          <tr>
            <th>行业</th>
            <th :class="sortKey === 'total_popularity' ? 'sortedCol' : 'sortCol'"
              @click="toggleSort('total_popularity')" style="cursor: pointer">
              总热度
              <span v-if="sortKey === 'total_popularity'">
                {{ sortOrder === 'desc' ? '▼' : '▲' }}
              </span>
              <span v-else>◇</span>
            </th>
            <th :class="sortKey === 'stock_count' ? 'sortedCol' : 'sortCol'" @click="toggleSort('stock_count')"
              style="cursor: pointer">
              股票数量
              <span v-if="sortKey === 'stock_count'">
                {{ sortOrder === 'desc' ? '▼' : '▲' }}
              </span>
              <span v-else>◇</span>
            </th>

          </tr>
        </thead>
        <tbody>
          <tr v-for="sector in sortedSectorRanking" :key="sector.sector">
            <td>{{ sector.sector }}</td>
            <td>{{ sector.total_popularity }}</td>
            <td>{{ sector.stock_count }}</td>
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
