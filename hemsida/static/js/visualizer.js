document.addEventListener('DOMContentLoaded', function () {
    const audioElement = document.getElementById('audio');
    if (!audioElement) {
        console.error("Audio element not found!");
        return;
    }
    const visualizer = new Visualizer(audioElement);
    visualizer.init();
});


class Visualizer {
    constructor(audioElement) {
        this.audioElement = audioElement;
        this.audioContext = null;
        this.analyser = null; // frequency data
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.animationId = null;
    }

    init() {
        this.setupAudioContext();
        this.setupCanvas();
        this.bindAudio();
    }

    setupAudioContext() {
        this.audioContext = new AudioContext();
        this.analyser = this.audioContext.createAnalyser();
    }

    setupCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = 200;
        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = 200;
        });
    }

    bindAudio() {
        const source = this.audioContext.createMediaElementSource(this.audioElement);
        source.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);
        this.startVisualization();
    }

    startVisualization() {
        const bufferLength = this.analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const draw = () => {
            this.analyser.getByteFrequencyData(dataArray);

            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            const barWidth = (this.canvas.width / bufferLength) * 2.5;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                const barHeight = dataArray[i] / 2;

                this.ctx.fillStyle = `rgba(221, 221, 221, 0.3)`;
                this.ctx.fillRect(x, this.canvas.height - barHeight, barWidth, barHeight);

                x += barWidth + 1;
            }

            this.animationId = requestAnimationFrame(draw);
        };

        draw();
    }
}
