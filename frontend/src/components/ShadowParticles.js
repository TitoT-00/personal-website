import React, { useEffect, useRef } from "react";

// Move Particle class outside the component
class Particle {
  constructor(canvas) {
    this.canvas = canvas;
    this.reset();
  }

  reset() {
    this.x = Math.random() * this.canvas.width;
    this.y = Math.random() * this.canvas.height;
    this.size = Math.random() * 3 + 2;
    this.baseSize = this.size;
    this.vx = (Math.random() - 0.5) * 0.8;
    this.vy = (Math.random() - 0.5) * 0.8;
    this.ax = 0;
    this.ay = 0;
    this.life = Math.random() * 0.7 + 0.3;
    this.maxLife = this.life;
    this.flowOffset = Math.random() * 1000;
    this.flowSpeed = 0.002;
    this.mouseInfluenceRadius = 180;
    this.maxSpeed = 3;
    this.alpha = Math.random() * 0.6 + 0.2;
    this.targetAlpha = this.alpha;
    this.trail = [];
    this.maxTrailLength = 6;
    this.dampening = 0.97;
    this.flowStrength = 0.08;
    this.trailLength = Math.random() * 20 + 10;
  }

  update(mouseX, mouseY) {
    if (this.trail.length === 0 || 
        Math.abs(this.x - this.trail[0].x) > 1 || 
        Math.abs(this.y - this.trail[0].y) > 1) {
      this.trail.unshift({ x: this.x, y: this.y });
      if (this.trail.length > this.maxTrailLength) {
        this.trail.pop();
      }
    }

    const time = Date.now() * this.flowSpeed;
    const noiseX = Math.sin(this.x * 0.02 + time + this.flowOffset) * 
                  Math.cos(this.y * 0.02 - time);
    const noiseY = Math.cos(this.x * 0.02 - time) * 
                  Math.sin(this.y * 0.02 + time + this.flowOffset);
    
    this.ax += noiseX * this.flowStrength;
    this.ay += noiseY * this.flowStrength;

    this.vx += this.ax;
    this.vy += this.ay;

    this.vx *= this.dampening;
    this.vy *= this.dampening;

    const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    if (speed > this.maxSpeed) {
      this.vx = (this.vx / speed) * this.maxSpeed;
      this.vy = (this.vy / speed) * this.maxSpeed;
    }

    this.x += this.vx;
    this.y += this.vy;

    this.ax = 0;
    this.ay = 0;

    const dx = mouseX - this.x;
    const dy = mouseY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < this.mouseInfluenceRadius) {
      const influence = (1 - distance / this.mouseInfluenceRadius) ** 2;
      const angle = Math.atan2(dy, dx);
      
      this.ax -= Math.cos(angle) * influence * 0.4;
      this.ay -= Math.sin(angle) * influence * 0.4;
      
      const velocityMagnitude = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
      this.size = this.baseSize * (1 + influence + velocityMagnitude * 0.3);
      this.targetAlpha = Math.min(0.9, this.alpha + influence * 0.4);
    } else {
      this.size += (this.baseSize - this.size) * 0.1;
      this.targetAlpha = this.alpha;
    }

    this.currentAlpha = this.currentAlpha || this.alpha;
    this.currentAlpha += (this.targetAlpha - this.currentAlpha) * 0.15;

    if (this.life <= 0 || 
        this.x < -50 || 
        this.x > this.canvas.width + 50 || 
        this.y < -50 || 
        this.y > this.canvas.height + 50) {
      this.reset();
    }

