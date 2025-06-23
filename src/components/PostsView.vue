<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import { fetchData } from '@/composables/fetchData'

const route = useRoute()
const router = useRouter()

interface ObjData {
    [key: string]: string | number | null;
}

const posts = ref<ObjData[]>([])
const platform = ref<'' | '微信' | '雪球' | '抖音'>('')


interface DetailResponse {
    posts: ObjData[]
    platform: '' | '微信' | '雪球' | '抖音'
}

const goToContent = (analyst: ObjData) => {
    router.push(`/post/${analyst._id}/${platform.value}/${encodeURIComponent(route.params.analyst as string)}`)
}

onMounted(async () => {
    const response = await fetchData<DetailResponse>('/api/posts/' + encodeURIComponent(route.params.analyst as string))
    if (response) {
        posts.value = response.posts
        platform.value = response.platform
    }
})
</script>

<template>
    <div class="posts">
        <div v-if="posts.length > 0" class="card shadow text-bg-dark">
            <div class="card-header text-bg-dark fw-bold text-center">Latest 10 Posts</div>
            <div class="card-body">

                <template v-if="platform == '微信'">
                    <div class="row gx-4">
                        <div class="col-lg-4 col-md-12 d-flex mt-2" v-for="(post, i) in posts" :key="i">
                            <div class="card mb-3 flex-fill d-flex flex-column">
                                <div class="card-header text-bg-dark fw-bold">
                                    <img src="/src/assets/blog2.png" alt="blog Logo" class="img-fluid ms-1 mb-2"
                                        style="max-height: 70px; ">
                                    {{ post.title }}
                                </div>
                                <div class="card-body text-bg-dark">
                                    <p>
                                        <span class="card-text" v-html="post.content">
                                        </span>
                                        <span> ...<a @click="goToContent(post)">查看更多</a></span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                </template>


                <template v-else-if="platform == '抖音'">

                    <div class="row gx-4">

                        <div class="col-lg-4 col-md-12 d-flex mt-2" v-for="(post, i) in posts" :key="i">
                            <div class="card mb-2 flex-fill d-flex flex-column">
                                <div class="card-header text-bg-dark fw-bold">
                                    <img src="/src/assets/blog2.png" alt="blog Logo" class="img-fluid ms-1 mb-2"
                                        style="max-height: 70px; ">
                                        {{ post.desc }}
                                </div>
                                <div class="card-body text-bg-dark">
                                    <p>
                                        <span class="card-text" v-html="post.content">
                                        </span>
                                        <span>...<a @click="goToContent(post)">查看更多</a></span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>

                <template v-else-if="platform == '雪球'">

                    <div class="row gx-4">
                        <div class="col-lg-4 col-md-12 d-flex mt-2" v-for="(post, i) in posts" :key="i">
                            <div class="card mb-2 flex-fill d-flex flex-column">
                                <div class="card-header text-bg-dark fw-bold">
                                    <img src="/src/assets/blog2.png" alt="blog Logo" class="img-fluid ms-1 mb-2"
                                        style="max-height: 70px; ">
                                        {{ post.title }}
                                </div>
                                <div class="card-body text-bg-dark">
                                    <p>
                                        <span class="card-text" v-html="post.description">
                                        </span>
                                        <span><a @click="goToContent(post)"> 查看更多</a></span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </div>

        </div>
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

a {
    color: rgb(115, 171, 255) !important;
    user-select: none;
    cursor: pointer
}

.card {
    background-color: black !important;
}

.card-header {
    font-size: 1.6rem;
    background-color: white;
    /* border-bottom: 1px solid white; */
}

/* Accordion button when expanded */
.accordion-button:not(.collapsed) {
    background-color: #2a2a2a !important;
    color: #ffffff !important;
    box-shadow: none;
}

/* Hover and focus states */
.accordion-button:hover,
.accordion-button:focus {
    background-color: #333333 !important;
    color: #ffffff !important;
    box-shadow: none;
    outline: none;
}

/* Makes the icon white */
.accordion-button::after {
    filter: brightness(0) invert(1);
}
</style>
