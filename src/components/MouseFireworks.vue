<template>
    <canvas 
      ref="canvasRef" 
      class="fixed top-0 left-0 w-full h-full pointer-events-none z-50"
    ></canvas>
  </template>
  
  <script setup lang="ts">
  import { onMounted, onUnmounted, ref } from 'vue';
  
  const canvasRef = ref<HTMLCanvasElement | null>(null);
  let ctx: CanvasRenderingContext2D | null = null;
  let particles: Particle[] = [];
  let animationFrameId: number | null = null;
  
  // 赛博朋克 + 烟花配色
  const colors = [
    '#8B5CF6', // 紫色 (AI Primary)
    '#10B981', // 绿色 (AI Accent)
    '#3B82F6', // 蓝色
    '#F472B6', // 粉色
    '#FFFFFF', // 纯白高光
    '#FCD34D'  // 金色火花
  ];
  
  class Particle {
    x: number;
    y: number;
    size: number;
    vx: number;
    vy: number;
    life: number;
    decay: number;
    color: string;

    constructor(x: number, y: number) {
      this.x = x;
      this.y = y;
      // 粒子大小：随机大小，制造层次感
      this.size = Math.random() * 2.5 + 0.5;
      
      // 速度：向四周微量散射，而不是剧烈爆炸
      // (Math.random() - 0.5) * 因子 控制散射范围
      this.vx = (Math.random() - 0.5) * 2;
      this.vy = (Math.random() - 0.5) * 2;
      
      this.life = 1; // 生命值 100%
      // 衰减速度：决定拖尾的长短，越小拖尾越长
      this.decay = Math.random() * 0.015 + 0.01; 
      
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }
  
    update() {
      // 1. 移动
      this.x += this.vx;
      this.y += this.vy;
  
      // 2. 物理模拟
      this.vy += 0.08; // 重力：让火花下坠
      this.vx *= 0.95; // 摩擦力：水平方向速度逐渐变慢
      this.vy *= 0.95; // 垂直摩擦
  
      // 3. 变小与消失
      this.life -= this.decay;
      if (this.life > 0) {
        this.size -= 0.03; // 粒子逐渐烧尽变小
      }
    }
  
    draw(context: CanvasRenderingContext2D) {
      context.save();
      
      // 关键：使用 lighter 混合模式，让重叠的粒子发光变白
      // 注意：这需要在 draw 循环外设置，或者在这里设置但消耗少许性能
      // 为了方便，我们在 animate 函数里统一设置了
      
      context.globalAlpha = this.life;
      context.fillStyle = this.color;
      context.beginPath();
      context.arc(this.x, this.y, Math.max(0, this.size), 0, Math.PI * 2);
      context.fill();
      
      context.restore();
    }
  }
  
  // 核心逻辑：每次鼠标移动添加粒子
  const addParticles = (x: number, y: number) => {
    // 每次移动产生 3-5 个粒子，既不卡顿又能形成致密拖尾
    const count = 4; 
    for (let i = 0; i < count; i++) {
      particles.push(new Particle(x, y));
    }
  };
  
  const animate = () => {
    if (!ctx || !canvasRef.value) return;
  
    // 1. 清空画布
    // 这里使用 clearRect 会完全清空，粒子没有残影。
    // 如果想要"长曝光"效果，可以用带透明度的 fillRect 覆盖
    ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);
    
    // 2. 开启发光混合模式
    ctx.globalCompositeOperation = 'lighter';
  
    // 3. 更新和绘制粒子
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      // 如果粒子燃尽（太小或透明度为0），移除
      if (particles[i].life <= 0 || particles[i].size <= 0) {
        particles.splice(i, 1);
        i--;
      } else {
        particles[i].draw(ctx);
      }
    }
    
    // 恢复默认混合模式（虽然清空了画布，但保持良好习惯）
    ctx.globalCompositeOperation = 'source-over';
  
    animationFrameId = requestAnimationFrame(animate);
  };
  
  const handleMouseMove = (e: MouseEvent) => {
    // 不再节流，直接跟随
    addParticles(e.clientX, e.clientY);
  };
  
  const handleResize = () => {
    if (canvasRef.value) {
      canvasRef.value.width = window.innerWidth;
      canvasRef.value.height = window.innerHeight;
    }
  };
  
  onMounted(() => {
    const canvas = canvasRef.value;
    if (canvas) {
        ctx = canvas.getContext('2d');
        
        handleResize();
        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);
        
        animate();
    }
  });
  
  onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('mousemove', handleMouseMove);
    if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
    }
  });
  </script>