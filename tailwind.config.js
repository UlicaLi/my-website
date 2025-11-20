/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class', // 关键：开启手动切换模式
    content: [
      "./index.html",
      "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          'ai-dark': '#0B1120', // 深空黑
          'ai-primary': '#8B5CF6', // 神经网络紫
          'ai-accent': '#10B981', // 算法通过绿
        },
        animation: {
          'pulse-fast': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        }
      },
    },
    plugins: [],
  }