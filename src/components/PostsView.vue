<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router';
import { fetchData } from '@/composables/fetchData'

const route = useRoute()


interface ObjData {
    [key: string]: string | number | null;
}

const posts = ref<ObjData[]>([])
const platform = ref<'' | '微信' | '雪球' | '抖音'>('')


interface DetailResponse {
    posts: ObjData[]
    platform: '' | '微信' | '雪球' | '抖音'
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
        <div v-if="posts.length>0" class="card shadow text-bg-dark">
            <div class="card-header text-bg-dark fw-bold text-center">Latest 10 Posts</div>
            <div class="card-body">

                <template v-if="platform == '微信'">
                    <div class="accordion accordion-flush" id="postsAccordion">
                        <div class="accordion-item bg-dark text-white" v-for="(post, i) in posts" :key="i">
                            <h2 class="accordion-header" :id="`heading-${i}`">
                                <button class="accordion-button collapsed bg-dark text-white" type="button"
                                    data-bs-toggle="collapse" :data-bs-target="`#collapse-${i}`" aria-expanded="false"
                                    :aria-controls="`collapse-${i}`">
                                    {{ post.title }}
                                </button>
                            </h2>
                            <div :id="`collapse-${i}`" class="accordion-collapse collapse"
                                :aria-labelledby="`heading-${i}`" data-bs-parent="#postsAccordion">
                                <div class="accordion-body text-white" v-html="post.content">
                                </div>
                            </div>
                        </div>
                    </div>
                </template>


                <template v-else-if="platform == '抖音'">
                    <div class="accordion accordion-flush" id="postsAccordion">
                        <div class="accordion-item bg-dark text-white" v-for="(post, i) in posts" :key="i">
                            <h2 class="accordion-header" :id="`heading-${i}`">
                                <button class="accordion-button collapsed bg-dark text-white" type="button"
                                    data-bs-toggle="collapse" :data-bs-target="`#collapse-${i}`" aria-expanded="false"
                                    :aria-controls="`collapse-${i}`">
                                    {{ post.desc }}
                                </button>
                            </h2>
                            <div :id="`collapse-${i}`" class="accordion-collapse collapse"
                                :aria-labelledby="`heading-${i}`" data-bs-parent="#postsAccordion">
                                <div class="accordion-body text-white">
                                    <p><a v-if="post.url" :href="String(post.url)" target="_blank">前往观看视频</a></p>
                                    <p>发布于 {{ post.create_time }}</p>
                                    <p v-html="post.content"></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>

                <template v-else-if="platform == '雪球'">
                    <div class="accordion accordion-flush" id="postsAccordion">
                        <div class="accordion-item bg-dark text-white" v-for="(post, i) in posts" :key="i">
                            <h2 class="accordion-header" :id="`heading-${i}`">
                                <button class="accordion-button collapsed bg-dark text-white" type="button"
                                    data-bs-toggle="collapse" :data-bs-target="`#collapse-${i}`" aria-expanded="false"
                                    :aria-controls="`collapse-${i}`">
                                    {{ post.title }}
                                </button>
                            </h2>
                            <div :id="`collapse-${i}`" class="accordion-collapse collapse"
                                :aria-labelledby="`heading-${i}`" data-bs-parent="#postsAccordion">
                                <div class="accordion-body text-white">
                                    <p>发布于 {{ post.created_at }}</p>
                                    <p v-html="post.text"></p>
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
:deep(.accordion-body img) {
    max-width: 100%;
    height: auto;
    display: block;
    margin: 0 auto;
}

:deep(.accordion-body a) {
    color: rgb(86, 153, 255)
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
