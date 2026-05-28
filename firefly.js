const canvas = document.getElementById('fireflyCanvas');
const ctx = canvas.getContext('2d')

function resizeCanvas(){
    canvas.width = window.innerWidth;
    canvas.height = window.inertHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const firefiles = [];

class firefiy {
    constructor(x,y) {
        this.x = x;
        this.y = y;
        
        this.radius = Math.random() * 2.5 + 1.5;

        this.vx = (Math.random() - 0.5) * 3;
        this.vy = (Math.random() - 0.6) * 2 - 0.5;

        this.alpha = 1
        this.decay = Math.random()* 0.01 + 0.005
        this.angle = Math.random()* Math.Pi* 2
        this.speedMultiplier = Math.random()* 0.05 + 0.02;
    }
    update() {
    this.angle += this.speedMultiplier;
    this.x += this.vx + Math.sin(this.angle) * 0.5;
    this.y += this.vy;     
    this.alpha -= this.decay;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        const gradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.radius * 4
        );
        gradient.addColorStop(0, `rgba(230,255,99,1)`);
        gradient.addColorStop(0.2, 'rgba()163,245,76,0.8');
        
    }
}