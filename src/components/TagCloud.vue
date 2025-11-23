<template>
  <div class="relative w-full h-[300px] pointer-events-none z-20 overflow-hidden mb-8">
    <div 
      v-for="(item, index) in danmakuItems" 
      :key="index"
      class="absolute cursor-pointer hover:z-50 pointer-events-auto select-none animate-float pause-on-hover group"
      :style="getItemStyle(item)"
      @click="scrollToSection(item.targetId)"
    >
      <span class="block transition-transform duration-300 group-hover:scale-125">
        {{ item.text }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

// ==========================================
// 1. PC 端数据配置 (屏幕 >= 768px)
// 布局逻辑：3行 x 4列 = 12个格子
// ==========================================
const pcItems = [
  // --- Row 0 ---
  { text: '我的简历', targetId: 'about', size: 1.2, color: '#d29774', top: 10, left: 20, weight: 'normal' }, // Col 0
  { text: 'Github Commits', targetId: 'projects', size: 1.8, color: '#239b70', top: 40, left: 10, weight: '800' }, // Col 1
  { text: '我的绘画', targetId: 'painting', size: 1.2, color: '#F472B6', top: 15, left: 50, weight: '600' }, // Col 2
  { text: '旅行日记', targetId: 'travel', size: 1.0, color: '#FB923C', top: 50, right: 10, weight: 'normal' }, // Col 3 (靠右)

  // --- Row 1 ---
  { text: 'Github提交', targetId: 'github', size: 1.0, color: '#babec7', top: 30, left: 50, weight: '300' }, // Col 0
  { text: '我的简历', targetId: 'projects', size: 2.8, color: '#0e172a', top: 10, left: 50, weight: '900' }, // Col 1
  { text: '我的项目', targetId: 'painting', size: 2.0, color: '#5850e6', top: 40, left: 30, weight: 'bold' }, // Col 2
  { text: 'Tech Stack', targetId: 'about', size: 1.5, color: '#A78BFA', top: 20, right: 30, weight: '500' }, // Col 3 (靠右)

  // --- Row 2 ---
  { text: '我的论文', targetId: 'projects', size: 1.2, color: '#7993e7', top: 20, left: 25, weight: 'normal' }, // Col 0
  { text: '联系我', targetId: 'about', size: 1.4, color: '#60A5FA', top: 30, left: 10, weight: 'normal' }, // Col 1
  { text: '占位符', targetId: 'projects', size: 1.3, color: '#fb8844', top: 50, left: 30, weight: 'normal' }, // Col 2
  { text: '嘿嘿嘿', targetId: 'projects', size: 1.0, color: '#727984', top: 50, right: 15, weight: '300' }, // Col 3 (靠右)
];

// ==========================================
// 2. 移动端数据配置 (屏幕 < 768px)
// 布局逻辑：4行 x 3列 = 12个格子
// 提示：移动端屏幕窄，size 建议稍微调小，left/right 不要太大防止溢出
// ==========================================
const mobileItems = [
  // --- Row 0 ---
  { text: '我的简历', targetId: 'about', size: 2.0, color: '#60A5FA', top: 40, left: 30, weight: 'bold' }, // Col 0
  { text: '我的项目', targetId: 'projects', size: 4.0, color: '#A78BFA', top: 45, left: 5, weight: '600' },  // Col 1
  { text: '我的绘画', targetId: 'painting', size: 2.4, color: '#F472B6', top: 30, right: 45, weight: '500' }, // Col 2 (靠右)

  // --- Row 1 ---
  { text: '旅行日记', targetId: 'travel', size: 2.0, color: '#FB923C', top: 10, left: 15, weight: 'normal' }, // Col 0
  { text: '我的简历', targetId: 'github', size: 5.0, color: '#0e172a', top: 30, left: 10, weight: 'bold' },   // Col 1
  { text: 'AI Research', targetId: 'projects', size: 2.6, color: '#F87171', top: 15, right: 10, weight: 'bold' }, // Col 2

  // --- Row 2 ---
  { text: 'Photo', targetId: 'painting', size: 2.4, color: '#FBBF24', top: 20, left: 10, weight: '600' },   // Col 0
  { text: 'Tech Stack', targetId: 'about', size: 4.0, color: '#239b70', top: 30, left: 5, weight: '500' },   // Col 1
  { text: '我的论文', targetId: 'projects', size: 2.4, color: '#818CF8', top: 25, right: 15, weight: 'bold' }, // Col 2

  // --- Row 3 ---
  { text: '联系我', targetId: 'about', size: 2.2, color: '#60A5FA', top: 10, left: 20, weight: 'normal' },     // Col 0
  { text: '占位符', targetId: 'projects', size: 2.1, color: '#818CF8', top: 40, left: 15, weight: '300' },   // Col 1
  { text: '嘿嘿嘿', targetId: 'projects', size: 2.0, color: '#FB923C', top: 20, right: 45, weight: 'normal' },   // Col 2
];

const danmakuItems = ref([]);

onMounted(() => {
  initDanmaku();
  window.addEventListener('resize', initDanmaku);
});

onUnmounted(() => {
  window.removeEventListener('resize', initDanmaku);
});

const initDanmaku = () => {
  const isMobile = window.innerWidth < 768;
  
  // 1. 根据屏幕宽度选择 对应的数据源 和 网格布局
  const currentConfig = isMobile ? mobileItems : pcItems;
  const rows = isMobile ? 4 : 3;
  const cols = isMobile ? 3 : 4;
  
  const cellWidthPercent = 100 / cols;
  const cellHeightPercent = 100 / rows;
  
  danmakuItems.value = currentConfig.map((item, index) => {
    // 安全索引（防止数据多于格子，虽然这里我们固定写死了12个）
    const safeIndex = index % (rows * cols);
    
    // 计算当前项所在的网格行列
    const row = Math.floor(safeIndex / cols);
    const col = safeIndex % cols;
    
    // 计算绝对 Top (%)
    const finalTop = (row * cellHeightPercent) + (item.top * cellHeightPercent / 100);
    
    let finalLeft, finalRight;

    // 计算绝对 Left 或 Right (%)
    if (item.right !== undefined) {
      // Right 模式：计算从容器右侧到当前格子右侧的距离 + 格子内偏移
      const cellsOnRight = cols - 1 - col;
      finalRight = (cellsOnRight * cellWidthPercent) + (item.right * cellWidthPercent / 100);
    } else {
      // Left 模式：计算从容器左侧到当前格子左侧的距离 + 格子内偏移
      const cellsOnLeft = col;
      const innerLeft = item.left || 0;
      finalLeft = (cellsOnLeft * cellWidthPercent) + (innerLeft * cellWidthPercent / 100);
    }

    return {
      ...item,
      calcTop: finalTop,
      calcLeft: finalLeft,
      calcRight: finalRight
    };
  });
};

const getItemStyle = (item) => {
  return {
    top: `${item.calcTop}%`,
    left: item.calcRight !== undefined ? 'auto' : `${item.calcLeft}%`,
    right: item.calcRight !== undefined ? `${item.calcRight}%` : 'auto',
    
    // 字体大小 clamp: 
    // 最小 12px (防止移动端看不清)
    // 响应式部分 item.size * 1.5vw 
    // 最大值限制
    fontSize: `clamp(12px, ${item.size * 1.2}vw, ${item.size * 2}rem)`,
    
    fontWeight: item.weight || 'normal', // 支持自定义粗细
    color: item.color,
    textShadow: '0 2px 4px rgba(0,0,0,0.05)', // 稍微淡一点的阴影更现代
    opacity: 0.9,
    whiteSpace: 'nowrap'
  };
};

const scrollToSection = (id) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};
</script>

<style scoped>
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.pause-on-hover:hover {
  animation-play-state: paused;
}

/* 让动画显得不那么整齐划一 */
div:nth-child(3n+1) { animation-duration: 6s; animation-delay: 0s; }
div:nth-child(3n+2) { animation-duration: 8s; animation-delay: -1s; }
div:nth-child(3n+0) { animation-duration: 7s; animation-delay: -2s; }
</style>