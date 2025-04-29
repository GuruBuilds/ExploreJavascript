class ParticleSystem {
    constructor() {
      this.container = document.createElement('div');
      this.container.className = 'particles-container';
      document.body.prepend(this.container);
      this.createParticles();
    }
  
    createParticles() {
      this.container.innerHTML = '';
      for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
          left: ${Math.random() * 100}%;
          top: ${Math.random() * 100}%;
          width: ${Math.random() * 50 + 30}px;
          height: ${Math.random() * 50 + 30}px;
          animation-duration: ${Math.random() * 20 + 10}s;
          animation-delay: ${Math.random() * 5}s;
        `;
        this.updateColor(particle);
        this.container.appendChild(particle);
      }
    }
  
    updateColors() {
      this.container.querySelectorAll('.particle').forEach(particle => {
        this.updateColor(particle);
      });
    }
  
    updateColor(particle) {
      const color = getComputedStyle(document.documentElement)
        .getPropertyValue('--primary');
      particle.style.background = `radial-gradient(circle, ${color} 0%, transparent 70%)`;
    }
  }
  
  const particleSystem = new ParticleSystem();