// src/main.js
import { createApp } from 'vue'
import App from './App.vue'

// 👇 必须添加这一行！没有这一行，Tailwind 就不会工作
import './index.css' 

createApp(App).mount('#app')