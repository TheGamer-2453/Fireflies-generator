const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const fireflies = [];


const glowCache = {};

function getGlowTexture(hue) {
    
    if (glowCache[hue]) return glowCache[hue];

    const size = 30; 
    const cacheCanvas = document.createElement('canvas');
    cacheCanvas.width = size * 2;
    cacheCanvas.height = size * 2;
    const cCtx = cacheCanvas.getContext('2d');

    
    const gradient = cCtx.createRadialGradient(size, size, 0, size, size, size);
    gradient.addColorStop(0, `hsla(${hue}, 100%, 85%, 1)`);
    gradient.addColorStop(0.2, `hsla(${hue}, 100%, 65%, 0.8)`);
    gradient.addColorStop(0.5, `hsla(${hue}, 100%, 50%, 0.4)`);
    gradient.addColorStop(1, `hsla(${hue}, 100%, 50%, 0)`);

    cCtx.fillStyle = gradient;
    cCtx.beginPath();
    cCtx.arc(size, size, size, 0, Math.PI * 2);
    cCtx.fill();

    glowCache[hue] = cacheCanvas;
    return cacheCanvas;
}


class Firefly {
    constructor(x, y, key) {
        this.x = x;
        this.y = y;
        this.key = key;
        
        const charCode = key.length > 0 ? key.charCodeAt(0) : 65; 
        
        
        this.hue = Math.floor((charCode * 137.5) % 360); 
        this.glowTexture = getGlowTexture(this.hue);
        
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
        
        ctx.globalAlpha = this.alpha;
        
        
        const renderSize = this.size * 5; 
        ctx.drawImage(
            this.glowTexture, 
            this.x - renderSize, 
            this.y - renderSize, 
            renderSize * 2, 
            renderSize * 2
        );
        
        
        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${this.size * 2.3}px sans-serif`;
        ctx.fillText(this.key, this.x, this.y - (this.size * 2.5));
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
    
    ctx.globalAlpha = 1.0;
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.08)'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    
    ctx.globalCompositeOperation = 'screen';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let i = fireflies.length - 1; i >= 0; i--) {
        fireflies[i].update();
        fireflies[i].draw();

        if (fireflies[i].life <= 0) {
            fireflies.splice(i, 1);
        }
    }

    
    ctx.globalAlpha = 1.0;
    ctx.globalCompositeOperation = 'source-over';

    requestAnimationFrame(animate);
}

animate();