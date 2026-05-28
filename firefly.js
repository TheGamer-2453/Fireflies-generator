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
        gradient.addColorStop(1, 'rgba(163,245,76,0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.radius * 4,0,Math.pi * 2);
        ctx.restore();
    }
}

window.addEventListener('keydown', (e) => {
    const inst = document.querySelector('.instructions');
    if (inst) inst.style.display ='none';

    const spawnX = Math.random() * (canvas.width * 0.8) + (canvas.width*0.1);
    const spawnY = Math.random() * (canvas.height * 0.6) + (canvas.height * 0.2);

    const burstCount = Math.floor(Math.random() * 4) + 5;
    for (let i = 0; i < burstCount; i++) {
        firefiles.push(new Firefly(spawnX,spawnY));
    }
});

 function animate() {
            
    ctx.fillStyle = 'rgba(8, 13, 26, 0.3)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let i = fireflies.length - 1; i >= 0; i--) {
                fireflies[i].update();
                fireflies[i].draw();

                
            if (fireflies[i].alpha <= 0) {
                    fireflies.splice(i, 1);
            }
        }

        requestAnimationFrame(animate);
    }

animate();
