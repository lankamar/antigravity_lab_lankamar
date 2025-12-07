/**
 * Neural Network Animated Background
 * Creates floating neurons with connecting synapses
 */

class NeuralNetwork {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.neurons = [];
        this.numNeurons = 80;
        this.connectionDistance = 150;

        this.resize();
        this.init();
        this.animate();

        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        this.neurons = [];
        for (let i = 0; i < this.numNeurons; i++) {
            this.neurons.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1,
                pulse: Math.random() * Math.PI * 2
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Update and draw neurons
        this.neurons.forEach((neuron, i) => {
            // Move
            neuron.x += neuron.vx;
            neuron.y += neuron.vy;
            neuron.pulse += 0.02;

            // Bounce off edges
            if (neuron.x < 0 || neuron.x > this.canvas.width) neuron.vx *= -1;
            if (neuron.y < 0 || neuron.y > this.canvas.height) neuron.vy *= -1;

            // Draw connections (synapses)
            for (let j = i + 1; j < this.neurons.length; j++) {
                const other = this.neurons[j];
                const dx = other.x - neuron.x;
                const dy = other.y - neuron.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.connectionDistance) {
                    const opacity = (1 - distance / this.connectionDistance) * 0.3;
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(180, 100, 200, ${opacity})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.moveTo(neuron.x, neuron.y);
                    this.ctx.lineTo(other.x, other.y);
                    this.ctx.stroke();
                }
            }

            // Draw neuron (pulsing)
            const pulseSize = neuron.radius + Math.sin(neuron.pulse) * 0.5;
            this.ctx.beginPath();
            this.ctx.arc(neuron.x, neuron.y, pulseSize, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(200, 150, 255, 0.6)';
            this.ctx.fill();

            // Glow effect
            this.ctx.beginPath();
            this.ctx.arc(neuron.x, neuron.y, pulseSize + 2, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(200, 150, 255, 0.2)';
            this.ctx.fill();
        });

        requestAnimationFrame(() => this.animate());
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new NeuralNetwork('neural-canvas');
});
