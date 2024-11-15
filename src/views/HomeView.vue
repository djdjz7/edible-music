<script setup lang="ts">
import { ref } from 'vue';
import { type ListEntry } from '@/models/list-entry';
import data from 'virtual:music-list.json' with { type: 'json'}

const entries = ref<ListEntry[]>(data);
</script>

<template>
  <main w-screen flex="~ col items-center" p-x-8 md:p-x-16 lg:p-x-32 p-t-40 box-border>
    <h1 font-semibold>吃人协会的音乐推荐</h1>
    <span tracking-widest font-semibold text-gray-500>EDITBLE MUSIC</span>
    <div grid="~ cols-1 gap-y-4 md:cols-2 lg:cols-3" self-stretch m-t-12>
      <a v-for="entry in entries" :key="entry.vol" flex="~ items-center" :href="entry.href" relative decoration-none
        class="group">
        <div relative w-24 h-25>
          <img absolute top-1 blur-md group-hover:blur-xl h-24 w-24 transition-filter duration-200 :src="entry.cover">
          <img absolute h-24 w-24 :src="entry.cover">
        </div>
        <div m-l-8 flex="~ col" text-black>
          <span text-xs font-semibold text-gray-500 tracking-wide>{{ entry.vol }} · {{ entry.date }}</span>
          <span text-xl font-semibold>{{ entry.title }}</span>
          <span>{{ entry.album }}</span>
          <span>{{ entry.artist }}</span>
        </div>
      </a>
    </div>
  </main>
</template>
