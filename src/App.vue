<template>
  <!-- 动态背景：通过 class 控制黑白模式 -->
  <div :class="isDark ? 'dark' : ''">
    <!-- 神经网络背景 Canvas -->
    <NeuralBackground :isDark="isDark" />
    
    <div class="min-h-screen transition-colors duration-500 bg-gray-50/30 text-slate-900 dark:bg-ai-dark/30 dark:text-white selection:bg-ai-primary selection:text-white overflow-hidden relative">
      
      <!-- 烟花组件 (z-index 最高) -->
      <MouseFireworks />

      <!-- 路由视图：根据 URL 显示 Home 或 Tech -->
      <router-view v-slot="{ Component }">
        <!-- 使用 transition 添加页面切换动画 (可选) -->
        <transition name="fade" mode="out-in">
          <component 
            :is="Component" 
            :isDark="isDark" 
            @toggle-theme="toggleTheme" 
          />
        </transition>
      </router-view>
      
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import MouseFireworks from './components/MouseFireworks.vue';
import NeuralBackground from './components/NeuralBackground.vue';

const isDark = ref(false);

const toggleTheme = () => {
  isDark.value = !isDark.value;
  // Tailwind dark mode class handling
  if (isDark.value) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

onMounted(() => {
  // 初始化为 bright mode，确保移除 dark class
  document.documentElement.classList.remove('dark');
});
</script>

<style>
/* 全局字体优化 */
body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* 简单的淡入淡出路由动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
