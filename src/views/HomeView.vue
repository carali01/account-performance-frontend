<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { fetchData } from '@/composables/fetchData'
import StarRating from '@/components/StarRating.vue'

const router = useRouter()

interface AnalystData {
  analyst: string
  score: number
  rank: string
  platform: string
  sector_label: string
  influence_score: number
  influence_rank: number
}

interface Response {
  analystList: string[]
  result: AnalystData[]
}

const list = ref<AnalystData[]>([])

const sortKey = ref<'score' | 'influence_score'>('score')
const sortOrder = ref<'asc' | 'desc'>('desc')

const toggleSort = (key: 'score' | 'influence_score') => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'desc'
  }
}

const sortedList = computed(() => {
  const key = sortKey.value
  return [...list.value].sort((a, b) => {
    if (key == 'influence_score') {
      if (a.platform !== '微信' && b.platform === '微信') return 1
      if (a.platform === '微信' && b.platform !== '微信') return -1
    }

    const valA = a[key]
    const valB = b[key]
    if (valA < valB) return sortOrder.value === 'asc' ? -1 : 1
    if (valA > valB) return sortOrder.value === 'asc' ? 1 : -1
    return 0
  })
})


const goToDetail = (analyst: string) => {
  router.push(`/detail/${encodeURIComponent(analyst)}`)
}

const maxLength = computed(() => {
  return Math.max(...sortedList.value.map(item => String(item.score).length))
})

// const maxLength2 = computed(() => {
//   console.log(...sortedList.value.map(item => String(item.influence_score?.toFixed(2)).length))
//   return Math.max(...sortedList.value.map(item => String(item.influence_score?.toFixed(2)).length))
// })



onMounted(async () => {
  const response = await fetchData<Response>('/api/analyst-list')
  if (response) {
    list.value = response.result
  }
})
</script>

<template>
  <main>

    <div class=" d-flex justify-content-center min-vh-100 mt-3">
      <div class="w-100" style="max-width: 1050px;">
        <h2 class="text-center mb-4">Analyst Rankings</h2>
        <table class="table table-striped table-hover text-center align-middle shadow">
          <thead class="table-dark" style="text-wrap: nowrap;">
            <tr>
              <th>Analyst</th>
              <th :class="sortKey === 'score' ? 'sortedCol' : 'sortCol'" @click="toggleSort('score')"
                style="cursor: pointer">
                Accuracy Score
                <span v-if="sortKey === 'score'">
                  {{ sortOrder === 'desc' ? '▼' : '▲' }}
                </span>
                <span v-else>◇</span>
              </th>
              <th>Accuracy Rank</th>
              <th :class="sortKey === 'influence_score' ? 'sortedCol' : 'sortCol'" @click="toggleSort('influence_score')"
                style="cursor: pointer">
                Influence Score
                <span v-if="sortKey === 'influence_score'">
                  {{ sortOrder === 'desc' ? '▼' : '▲' }}
                </span>
                <span v-else>◇</span>
              </th>
              <th>Influence Rank</th>
              <th>Platform</th>
              <th>Sector Label</th>
            </tr>
          </thead>
          <tbody class="table-dark">
            <tr v-for="(item, index) in sortedList" :key="index" @click="goToDetail(item.analyst)">
              <td>{{ item.analyst }}</td>
              <td class="text-center">
                <div class="d-inline-block text-end" :style="`min-width: ${maxLength}ch;`">
                  {{ item.score }}
                </div>
              </td>
              <td>
                <StarRating :rank="item.rank" />
              </td>
              <td>
                {{ item.influence_score?.toFixed(2) }}
              </td>
              <td>{{ item.influence_score ? item.influence_rank : '' }}</td>
              <td class="text-center align-middle">
                <template v-if="item.platform === '微信'">
                  <img src="/src/assets/wechat-white.png" alt="WeChat Logo" class="img-fluid"
                    style="max-height: 40px; ">
                </template>
                <span v-else-if="item.platform === '抖音'">
                  <img src="/src/assets/douyin-white.png" alt="WeChat Logo" class="img-fluid"
                    style="max-height: 30px; ">
                </span>
                <template v-else-if="item.platform === '雪球'">
                  <img src="/src/assets/xueqiu.png" alt="WeChat Logo" class="img-fluid" style="max-height: 30px; ">
                </template>
              </td>

              <td>{{ item.sector_label }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </main>
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
