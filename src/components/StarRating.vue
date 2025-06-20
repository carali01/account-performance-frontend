<template>
    <div>
        <span v-for="n in starCount" :key="n" class="text-warning">★</span>
        <span v-for="n in 5 - starCount" :key="'empty-' + n" class="text-light">☆</span>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ rank: string }>()

const starCount = computed(() => {
    if (!props.rank) return 0
    const match = props.rank.match(/(\d)/)
    return match ? parseInt(match[1]) : 0
})
</script>

<style scoped>
span {
    /* font-size: 1.2rem; */
    margin-right: 2px;
}
</style>
