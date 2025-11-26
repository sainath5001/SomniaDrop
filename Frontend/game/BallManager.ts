export interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
}

export interface Obstacle {
  x: number;
  y: number;
  radius: number;
}

export class BallManager {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private ball: Ball | null = null;
  private obstacles: Obstacle[] = [];
  private sinks: Array<{ x: number; y: number; width: number; multiplier: string }> = [];
  private animationId: number | null = null;
  private onComplete?: (outcome: number) => void;
  private pattern: number[] = [];
  private currentDrop = 0;
  private outcome: number = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get 2d context');
    this.ctx = ctx;

    this.setupObstacles();
    this.setupSinks();
  }

  private setupObstacles() {
    const rows = 8;
    const cols = 9;
    const startY = 150;
    const spacing = 80;
    const startX = (this.canvas.width - (cols - 1) * spacing) / 2;

    for (let row = 0; row < rows; row++) {
      const offset = row % 2 === 0 ? 0 : spacing / 2;
      for (let col = 0; col < cols - (row % 2); col++) {
        this.obstacles.push({
          x: startX + col * spacing + offset,
          y: startY + row * spacing,
          radius: 12,
        });
      }
    }
  }

  private setupSinks() {
    const numSinks = 17;
    const sinkWidth = this.canvas.width / numSinks;
    const multipliers = [
      '16x', '9x', '2x', '1.4x', '1.4x', '1.2x', '1.1x', '1x', '0.5x',
      '1x', '1.1x', '1.2x', '1.4x', '1.4x', '2x', '9x', '16x',
    ];

    for (let i = 0; i < numSinks; i++) {
      this.sinks.push({
        x: i * sinkWidth,
        y: this.canvas.height - 50,
        width: sinkWidth,
        multiplier: multipliers[i],
      });
    }
  }

  startGame(pattern: number[], outcome: number, onComplete?: (outcome: number) => void) {
    this.pattern = pattern;
    this.outcome = outcome;
    this.currentDrop = 0;
    this.onComplete = onComplete;

    // Start ball at top center
    this.ball = {
      x: this.canvas.width / 2,
      y: 50,
      vx: 0,
      vy: 0,
      radius: 8,
      color: '#3b82f6',
    };

    this.animate();
  }

  private animate = () => {
    if (!this.ball) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.draw();
    this.update();

    if (this.ball.y < this.canvas.height - 100) {
      this.animationId = requestAnimationFrame(this.animate);
    } else {
      // Ball reached bottom
      if (this.onComplete) {
        this.onComplete(this.outcome);
      }
      this.ball = null;
    }
  };

  private update() {
    if (!this.ball) return;

    // Gravity
    this.ball.vy += 0.3;

    // Apply pattern-based direction at obstacles
    const obstacleY = 150;
    if (this.ball.y > obstacleY && this.ball.y < obstacleY + 600 && this.currentDrop < this.pattern.length) {
      const direction = this.pattern[this.currentDrop] === 1 ? 1 : -1;
      this.ball.vx += direction * 0.2;
      this.currentDrop++;
    }

    // Update position
    this.ball.x += this.ball.vx;
    this.ball.y += this.ball.vy;

    // Collision with obstacles
    for (const obstacle of this.obstacles) {
      const dx = this.ball.x - obstacle.x;
      const dy = this.ball.y - obstacle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.ball.radius + obstacle.radius) {
        // Collision detected
        const angle = Math.atan2(dy, dx);
        const speed = Math.sqrt(this.ball.vx * this.ball.vx + this.ball.vy * this.ball.vy);
        
        // Bounce off
        this.ball.vx = Math.cos(angle) * speed * 0.8;
        this.ball.vy = Math.sin(angle) * speed * 0.8;

        // Move ball outside obstacle
        const overlap = this.ball.radius + obstacle.radius - distance;
        this.ball.x += Math.cos(angle) * overlap;
        this.ball.y += Math.sin(angle) * overlap;
      }
    }

    // Boundary collision
    if (this.ball.x < this.ball.radius || this.ball.x > this.canvas.width - this.ball.radius) {
      this.ball.vx *= -0.8;
      this.ball.x = Math.max(this.ball.radius, Math.min(this.canvas.width - this.ball.radius, this.ball.x));
    }

    // Friction
    this.ball.vx *= 0.99;
  }

  private draw() {
    // Draw obstacles
    this.ctx.fillStyle = '#64748b';
    for (const obstacle of this.obstacles) {
      this.ctx.beginPath();
      this.ctx.arc(obstacle.x, obstacle.y, obstacle.radius, 0, Math.PI * 2);
      this.ctx.fill();
    }

    // Draw sinks
    this.ctx.fillStyle = '#1e293b';
    for (const sink of this.sinks) {
      this.ctx.fillRect(sink.x, sink.y, sink.width, 50);
      
      // Draw multiplier text
      this.ctx.fillStyle = '#fff';
      this.ctx.font = '12px sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(sink.multiplier, sink.x + sink.width / 2, sink.y + 30);
      this.ctx.fillStyle = '#1e293b';
    }

    // Highlight winning sink
    if (this.outcome >= 0 && this.outcome < this.sinks.length) {
      const winningSink = this.sinks[this.outcome];
      this.ctx.strokeStyle = '#10b981';
      this.ctx.lineWidth = 3;
      this.ctx.strokeRect(winningSink.x, winningSink.y, winningSink.width, 50);
    }

    // Draw ball
    if (this.ball) {
      this.ctx.fillStyle = this.ball.color;
      this.ctx.beginPath();
      this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Ball shadow
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      this.ctx.beginPath();
      this.ctx.ellipse(this.ball.x, this.ball.y + this.ball.radius + 2, this.ball.radius, this.ball.radius / 2, 0, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    this.ball = null;
  }

  reset() {
    this.stop();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.draw();
  }
}


