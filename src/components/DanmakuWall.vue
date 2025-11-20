<template>
  <div class="relative w-4/5 h-[300px] pointer-events-none z-20 overflow-hidden mb-8">
    <!-- 
      Static Danmaku Container 
      Changed to relative positioning to flow with the page content.
      Fixed height controls the vertical space it occupies.
    -->
    <div 
      v-for="(item, index) in danmakuItems" 
      :key="index"
      class="absolute cursor-pointer hover:z-50 pointer-events-auto font-bold select-none animate-float pause-on-hover group"
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
import { ref, onMounted } from 'vue';

// 原始数据，移除硬编码坐标，保留权重(size)
const rawItems = [
  { text: '📄 我的简历', targetId: 'about', size: 1.5, color: '#60A5FA' },
  { text: '🚀 我的项目', targetId: 'projects', size: 1.5, color: '#A78BFA' },
  { text: '🎨 我的绘画', targetId: 'painting', size: 1.4, color: '#F472B6' },
  { text: '✈️ 旅行日记', targetId: 'travel', size: 1.2, color: '#FB923C' },
  { text: '💻 Github提交', targetId: 'github', size: 1.0, color: '#34D399' },
  { text: '🤖 AI Research', targetId: 'about', size: 1.4, color: '#F87171' },
  { text: '📸 Photography', targetId: 'travel', size: 1.2, color: '#FBBF24' },
  { text: '🛠️ Tech Stack', targetId: 'projects', size: 1.5, color: '#A78BFA' },
  { text: '🛠️ 我的论文', targetId: 'projects', size: 1.5, color: '#818CF8' },
  { text: '🛠️ 联系我', targetId: 'projects', size: 1.5, color: '#60A5FA' },
  { text: '🛠️ 占位符', targetId: 'projects', size: 1.5, color: '#818CF8' },
  { text: '🛠️ 嘿嘿嘿', targetId: 'projects', size: 1.5, color: '#FB923C' },
];

const danmakuItems = ref([]);

onMounted(() => {
  initDanmaku();
  // 监听窗口大小变化，重新计算布局
  window.addEventListener('resize', initDanmaku);
});

const initDanmaku = () => {
  // 简单的网格布局算法，防止重叠
  
  // 响应式布局调整：
  // 移动端/窄屏 (< 768px): 4行3列
  // 桌面端/宽屏 (>= 768px): 3行4列
  const isMobile = window.innerWidth < 768;
  
  const rows = isMobile ? 4 : 3;
  const cols = isMobile ? 3 : 4;
  
  const cellWidth = 100 / cols;
  const cellHeight = 100 / rows;
  
  // 固定顺序，不再随机打乱
  const items = [...rawItems];
  
  danmakuItems.value = items.map((item, index) => {
    // 计算当前项所在的网格行列
    const safeIndex = index % (rows * cols);
    const row = Math.floor(safeIndex / cols);
    const col = safeIndex % cols;
    
    // 在格子内部生成固定偏移量
    // 留出 padding 防止贴边或跨格子重叠太严重
    // 使用固定值代替随机值，但为了视觉不那么死板，可以基于行列做一些规律性的偏移
    
    // 规律：
    // 偶数行偏左上，奇数行偏右下
    // 或者基于 (row + col) 的奇偶性
    const isEven = (row + col) % 2 === 0;
    
    const topOffset = isEven ? 30 : 50; // 30% or 50% of cell height
    const top = row * cellHeight + (topOffset * cellHeight / 100);
    
    let left, right;
    
    // 智能对齐：左半边的元素靠左对齐，右半边的元素靠右对齐
    // 防止右侧文字溢出屏幕
    // 中轴线：cols / 2
    // 3列时中轴线是 1.5 -> col 0,1 是左侧(1靠中), col 2 是右侧
    // 简单判断：col < cols / 2
    
    if (col < cols / 2) {
      // 左侧区域：保持 Left 逻辑
      const leftOffset = isEven ? 20 : 10; // 20% or 10% of cell width
      left = col * cellWidth + (leftOffset * cellWidth / 100);
    } else {
      // 右侧区域：改为 Right 逻辑
      // rightOffset 是相对于 cell 右边界的距离
      const rightOffset = isEven ? 20 : 10;
      
      // 计算该列距离右侧有多少个完整的格子
      const cellsFromRight = (cols - 1 - col);
      right = cellsFromRight * cellWidth + (rightOffset * cellWidth / 100);
    }

    return {
      ...item,
      top,
      left,  // 可能为 undefined
      right  // 可能为 undefined
    };
  });
};

// Helper to generate style
const getItemStyle = (item) => {
  return {
    top: `${item.top}%`,
    // 如果有 right 属性，则优先使用 right定位 (left: auto)
    // 否则使用 left 定位
    left: item.right !== undefined ? 'auto' : `${item.left}%`,
    right: item.right !== undefined ? `${item.right}%` : 'auto',
    // 使用 clamp 实现响应式字体: 最小 14px, 响应式 2vw, 最大 40px (基于 size 系数)
    fontSize: `clamp(${item.size * 12}px, ${item.size * 1.5}vw, ${item.size * 2}rem)`,
    color: item.color,
    textShadow: '0 2px 4px rgba(0,0,0,0.1)',
    opacity: 0.9, // 稍微增加不透明度
    whiteSpace: 'nowrap' // 防止文字换行
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

.pause-on-hover:hover {
  animation-play-state: paused;
}

/* Stagger animations slightly */
div:nth-child(odd) {
  animation-duration: 7s;
}
div:nth-child(even) {
  animation-duration: 5s;
}
</style>

