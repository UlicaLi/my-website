<template>
  <!-- 动态背景：通过 class 控制黑白模式 -->
  <div>
    <!-- 神经网络背景 Canvas -->
    <NeuralBackground />
    
    <div class="min-h-screen transition-colors duration-500 bg-gray-50/30 text-slate-900 dark:bg-ai-dark/30 dark:text-white selection:bg-ai-primary selection:text-white overflow-hidden relative">
      
      <!-- 烟花组件 (z-index 最高) -->
      <MouseFireworks />

      <!-- 路由视图：根据 URL 显示 Home 或 Tech -->
      <router-view v-slot="{ Component }">
        <!-- 使用 transition 添加页面切换动画 (可选) -->
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
      
    </div>
  </div>
</template>

<script setup lang="ts">
import MouseFireworks from './components/MouseFireworks.vue';
import NeuralBackground from './components/NeuralBackground.vue';
// useDark is automatically managing the 'dark' class on the html element, 
// so we don't need to manually manage it here.
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