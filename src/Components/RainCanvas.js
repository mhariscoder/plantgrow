// RainCanvas.js
import React, { useEffect, useRef } from 'react';

const RainCanvas = ({ isRaining }) => {
  const canvasRef = useRef(null);
  const frameIdRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.scale(dpr, dpr);

    let rain = [];
    let drops = [];
    let dropDelay = 25;
    let wind = 4;
    let speed = 1;
    const rainColor = 'rgba(80, 175, 255, 0.5)';

    class RainDrop {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * -100;
            this.z = Math.random() * 0.5 + 0.5;
            this.speed = 25;
            this.splashed = false;
        }
        update(multiplier) {
            this.y += this.speed * this.z * multiplier;
            this.x += this.z * wind * multiplier;

            if (this.y > height) {
                this.splash();
            }

            if (this.y > height + 40 * this.z || this.x < -50 || this.x > width + 50) {
                this.reset();
            }
        }
        splash() {
            if (this.splashed) return;
            this.splashed = true;
            for (let i = 0; i < 16; i++) {
                drops.push(new Drop(this.x, height));
            }
        }
    }

    class Drop {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = Math.round(Math.random() * 2 + 1);
        const angle = Math.random() * Math.PI - Math.PI * 0.5;
        const speed = Math.random() * 5;
        this.speedX = Math.sin(angle) * speed;
        this.speedY = -Math.cos(angle) * speed;
      }
      update(multiplier) {
        this.x += this.speedX * multiplier;
        this.y += this.speedY * multiplier;
        this.speedY += 0.3 * multiplier;
        this.speedX += wind / 25 * multiplier;
      }
    }

    let lastTime = performance.now();

    const animate = (time) => {
      const deltaTime = time - lastTime;
      lastTime = time;
      const multiplier = (speed * deltaTime) / 16.67;

      ctx.clearRect(0, 0, width, height);

      ctx.beginPath();
      for (let drop of rain) {
        drop.update(multiplier);
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x - wind * drop.z * 1.5, drop.y - 40 * drop.z);
      }
      ctx.lineWidth = 2;
      ctx.strokeStyle = rainColor;
      ctx.stroke();

      ctx.fillStyle = rainColor;
      for (let i = drops.length - 1; i >= 0; i--) {
        const d = drops[i];
        d.update(multiplier);
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.radius, 0, 2 * Math.PI);
        ctx.fill();
        if (d.y > height + d.radius) {
          drops.splice(i, 1);
        }
      }

      if (rain.length < 300) {
        rain.push(new RainDrop());
      }

      frameIdRef.current = requestAnimationFrame(animate);
    };

    const startAnimation = () => {
      lastTime = performance.now();
      frameIdRef.current = requestAnimationFrame(animate);
    };

    const stopAnimation = () => {
      cancelAnimationFrame(frameIdRef.current);
      ctx.clearRect(0, 0, width, height);
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.scale(dpr, dpr);
    };

    window.addEventListener('resize', resize);

    if (isRaining) {
      startAnimation();
    } else {
      stopAnimation();
    }

    return () => {
      cancelAnimationFrame(frameIdRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [isRaining]);

  return <canvas ref={canvasRef} style={{ display: 'block' }} />;
};

export default RainCanvas;
