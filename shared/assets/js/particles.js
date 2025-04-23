class ParticleSystem {
    constructor(canvasId = 'particles') {
      this.canvas = document.getElementById(canvasId);
      if (!this.canvas) return;
      
      this.ctx = this.canvas.getContext('2d');
      this.particles = [];
      this.init();
    }
  
    init() {
      this.resize();
      window.addEventListener('resize', () => this.resize());
      this.createParticles();
      this.animate();
    }
  
    createParticles() {
      // Clear existing particles
      this.particles = [];
      
      // Get current theme color
      const particleColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--particle-color');
      
      // Create new particles with current theme color
      this.particles = Array.from({ length: 100 }, () => 
        new Particle(this.ctx, this.canvas.width, this.canvas.height, particleColor));
    }
  
    resize() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }
  
    animate() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
      this.particles.forEach(p => {
        p.update();
        p.draw();
      });
      
      requestAnimationFrame(() => this.animate());
    }
  }
  
  class Particle {
    constructor(ctx, width, height, color) {
      this.ctx = ctx;
      this.width = width;
      this.height = height;
      this.color = color || getComputedStyle(document.documentElement)
        .getPropertyValue('--particle-color');
      this.reset();
    }
  
    reset() {
      this.x = Math.random() * this.width;
      this.y = Math.random() * this.height;
      this.size = Math.random() * 2 + 1;
      this.speed = Math.random() * 0.5 + 0.5;
      this.opacity = Math.random() * 0.5 + 0.1;
    }
  
    update() {
      this.y += this.speed;
      if (this.y > this.height) this.reset();
    }
  
    draw() {
      this.ctx.fillStyle = this.color;
      this.ctx.globalAlpha = this.opacity;
      this.ctx.beginPath();
      this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.globalAlpha = 1;
    }
  }
  
  // Initialize particle system
  const particleSystem = new ParticleSystem();