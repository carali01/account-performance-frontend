<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router';
import { fetchData } from '@/composables/fetchData'

const route = useRoute()
// const router = useRouter()

interface ObjData {
    [key: string]: string | number | null;
}

interface DetailResponse {
    posts: ObjData
}

const post = ref<ObjData>({})
const platform = route.params.platform

onMounted(async () => {
    const response = await fetchData<DetailResponse>(`/api/post/${route.params.id}/${platform}/${encodeURIComponent(route.params.analyst as string)}`)
    if (response) {
        post.value = response.posts
    }
})
</script>

<template>
    <div class="container py-3">
        <template v-if="platform == '微信'">
            <h2 class="text-center text-light fw-bold">{{ post.title }}</h2>
            <h4 class="text-center">{{ route.params.analyst }}</h4>
            <div class="card-body px-5 py-4 text-bg-dark">
                <div class="text-white" v-html="post.content"></div>
            </div>
        </template>

        <template v-if="platform == '抖音'">
            <h2 class="text-center text-light fw-bold">{{ post.desc }}</h2>
            <h4 class="text-center">{{ route.params.analyst }}</h4>
            <h5 class="text-center"><a v-if="post.url" :href="String(post.url)" target="_blank">前往观看视频</a></h5>
            <p class="text-center">发布于 {{ post.create_time }}</p>
            <div class="card-body px-5 py-4 text-bg-dark">
                <div class="text-white" v-html="post.content"></div>
            </div>
        </template>

        <template v-if="platform == '雪球'">
            <h2 class="text-center text-light fw-bold">{{ post.title }}</h2>
            <h4 class="text-center">{{ route.params.analyst }}</h4>
            <p class="text-center">发布于 {{ post.created_at }}</p>
            <div class="card-body px-5 py-4 text-bg-dark">
                <div class="text-white" v-html="post.text"></div>
            </div>
        </template>
    </div>
</template>

<style scoped>
/* Deep selector to target v-html content */
:deep(img) {
    max-width: 100%;
    height: auto;
    display: block;
    margin: 0 auto;
}

:deep(a) {
    color: rgb(86, 153, 255)
}

.card {
    background-color: black !important;
}

.card-header {
    font-size: 1.1rem;
    background-color: white;
    border-bottom: 1px solid white;
}

.card-body {
    border-radius: 0.5rem;
}
</style>