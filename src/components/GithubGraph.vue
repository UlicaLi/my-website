<template>
    <div class="w-full overflow-x-auto p-4 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 shadow-lg">
      <div class="flex justify-between items-center mb-2">
        <span class="text-xs font-mono text-slate-500 dark:text-slate-400">Contribution Activity (Mock)</span>
        <div class="flex gap-1 text-xs text-slate-500">
          <span>Less</span>
          <div class="w-3 h-3 rounded-sm bg-slate-200 dark:bg-slate-700"></div>
          <div class="w-3 h-3 rounded-sm bg-green-200"></div>
          <div class="w-3 h-3 rounded-sm bg-green-500"></div>
          <span>More</span>
        </div>
      </div>
      
      <!-- 热力图 Grid -->
      <div class="flex gap-[3px] min-w-max">
        <div v-for="(week, wIndex) in weeks" :key="wIndex" class="flex flex-col gap-[3px]">
          <div 
            v-for="(day, dIndex) in week" 
            :key="dIndex"
            class="w-3 h-3 rounded-sm transition-colors duration-300 hover:scale-125"
            :class="getColorClass(day.level)"
            :title="`Contributions: ${day.count}`"
          ></div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  // 生成 Mock 数据 (52周 x 7天)
  const generateData = () => {
    const data = [];
    for (let i = 0; i < 52; i++) {
      const week = [];
      for (let j = 0; j < 7; j++) {
        // AI研究生通常很忙，level 高的概率大一点
        const rand = Math.random();
        let level = 0;
        let count = 0;
        if (rand > 0.9) { level = 4; count = 12; }
        else if (rand > 0.7) { level = 3; count = 8; }
        else if (rand > 0.5) { level = 2; count = 5; }
        else if (rand > 0.2) { level = 1; count = 2; }
        week.push({ level, count });
      }
      data.push(week);
    }
    return data;
  };
  
  const weeks = ref(generateData());
  
  const getColorClass = (level) => {
    // 针对暗黑和亮色模式配置不同的绿色
    switch (level) {
      case 1: return 'bg-green-200 dark:bg-green-900/60';
      case 2: return 'bg-green-400 dark:bg-green-700';
      case 3: return 'bg-green-600 dark:bg-green-500';
      case 4: return 'bg-green-800 dark:bg-green-400';
      default: return 'bg-slate-200 dark:bg-slate-700/50';
    }
  };
  </script>