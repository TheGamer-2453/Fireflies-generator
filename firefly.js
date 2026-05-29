const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const fireflies = [];

class Firefly {
    constructor(x, y, key) {
        this.x = x;
        this.y = y;
        this.key = key;
        
        
        const charCode = key.length > 0 ? key.charCodeAt(0) : 65; 
        
        
        this.hue = (charCode * 137.5) % 360; 
        
        
        this.freqX = 0.02 + (charCode % 5) * 0.01;
        this.freqY = 0.02 + (charCode % 7) * 0.01;
        this.amplitudeX = 1 + (charCode % 3) * 0.5;
        this.amplitudeY = 1 + (charCode % 4) * 0.5;
        
        this.speedX = (Math.random() - 0.5) * 1.5;
        this.speedY = (Math.random() - 0.5) * 1.5 - 0.5; 

        this.maxLife = Math.random() * 150 + 200; 
        this.life = this.maxLife;
        this.alpha = 1;
        this.size = Math.random() * 3 + 5; 
    }

    update() {
        this.x += this.speedX + Math.sin(this.life * this.freqX) * this.amplitudeX;
        this.y += this.speedY + Math.cos(this.life * this.freqY) * this.amplitudeY;
        
        this.life--;
        this.alpha = this.life / this.maxLife;
        
        if (this.size > 0.5) this.size -= 0.015;
    }

    draw() {
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        
        ctx.shadowBlur = this.size * 6;
        ctx.shadowColor = `hsla(${this.hue}, 100%, 60%, ${this.alpha})`;
        ctx.fillStyle = `hsla(${this.hue}, 100%, 70%, ${this.alpha})`;
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.shadowBlur = 0; 
        ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha * 0.9})`;
        ctx.font = `bold ${this.size * 2.5}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.key, this.x, this.y - (this.size * 2.5));
        
        ctx.restore();
    }
}

window.addEventListener('keydown', (e) => {
    if (e.key.length > 1 && e.key !== 'Enter' && e.key !== 'Spacebar' && e.key !== ' ') return;
    
    let keyText = e.key;
    if (e.key === ' ' || e.key === 'Spacebar') keyText = '␣';
    if (e.key === 'Enter') keyText = '↵';
    
    const randomX = Math.random() * (canvas.width * 0.6) + (canvas.width * 0.2);
    const randomY = Math.random() * (canvas.height * 0.6) + (canvas.height * 0.2);
    
    for(let i = 0; i < 3; i++) {
        fireflies.push(new Firefly(randomX, randomY, keyText));
    }
});

function animate() {
    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.08)'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();


    for (let i = fireflies.length - 1; i >= 0; i--) {
        fireflies[i].update();
        fireflies[i].draw();

        if (fireflies[i].life <= 0) {
            fireflies.splice(i, 1);
        }
    }

    requestAnimationFrame(animate);
}

animate();