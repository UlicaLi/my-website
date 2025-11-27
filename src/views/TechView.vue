<template>
  <div>
    <!-- Tech View 顶部导航 -->
    <nav class="absolute top-0 w-full p-4 flex justify-between items-center z-40 backdrop-blur-md bg-white/30 dark:bg-slate-900/30 border-b border-gray-300/20 dark:border-white/5">
      <div class="flex items-center gap-4">
        <router-link to="/" class="flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-ai-primary transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            <span class="font-mono font-bold">Back</span>
        </router-link>
        <div class="w-px h-6 bg-slate-300 dark:bg-slate-700"></div>
        <div class="text-lg font-bold font-mono tracking-tighter">
          <span class="text-ai-primary">#</span>Tech<span class="text-ai-primary">Stack</span>
        </div>
      </div>
      
      <button 
        @click="$emit('toggle-theme')"
        class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition-all transform hover:rotate-12"
      >
        <span v-if="isDark">🌞</span>
        <span v-else>🌙</span>
      </button>
    </nav>

    <main class="container mx-auto px-4 pt-24 pb-10 relative z-10">
       <TechStack />
    </main>
  </div>
</template>

<script setup>
import TechStack from '../components/TechStack.vue';

defineProps({
  isDark: Boolean
});
</script>