    this.life -= 0.002;
  }

  draw(ctx) {
    const opacity = (this.life / this.maxLife) * this.currentAlpha;
    
    // Draw trail
    this.trail.forEach((pos, index) => {
      const trailOpacity = opacity * (1 - index / this.maxTrailLength) * 0.4;
      ctx.save();
      ctx.translate(pos.x, pos.y);

      const colors = {
        gold: {
          particle: 'rgba(255, 223, 0,',
          shadow: 'rgba(255, 215, 0,',
          background: '#000000'
        },
        dark: {
          particle: 'rgba(26, 26, 26,',
          shadow: 'rgba(40, 40, 40,',
          background: '#ffffff'
        }
      };

      const currentColors = colors['gold']; // default to gold theme
        
      // Create flowing shape
      const time = Date.now() * 0.001;
      const points = 6;
      const angleStep = (Math.PI * 2) / points;
      const baseRadius = this.size * (1 + index * 0.4);
      
      ctx.beginPath();
      
      // Draw organic shape with smooth curves
      for (let i = 0; i <= points; i++) {
        const angle = i * angleStep + time;
        const radiusNoise = Math.sin(angle * 3 + time + this.flowOffset) * 0.2;
        const radius = baseRadius * (1 + radiusNoise);
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          const prevAngle = (i - 1) * angleStep + time;
          const prevRadiusNoise = Math.sin(prevAngle * 3 + time + this.flowOffset) * 0.2;
          const prevRadius = baseRadius * (1 + prevRadiusNoise);
          const prevX = prevRadius * Math.cos(prevAngle);
          const prevY = prevRadius * Math.sin(prevAngle);
          
          const cp1x = prevX + (x - prevX) * 0.5;
          const cp1y = prevY + (y - prevY) * 0.5;
          ctx.quadraticCurveTo(cp1x, cp1y, x, y);
        }
      }
      
      ctx.closePath();
      
      // Fill with gradient
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, baseRadius * 1.2);
      gradient.addColorStop(0, `${currentColors.particle}${trailOpacity})`);
      gradient.addColorStop(1, `${currentColors.particle}0)`);
      ctx.fillStyle = gradient;
      ctx.fill();
      
      ctx.restore();
    });

    // Draw main particle
    ctx.save();
    ctx.translate(this.x, this.y);

    const colors = {
      gold: {
        particle: 'rgba(255, 223, 0,',
        shadow: 'rgba(255, 215, 0,',
        background: '#000000'
      },
      dark: {
        particle: 'rgba(26, 26, 26,',
        shadow: 'rgba(40, 40, 40,',
        background: '#ffffff'
      }
    };

    const currentColors = colors['gold']; // default to gold theme

    // Main particle glow
    const glowSize = this.size * 3;
    const glowGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, glowSize);
    glowGradient.addColorStop(0, `${currentColors.particle}${opacity})`);
    glowGradient.addColorStop(1, `${currentColors.particle}0)`);
    
    ctx.fillStyle = glowGradient;
    ctx.beginPath();
    ctx.arc(0, 0, glowSize, 0, Math.PI * 2);
    ctx.fill();

    // Flow trail effect
    const velocityMagnitude = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    const angle = Math.atan2(this.vy, this.vx);
    const trailWidth = this.size * (1 + velocityMagnitude);
    
    ctx.save();
    ctx.rotate(angle);
    
    const trailGradient = ctx.createLinearGradient(0, -trailWidth/2, -this.trailLength, 0);
    trailGradient.addColorStop(0, `${currentColors.shadow}${opacity * 0.7})`);
    trailGradient.addColorStop(1, `${currentColors.shadow}0)`);
    
    ctx.fillStyle = trailGradient;
    ctx.beginPath();
    ctx.moveTo(0, -trailWidth/2);
    ctx.lineTo(-this.trailLength, 0);
    ctx.lineTo(0, trailWidth/2);
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();
    ctx.restore();
  }
}

const ShadowEffect = () => {
  const canvasRef = useRef(null);
  const particles = useRef([]);
  const mousePosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticles = () => {
      particles.current = [];
      const numParticles = Math.floor((window.innerWidth * window.innerHeight) / 8000);
      for (let i = 0; i < numParticles; i++) {
        particles.current.push(new Particle(canvas));
      }
    };

    const animate = () => {
      const colors = {
        gold: {
          particle: 'rgba(255, 223, 0,',
          shadow: 'rgba(255, 215, 0,',
          background: '#000000'
        },
        dark: {
          particle: 'rgba(26, 26, 26,',
          shadow: 'rgba(40, 40, 40,',
          background: '#ffffff'
        }
      };

      const currentColors = colors['gold']; // default to gold theme

      ctx.fillStyle = currentColors.background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      particles.current.forEach(particle => {
        particle.update(mousePosition.current.x, mousePosition.current.y);
        particle.draw(ctx);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e) => {
      mousePosition.current = {
        x: e.clientX,
        y: e.clientY
      };
    };

    resizeCanvas();
    createParticles();
    animate();

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: '#000000',
          zIndex: 0,
          transition: 'background-color 0.5s ease'
        }}
      />
      
    </>
  );
};

export default ShadowEffect;
