<template>
  <div class="flex flex-col md:flex-row gap-6 w-full min-h-[600px]">
    <!-- Sidebar: File List -->
    <div class="w-full md:w-1/4 min-w-[250px] flex flex-col gap-4">
      <div class="p-4 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 shadow-lg h-full">
        <h2 class="text-lg font-bold mb-4 text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <span class="text-ai-primary">#</span> Tech Notes
        </h2>
        
        <div v-if="loadingList" class="space-y-2 animate-pulse">
          <div class="h-8 bg-slate-200 dark:bg-slate-700 rounded"></div>
          <div class="h-8 bg-slate-200 dark:bg-slate-700 rounded"></div>
          <div class="h-8 bg-slate-200 dark:bg-slate-700 rounded"></div>
        </div>

        <div v-else-if="errorList" class="text-red-400 text-sm">
          {{ errorList }}
        </div>

        <div v-else class="flex flex-col gap-2 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
          <button
            v-for="file in fileList"
            :key="file.fileName"
            @click="selectFile(file)"
            class="text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 hover:bg-ai-primary/10 dark:hover:bg-ai-primary/20"
            :class="selectedFile?.fileName === file.fileName ? 'bg-ai-primary/10 dark:bg-ai-primary/20 text-ai-primary font-medium border-l-2 border-ai-primary' : 'text-slate-600 dark:text-slate-400 border-l-2 border-transparent'"
          >
            {{ file.title }}
            <div class="text-[10px] opacity-60 mt-0.5">{{ formatDate(file.lastModified) }}</div>
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content: Markdown Reader -->
    <div class="w-full md:w-3/4">
      <div class="p-6 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 shadow-lg min-h-full relative">
        
        <div v-if="loadingContent" class="flex justify-center items-center h-64">
           <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-ai-primary"></div>
        </div>

        <div v-else-if="errorContent" class="flex flex-col justify-center items-center h-64 text-slate-500">
          <p class="text-red-400 mb-2">Failed to load content</p>
          <button @click="reloadContent" class="text-xs underline hover:text-ai-primary">Try again</button>
        </div>

        <div v-else-if="!selectedFile" class="flex flex-col justify-center items-center h-64 text-slate-400">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12 mb-2 opacity-50">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
           <p>Select a note to start reading</p>
        </div>

        <div v-else>
           <div class="mb-6 border-b border-slate-200 dark:border-slate-700 pb-4">
              <h1 class="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">{{ selectedFile.title }}</h1>
              <div class="text-xs text-slate-500 flex gap-4">
                  <span>Last updated: {{ formatDate(selectedFile.lastModified) }}</span>
                  <span>{{ selectedFile.fileName }}</span>
              </div>
           </div>
           
           <!-- Markdown Content -->
           <div 
              class="prose prose-slate dark:prose-invert max-w-none prose-pre:bg-[#282c34] prose-pre:p-0 prose-img:rounded-xl"
              v-html="renderedContent"
           ></div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import MarkdownIt from 'markdown-it';
import tm from 'markdown-it-texmath';
import katex from 'katex';
import hljs from 'highlight.js';
import type { BlogPost } from '@/types';

// Import styles
import 'katex/dist/katex.min.css';
import 'highlight.js/styles/atom-one-dark.css';

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str: string, lang: string) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="hljs p-4 rounded-lg text-sm overflow-x-auto"><code>${ 
          hljs.highlight(str, { language: lang, ignoreIllegals: true }).value 
        }</code></pre>`;
      } catch (__error) {}
    }

    return `<pre class="hljs p-4 rounded-lg text-sm overflow-x-auto"><code>${md.utils.escapeHtml(str)}</code></pre>`;
  }
});

// Configure Math plugin
md.use(tm, {
  engine: katex,
  delimiters: 'dollars',
  katexOptions: { macros: { "\RR": "\mathbb{R}" } }
});

const fileList = ref<BlogPost[]>([]);
const selectedFile = ref<BlogPost | null>(null);
const rawContent = ref<string>('');
const loadingList = ref<boolean>(true);
const loadingContent = ref<boolean>(false);
const errorList = ref<string | null>(null);
const errorContent = ref<string | null>(null);

const renderedContent = computed(() => {
  if (!rawContent.value) return '';
  return md.render(rawContent.value);
});

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString(undefined, { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

const fetchManifest = async () => {
  loadingList.value = true;
  errorList.value = null;
  try {
    const res = await fetch('/posts/manifest.json');
    if (!res.ok) throw new Error('Failed to load manifest');
    const data: BlogPost[] = await res.json();
    // Sort by date desc
    fileList.value = data.sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime());
    
    // Auto-select first file if available
    if (fileList.value.length > 0) {
        selectFile(fileList.value[0]);
    }
  } catch (err) {
    console.error(err);
    errorList.value = 'Could not load notes list.';
  } finally {
    loadingList.value = false;
  }
};

const selectFile = async (file: BlogPost) => {
  if (selectedFile.value?.fileName === file.fileName) return;
  
  selectedFile.value = file;
  loadingContent.value = true;
  errorContent.value = null;
  rawContent.value = '';

  try {
    // Add timestamp to prevent caching issues during dev
    const res = await fetch(`/posts/${file.fileName}?t=${Date.now()}`);
    if (!res.ok) throw new Error('Failed to load file content');
    rawContent.value = await res.text();
  } catch (err) {
    console.error(err);
    errorContent.value = 'Failed to load content.';
  } finally {
    loadingContent.value = false;
  }
};

const reloadContent = () => {
    if(selectedFile.value) selectFile(selectedFile.value);
}

onMounted(() => {
  fetchManifest();
});
</script>

<style scoped>
/* Custom scrollbar for the list */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.3);
  border-radius: 20px;
}
.custom-scrollbar:hover::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
}

/* Ensure KaTeX and Highlight.js styles work well with Tailwind Typography */
:deep(.katex) {
  font-size: 1.1em;
}
:deep(pre code.hljs) {
  background-color: transparent; /* Let the pre handle the background */
  padding: 0;
}
</style>