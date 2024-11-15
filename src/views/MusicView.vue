<script setup lang="ts">
import { onMounted, ref } from 'vue';
import axios from 'axios';
import { type Music } from '@/models/music';
import { useRoute } from 'vue-router';
import ExternalLink from '@/components/ExternalLink.vue';
import { ChevronDoubleDownIcon } from '@heroicons/vue/24/outline';

const route = useRoute();
const id = route.params.id;
const music = ref<Music>();
const error = ref();
const scrollRef = ref<HTMLDivElement>();
const introRef = ref<HTMLDivElement>();
const lyricsRef = ref<HTMLDivElement>();
const titleSecRef = ref<HTMLDivElement>();
let initialTitleHeight = -1;
onMounted(async () => {
    try {
        const data = (await axios.get<Music>(`/public/data/entries/${id}/index.json`)).data;
        if (data.title == undefined) {
            throw new Error("未能获取歌曲信息");
        }
        music.value = data;
    } catch (e) {
        error.value = e;
    }
})

const handleScroll = (e: Event) => {
    if (initialTitleHeight == -1) {
        initialTitleHeight = titleSecRef.value!.clientHeight;
    }
    const target = e.target as HTMLDivElement;
    if (!target) return;
    const scrollTop = target.scrollTop;
    const introHeight = introRef.value!.clientHeight!
    const introPaddingBottomStr = window.getComputedStyle(introRef.value!).paddingBottom!;
    const introPaddingBottom = Number.parseInt(introPaddingBottomStr.substring(0, introPaddingBottomStr.length - 2));
    let progress = 0;
    if (scrollTop < introHeight - introPaddingBottom) {
        progress = 0;
    } else if (scrollTop > introHeight) {
        progress = 1;
    } else {
        progress = (scrollTop - (introHeight - introPaddingBottom)) / introPaddingBottom;
    }
    const ratio = 1 - progress;
    titleSecRef.value!.style.height = `${ratio * initialTitleHeight}px`;
    titleSecRef.value!.style.opacity = ratio.toString();
}
</script>

<template>
    <div id="bg" v-if="!error" w-screen p-x-32 p-t-24 box-border relative overflow-x-hidden>
        <div z-0 top-0 bottom-0 left-0 right-0 id="bg-img" :style="[`color: ${music?.theme_color}`]">
            <svg absolute class="bottom-20% -right-10%" width="160" height="160" viewBox="0 0 160 160" blur-8em>
                <circle cx="80" cy="80" r="80" fill="currentColor" />
            </svg>
            <svg absolute class="bottom-0 right-90%" width="160" height="160" viewBox="0 0 160 160" blur-8em>
                <circle cx="80" cy="80" r="80" fill="currentColor" />
            </svg>
            <svg absolute class="bottom-30% right-20%" width="160" height="160" viewBox="0 0 160 160" blur-8em>
                <circle cx="80" cy="80" r="80" fill="currentColor" />
            </svg>
        </div>
        <div id="main-grid" h-full relative>
            <div flex="~" text-gray-5 font-semibold tracking-wide>
                <div flex="~ items-center gap-2 grow">
                    <span> 吃人协会的音乐推荐 </span>
                    <span> · </span>
                    <span> {{ music?.vol }} </span>
                </div>
                <span>{{ music?.date }}</span>
            </div>
            <div flex="~ col justify-center" font-bold ref="titleSecRef" box-border transition-all duration-150
                transition-ease-out>
                <span m-t-12 text-4xl>{{ music?.title }}</span>
                <span>{{ music?.album }}</span>
                <span>{{ music?.artist }}</span>
            </div>
            <div id="cover-grid" h-full overflow-auto p-t-16 class="-m-l-24 p-l-24">
                <div h-78 w-76 relative>
                    <img :src="music?.cover" object-cover absolute w-full top-2 blur-xl>
                    <img :src="music?.cover" object-cover absolute w-full rounded-xl>
                </div>
                <div h-full w-full p-l-24 box-border overflow-auto class="scroll-mask" ref="scrollRef"
                    @scroll="handleScroll">
                    <div p-b-64 overflow-auto box-border id="intro" ref="introRef">
                        <p text-wrap whitespace-pre font-semibold text-lg :style="`color: ${music?.text_theme_color}`">
                            {{ music?.intro }}</p>
                    </div>
                    <div p-t-4 p-b-32 :style="`color: ${music?.text_theme_color}`" font-semibold text-3xl
                        flex="~ col gap-2" ref="lyricsRef">
                        <span text-wrap whitespace-pre v-for="line in music?.lyrics" :key="line">{{ line }}</span>
                        <ChevronDoubleDownIcon class="h-6 m-t-4" />
                    </div>
                </div>
            </div>
        </div>
        <div flex="~ items-center gap-24" p-b-32 m-t-24>
            <a :href="music?.apple_music_link"><img w-52 src="/apple-music-badge.svg" target="blank"></a>
            <div flex="~ col gap-2">
                <ExternalLink content="QQ 音乐" :href="music?.qq_music_link" />
                <ExternalLink content="网易云音乐" :href="music?.netease_music_link" />
            </div>
            <span>亦可在
                <ExternalLink content="微信公众号" :href="music?.wechat_link" /> 平台找到本文
            </span>
        </div>
    </div>
    <div v-else flex="~ items-center justify-center">
        <span>{{ error }}</span>
    </div>
</template>

<style scoped>
#main-grid {
    display: grid;
    grid-template-rows: auto auto 1fr;
}

#cover-grid {
    display: grid;
    grid-template-columns: 19rem 1fr;
    height: calc(100% - 4rem);
}

.scroll-mask {
    mask: linear-gradient(180deg, transparent, black 5%, black 95%, transparent);
}
</style>