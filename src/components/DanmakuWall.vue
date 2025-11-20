<template>
  <div class="fixed inset-0 pointer-events-none z-20 overflow-hidden">
    <!-- 
      Static Danmaku Container 
      Use absolute positioning for items.
      pointer-events-auto on items to allow clicking.
    -->
    <div 
      v-for="(item, index) in danmakuItems" 
      :key="index"
      class="absolute cursor-pointer transition-all duration-300 hover:scale-125 hover:z-50 pointer-events-auto font-bold select-none animate-float"
      :style="getItemStyle(item)"
      @click="scrollToSection(item.targetId)"
    >
      {{ item.text }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const danmakuItems = ref([
  { text: '📄 我的简历', targetId: 'about', size: 2.5, color: '#60A5FA', top: 15, left: 10 },
  { text: '🚀 我的项目', targetId: 'projects', size: 2.2, color: '#A78BFA', top: 25, left: 75 },
  { text: '🎨 我的绘画', targetId: 'painting', size: 1.8, color: '#F472B6', top: 65, left: 15 },
  { text: '✈️ 旅行日记', targetId: 'travel', size: 1.6, color: '#FB923C', top: 45, left: 85 },
  { text: '💻 Github提交', targetId: 'github', size: 2.0, color: '#34D399', top: 80, left: 60 },
  { text: '🤖 AI Research', targetId: 'about', size: 1.4, color: '#F87171', top: 10, left: 80 },
  { text: '📸 Photography', targetId: 'travel', size: 1.2, color: '#FBBF24', top: 55, left: 5 },
  { text: '🛠️ Tech Stack', targetId: 'projects', size: 1.5, color: '#818CF8', top: 35, left: 40 },
]);

// Helper to generate style
const getItemStyle = (item) => {
  return {
    top: `${item.top}%`,
    left: `${item.left}%`,
    fontSize: `${item.size}rem`,
    color: item.color,
    textShadow: '0 2px 4px rgba(0,0,0,0.1)',
    opacity: 0.8
  };
};

// Scroll function
const scrollToSection = (id) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};
</script>

<style scoped>
/* Simple floating animation to make it look "alive" but static in position */
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

/* Stagger animations slightly */
div:nth-child(odd) {
  animation-duration: 7s;
}
div:nth-child(even) {
  animation-duration: 5s;
}
</style>

