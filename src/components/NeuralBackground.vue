<template>
    <canvas 
      ref="canvasRef" 
      class="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none transition-opacity duration-1000"
    ></canvas>
  </template>
  
  <script setup>
  import { onMounted, onUnmounted, ref, watch } from 'vue';
  
  const canvasRef = ref(null);
  const props = defineProps({
    isDark: Boolean // 接收父组件的主题状态
  });
  
  // 配置参数
  const config = {
    particleCount: 80, // 粒子数量，根据性能调整
    connectionDistance: 150, // 连线阈值
    speed: 0.5, // 粒子运动速度
  };
  
  let ctx = null;
  let width = 0;
  let height = 0;
  let particles = [];
  let animationFrameId = null;
  
  // 定义颜色数组：红、黄、绿、蓝、紫、青、橙等
  const colors = [
    { r: 255, g: 0, b: 0 },      // 红色
    { r: 255, g: 255, b: 0 },    // 黄色
    { r: 0, g: 255, b: 0 },      // 绿色
    { r: 0, g: 0, b: 255 },      // 蓝色
    { r: 255, g: 0, b: 255 },    // 紫色
  ];
  
  // 粒子类
  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * config.speed;
      this.vy = (Math.random() - 0.5) * config.speed;
      this.size = Math.random() * 2 + 1;
      // 随机选择一个颜色
      const color = colors[Math.floor(Math.random() * colors.length)];
      this.color = color;
    }
  
    update() {
      this.x += this.vx;
      this.y += this.vy;
  
      // 边界反弹
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }
  
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      // 使用粒子的随机颜色，根据主题调整透明度
      const opacity = props.isDark ? 0.6 : 0.5;
      ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${opacity})`;
      ctx.fill();
    }
  }
  
  const initParticles = () => {
    particles = [];
    // 根据屏幕大小调整粒子数量（移动端减少）
    const count = window.innerWidth < 768 ? 40 : config.particleCount;
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  };
  
  const drawLines = () => {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
  
        if (distance < config.connectionDistance) {
          // 距离越近，线条越不透明
          const opacity = 1 - distance / config.connectionDistance;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          
          // 线条颜色逻辑
          if (props.isDark) {
               // 黑夜模式：赛博紫 -> 青色渐变或者是纯色
               ctx.strokeStyle = `rgba(139, 92, 246, ${opacity * 0.4})`; // ai-primary
          } else {
               // 白天模式：低调的灰色
               ctx.strokeStyle = `rgba(71, 85, 105, ${opacity * 0.3})`;
          }
          
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
  };
  
  const animate = () => {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
    
    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });
    
    drawLines();
    animationFrameId = requestAnimationFrame(animate);
  };
  
  const handleResize = () => {
    if (canvasRef.value) {
      width = window.innerWidth;
      height = window.innerHeight;
      canvasRef.value.width = width;
      canvasRef.value.height = height;
      initParticles(); // 重置粒子位置以防屏幕拉伸
    }
  };
  
  onMounted(() => {
    ctx = canvasRef.value.getContext('2d');
    handleResize();
    animate();
    window.addEventListener('resize', handleResize);
  });
  
  onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
    cancelAnimationFrame(animationFrameId);
  });
  
  // 监听主题变化，虽然 render 循环里已经处理了颜色，
  // 但为了确保平滑过渡或触发重绘，可以保留 watcher（可选）
  watch(() => props.isDark, () => {
      // 可以在这里做一些颜色切换的过渡效果，
      // 但目前的 requestAnimationFrame 会自动在下一帧捕捉到 props 的变化
  });
  </script>