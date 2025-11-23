<template>
    <div class="w-full overflow-x-auto p-4 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 shadow-lg">
      <div class="flex justify-between items-center mb-2">
        <div class="flex items-center gap-2">
            <span class="text-xs font-mono text-slate-500 dark:text-slate-400">
              Contribution Activity
              <span v-if="!loading && totalContributions !== null">({{ totalContributions }} total)</span>
              <span v-else-if="loading">(Loading...)</span>
            </span>
            <a v-if="username" :href="`https://github.com/${username}`" target="_blank" class="text-xs text-ai-primary hover:underline">@{{ username }}</a>
        </div>
        <div class="flex gap-1 text-xs text-slate-500">
          <span>Less</span>
          <div class="w-3 h-3 rounded-sm bg-slate-200 dark:bg-slate-700"></div>
          <div class="w-3 h-3 rounded-sm bg-green-200 dark:bg-green-900/60"></div>
          <div class="w-3 h-3 rounded-sm bg-green-500 dark:bg-green-500"></div>
          <span>More</span>
        </div>
      </div>
      
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center h-[100px] text-slate-400 text-sm animate-pulse">
        Loading GitHub data...
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="flex justify-center items-center h-[100px] text-red-400 text-sm">
        {{ error }}
      </div>

      <!-- Contribution Grid -->
      <div v-else class="flex gap-[3px] min-w-max pb-2">
        <div v-for="(week, wIndex) in weeks" :key="wIndex" class="flex flex-col gap-[3px]">
          <div 
            v-for="(day, dIndex) in week" 
            :key="dIndex"
            class="w-3 h-3 rounded-sm transition-all duration-300 relative group hover:z-30"
            :class="getColorClass(day.level)"
          >
            <!-- Tooltip -->
            <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-slate-900 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                {{ day.count }} contributions on {{ formatDate(day.date) }}.
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, watch } from 'vue';
  
  const props = defineProps({
    username: {
        type: String,
        default: 'torvalds'
    }
  });

  const weeks = ref([]);
  const loading = ref(true);
  const error = ref(null);
  const totalContributions = ref(0);
  
  // Helper to format date
  const formatDate = (dateStr) => {
      if (!dateStr) return '';
      return new Date(dateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const fetchContributions = async () => {
      if (!props.username) return;
      
      loading.value = true;
      error.value = null;
      
      try {
          const response = await fetch(`https://github-contributions-api.jogruber.de/v4/${props.username}?y=2024`);
          
          if (!response.ok) {
              throw new Error('User not found or API error');
          }
          
          const data = await response.json();
          // The API returns total.lastYear, or we can sum it up manually
          if (data.total && data.total.lastYear !== undefined) {
             totalContributions.value = data.total.lastYear;
          } else {
             // Fallback sum
             totalContributions.value = data.contributions.reduce((acc, day) => acc + day.count, 0);
          }
          
          processData(data.contributions);
      } catch (err) {
          console.error(err);
          error.value = 'Failed to load data';
      } finally {
          loading.value = false;
      }
  };

  const processData = (contributions) => {
      const processedWeeks = [];
      let currentWeek = [];
      
      contributions.forEach((day, index) => {
          let level = day.level;
          if (level === undefined) {
              if (day.count === 0) level = 0;
              else if (day.count <= 3) level = 1;
              else if (day.count <= 6) level = 2;
              else if (day.count <= 10) level = 3;
              else level = 4;
          }

          currentWeek.push({
              date: day.date,
              count: day.count,
              level: level
          });
          
          if (currentWeek.length === 7) {
              processedWeeks.push(currentWeek);
              currentWeek = [];
          }
      });
      
      if (currentWeek.length > 0) {
          processedWeeks.push(currentWeek);
      }

      weeks.value = processedWeeks;
  };
  
  onMounted(() => {
      fetchContributions();
  });
  
  watch(() => props.username, () => {
      fetchContributions();
  });
  
  const getColorClass = (level) => {
    switch (level) {
      case 1: return 'bg-green-200 dark:bg-green-900/60';
      case 2: return 'bg-green-400 dark:bg-green-700';
      case 3: return 'bg-green-600 dark:bg-green-500';
      case 4: return 'bg-green-800 dark:bg-green-400';
      default: return 'bg-slate-200 dark:bg-slate-700/50';
    }
  };
  </script>