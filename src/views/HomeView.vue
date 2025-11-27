<template>
  <div>
    <!-- 导航栏 -->
    <nav class="absolute top-0 w-full p-4 flex justify-between items-center z-40 backdrop-blur-md bg-white/30 dark:bg-slate-900/30 border-b border-gray-300/20 dark:border-white/5">
      <div class="text-[clamp(1.25rem,2.5vw,2rem)] font-bold font-mono tracking-tighter">
        <span class="text-ai-primary">&lt;</span>Welcome<span class="text-ai-primary">/&gt;</span>
      </div>
      <button 
        @click="toggleTheme()"
        class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition-all transform hover:rotate-12"
      >
        <!-- 简单的 SVG 图标切换 -->
        <span v-if="isDark">🌞</span>
        <span v-else>🌙</span>
      </button>
    </nav>

    <!-- 主要内容区 -->
    <main class="container mx-auto px-6 pt-32 relative z-10">
      
      <!-- Hero Section -->
      <div id="about" class="flex flex-col items-center text-center space-y-8 mb-20 scroll-mt-32">
        <div class="inline-block px-4 py-1 rounded-full border border-ai-primary/30 bg-ai-primary/10 text-ai-primary text-[clamp(0.75rem,1.2vw,1rem)] font-mono animate-pulse-fast">
          Current State: Researching Transformer Models
        </div>
        
        <p class="text-[clamp(1.125rem,2vw,1.5rem)] text-slate-600 dark:text-slate-400 max-w-2xl">
          我是 <span class="font-bold text-slate-900 dark:text-white">Ulica</span>，一名专注于Egocentric的研究生。
          我用代码构建逻辑，用数据描绘未来。
        </p>

        <div class="flex gap-4">
          <button class="px-8 py-3 rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold hover:scale-105 transition-transform text-[clamp(0.9rem,1.5vw,1.1rem)]">
            查看论文
          </button>
          <button class="px-8 py-3 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-[clamp(0.9rem,1.5vw,1.1rem)]">
            联系我
          </button>
        </div>

        <!-- 弹幕墙组件 -->
        <TagCloud />
      </div>

      <!-- Tech Stack (Glass Cards) -->
      <div id="projects" class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20 scroll-mt-32">
        <div class="p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20 backdrop-blur-sm hover:border-purple-500/50 transition-colors">
          <h3 class="text-[clamp(1.25rem,2.5vw,2rem)] font-bold mb-2 text-purple-600 dark:text-purple-400">PyTorch Master</h3>
          <p class="text-[clamp(0.75rem,1.2vw,1rem)] opacity-70">深度学习框架架构设计与模型复现。</p>
        </div>
        <div class="p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 backdrop-blur-sm hover:border-blue-500/50 transition-colors">
          <h3 class="text-[clamp(1.25rem,2.5vw,2rem)] font-bold mb-2 text-blue-600 dark:text-blue-400">Computer Vision</h3>
          <p class="text-[clamp(0.75rem,1.2vw,1rem)] opacity-70">YOLO, ViT, GANs 图像生成与识别。</p>
        </div>
        <div class="p-6 rounded-2xl bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/20 backdrop-blur-sm hover:border-green-500/50 transition-colors">
          <h3 class="text-[clamp(1.25rem,2.5vw,2rem)] font-bold mb-2 text-green-600 dark:text-green-400">NLP / LLM</h3>
          <p class="text-[clamp(0.75rem,1.2vw,1rem)] opacity-70">Prompt Engineering, LangChain, RAG。</p>
        </div>
      </div>

      <!-- Github Activity Section -->
      <div id="github" class="mb-20 scroll-mt-32">
        <h2 class="text-[clamp(1.5rem,3vw,2.5rem)] font-bold mb-6 flex items-center gap-2">
          <span class="w-2 h-8 bg-ai-accent rounded-full"></span>
          Code Frequency
        </h2>
        <GithubGraph username="UlicaLi" />
      </div>

      <!-- 绘画与旅行 (Placeholder) -->
      <div id="hobbies" class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20 scroll-mt-32">
         <div id="painting" class="p-6 rounded-2xl border border-pink-500/20 bg-pink-500/5 backdrop-blur-sm min-h-[200px] flex items-center justify-center hover:scale-[1.02] transition-transform cursor-pointer">
           <h3 class="text-[clamp(1.25rem,2.5vw,2rem)] font-bold text-pink-500">🎨 我的绘画</h3>
         </div>
         <div id="travel" class="p-6 rounded-2xl border border-orange-500/20 bg-orange-500/5 backdrop-blur-sm min-h-[200px] flex items-center justify-center hover:scale-[1.02] transition-transform cursor-pointer">
           <h3 class="text-[clamp(1.25rem,2.5vw,2rem)] font-bold text-orange-500">✈️ 旅行日记</h3>
         </div>
      </div>

      <div id="tech" class="mb-20 scroll-mt-32">
        <h2 class="text-[clamp(1.5rem,3vw,2.5rem)] font-bold mb-6 flex items-center gap-2">
          <span class="w-2 h-8 bg-ai-accent rounded-full"></span>
          Tech Stack
        </h2>
        <div class="flex justify-center">
           <router-link 
              to="/tech" 
              class="px-8 py-4 rounded-xl bg-gradient-to-r from-ai-primary/80 to-ai-accent/80 text-white font-bold text-lg hover:scale-105 hover:shadow-lg hover:shadow-ai-primary/20 transition-all duration-300 flex items-center gap-2 backdrop-blur-sm"
           >
              <span>📚 进入知识库</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
           </router-link>
        </div>
      </div>

    </main>

    <!-- Footer -->
    <footer class="py-8 text-center text-slate-400 text-[clamp(0.75rem,1vw,0.875rem)] font-mono border-t border-slate-200 dark:border-slate-800">
      &copy; {{ new Date().getFullYear() }} Designed by AI Graduate. Powered by Vue 3.
    </footer>
  </div>
</template>

<script setup lang="ts">
import GithubGraph from '../components/GithubGraph.vue';
import TagCloud from '../components/TagCloud.vue';
import { useDark, useToggle } from '@vueuse/core';

const isDark = useDark();
const toggleTheme = useToggle(isDark);
</script>