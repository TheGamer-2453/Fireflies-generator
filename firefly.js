
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');

        
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const fireflies = [];

        // Firefly Class
        class Firefly {
            constructor(x, y, key) {
                this.x = x;
                this.y = y;
                this.key = key;
                
                
                this.size = Math.random() * 4 + 3;
                this.speedX = (Math.random() - 0.5) * 3;
                this.speedY = (Math.random() - 0.5) * 3 - 1; 
                
                
                this.maxLife = Math.random() * 100 + 100; 
                this.life = this.maxLife;
                this.alpha = 1;

                
                const hues = [50, 65, 80, 140]; 
                this.hue = hues[Math.floor(Math.random() * hues.length)];

                
                this.history = [];
            }

            update() {
                
                this.history.push({ x: this.x, y: this.y, size: this.size });
                if (this.history.length > 12) {
                    this.history.shift();
                }

               
                this.speedX += (Math.random() - 0.5) * 0.4;
                this.speedY += (Math.random() - 0.5) * 0.4;

                this.x += this.speedX;
                this.y += this.speedY;
                
                this.life--;
                this.alpha = this.life / this.maxLife;
                
                
                if (this.size > 0.2) this.size -= 0.01;
            }

            draw() {
                ctx.save();
                
                
                for (let i = 0; i < this.history.length; i++) {
                    const point = this.history[i];
                    
                    const trailRatio = i / this.history.length;
                    const trailAlpha = this.alpha * trailRatio * 0.4;
                    
                    ctx.fillStyle = `hsla(${this.hue}, 100%, 75%, ${trailAlpha})`;
                    ctx.beginPath();
                    ctx.arc(point.x, point.y, point.size * trailRatio, 0, Math.PI * 2);
                    ctx.fill();
                }
                
                
                ctx.shadowBlur = this.size * 4;
                ctx.shadowColor = `hsla(${this.hue}, 100%, 60%, ${this.alpha})`;
                
                
                ctx.fillStyle = `hsla(${this.hue}, 100%, 75%, ${this.alpha})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();

                
                ctx.shadowBlur = 0; // Don't blur the text
                ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha * 0.7})`;
                ctx.font = `bold ${this.size * 2.5}px sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(this.key, this.x, this.y - (this.size * 2));

                ctx.restore();
            }
        }

        // Capture keypress events
        window.addEventListener('keydown', (e) => {
            
            if (e.key.length > 1 && e.key !== 'Enter') return;

            
            let keyText = e.key;
            if (e.key === ' ') keyText = '␣';
            if (e.key === 'Enter') keyText = '↵';

            
            const randomX = Math.random() * (canvas.width * 0.8) + (canvas.width * 0.1);
            const randomY = Math.random() * (canvas.height * 0.8) + (canvas.height * 0.1);

            s
            for(let i = 0; i < 2; i++) {
                fireflies.push(new Firefly(randomX, randomY, keyText));
            }
        });

        // Animation Loop
        function animate() {
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);

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
    