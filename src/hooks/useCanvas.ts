import { useEffect, useRef } from "react";

let particlesArray: Particle[] = [];
const particleCount = 100;
class Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  baseOpacity: number;
  opacity: number;
  opacitySpeed: number;
  opacityDirection: number;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.x = Math.random() * canvas!.width;
    this.y = Math.random() * canvas!.height;
    this.size = Math.random() * 3 + 2; // 颗粒大小
    this.speedX = (Math.random() * 1 - 0.5) * 0.5; // 降低移动速度
    this.speedY = (Math.random() * 1 - 0.5) * 0.5; // 降低移动速度
    this.baseOpacity = Math.random() * 0.5 + 0.5; // 初始透明度
    this.opacity = this.baseOpacity;
    this.opacitySpeed = Math.random() * 0.00001 + 0.005; // 控制闪烁速度
    this.opacityDirection = Math.random() > 0.5 ? 1 : -1; // 透明度增减方向
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x > this.canvas.width || this.x < 0) this.speedX *= -1;
    if (this.y > this.canvas.height || this.y < 0) this.speedY *= -1;

    // 让星星闪烁
    this.opacity += this.opacitySpeed * this.opacityDirection;
    if (this.opacity >= 1 || this.opacity <= 0.2) {
      this.opacityDirection *= -1; // 透明度反转
    }
  }

  draw() {
    let gradient = this.ctx.createRadialGradient(
      this.x,
      this.y,
      0,
      this.x,
      this.y,
      this.size
    );
    gradient.addColorStop(0, `rgba(255, 255, 255, ${this.opacity})`); // 明亮中心
    gradient.addColorStop(0.5, `rgba(173, 216, 230, ${this.opacity * 0.8})`); // 淡蓝色
    gradient.addColorStop(1, `rgba(0, 0, 0, 0)`); // 透明边缘

    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    this.ctx.fill();
  }
}

function init(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  particlesArray = [];
  for (let i = 0; i < particleCount; i++) {
    particlesArray.push(new Particle(canvas, ctx));
  }
}

function animate(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  ctx!.clearRect(0, 0, canvas.width, canvas.height);
  particlesArray.forEach((particle) => {
    particle.update();
    particle.draw();
  });
  requestAnimationFrame(() => animate(canvas, ctx));
}


export default function useParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    console.log("canvasRef: ", canvasRef);
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      console.log("canvas: ", canvas);
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        throw new Error("2D context not available");
      }

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      init(canvas, ctx);
      animate(canvas, ctx);

      window.addEventListener("resize", () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        init(canvas, ctx);
      });
    }
  }, [canvasRef]);

  return { canvasRef };
}
