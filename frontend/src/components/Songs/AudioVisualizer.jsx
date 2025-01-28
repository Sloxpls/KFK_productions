import { useEffect } from "react";

const AudioVisualizer = ({ audioRef }) => {
  useEffect(() => {
    if (!audioRef.current) {
      console.error("Audio element not found!");
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.zIndex = "-1";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.pointerEvents = "none";
    canvas.style.backgroundColor = "transparent";
    document.body.appendChild(canvas);

    const ctx = canvas.getContext("2d");

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaElementSource(audioRef.current);
    source.connect(analyser);
    analyser.connect(audioContext.destination);

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = 600;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i] / 2;

        const gradient = ctx.createLinearGradient(
          x,
          canvas.height - barHeight,
          x + barWidth,
          canvas.height
        );
        gradient.addColorStop(0.5, "red");
        gradient.addColorStop(1, "blue");

        ctx.fillStyle = gradient;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        x += barWidth + 1;
      }

      requestAnimationFrame(draw);
    };

    draw();

    return () => {
      // Clean up the canvas and audio context
      window.removeEventListener("resize", resizeCanvas);
      document.body.removeChild(canvas);
      audioContext.close();
    };
  }, [audioRef]);

  return null;
};

export default AudioVisualizer;
