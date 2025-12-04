import { useEffect, useRef, useState } from "react";

function SineGame() {
  const canvasRef = useRef(null);
  const [isRunning, setIsRunning] = useState(false);
  const [message, setMessage] = useState("Press SPACE to Start!");

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Match canvas to full Resume section size
    const section = canvas.parentElement;
    const width = (canvas.width = section.offsetWidth);
    const height = (canvas.height = section.offsetHeight);

    let player = { x: width / 2, y: 50, r: 10 };
    let speedY = 2.2;
    let moveX = 0;
    const moveSpeed = 4;

    const finishY = height - 100;
    const obstacles = [];

    // Random obstacles throughout section
    for (let i = 300; i < finishY; i += 250) {
      const gapX = Math.random() * (width - 150);
      obstacles.push({
        y: i,
        x1: 0,
        w1: gapX - 50,
        x2: gapX + 100,
        w2: width - (gapX + 100),
        h: 20,
      });
    }

    let animationId;
    let scrollY = 0;

    function handleKeyDown(e) {
      if (e.key === "ArrowLeft") moveX = -moveSpeed;
      if (e.key === "ArrowRight") moveX = moveSpeed;
      if (e.key === " " && !isRunning) {
        setIsRunning(true);
        setMessage("");
      }
    }

    function handleKeyUp(e) {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") moveX = 0;
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    function draw() {
      ctx.clearRect(0, 0, width, height);

      // Move player
      player.y += speedY;
      player.x += moveX;

      // Keep player within screen
      if (player.x < player.r) player.x = player.r;
      if (player.x > width - player.r) player.x = width - player.r;

      // Auto scroll screen with player
      window.scrollTo({
        top: section.offsetTop + player.y - window.innerHeight / 2,
        behavior: "smooth",
      });

      // Background
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, width, height);

      // Draw finish
      ctx.fillStyle = "limegreen";
      ctx.fillRect(0, finishY, width, 30);

      // Obstacles
      ctx.fillStyle = "crimson";
      obstacles.forEach((o) => {
        ctx.fillRect(o.x1, o.y, o.w1, o.h);
        ctx.fillRect(o.x2, o.y, o.w2, o.h);
      });

      // Player
      ctx.beginPath();
      ctx.arc(player.x, player.y, player.r, 0, Math.PI * 2);
      ctx.fillStyle = "white";
      ctx.fill();

      // Collisions
      for (let o of obstacles) {
        if (
          player.y + player.r > o.y &&
          player.y - player.r < o.y + o.h &&
          (player.x - player.r < o.w1 || player.x + player.r > o.x2)
        ) {
          cancelAnimationFrame(animationId);
          setIsRunning(false);
          setMessage("💥 Game Over! Press SPACE to Restart");
          return;
        }
      }

      // Finish line
      if (player.y >= finishY) {
        cancelAnimationFrame(animationId);
        setIsRunning(false);
        setMessage("🏁 You Win!");
        return;
      }

      animationId = requestAnimationFrame(draw);
    }

    if (isRunning) {
      player = { x: width / 2, y: 50, r: 10 };
      animationId = requestAnimationFrame(draw);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      cancelAnimationFrame(animationId);
    };
  }, [isRunning]);

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
      />
      <p className="absolute top-4 left-1/2 -translate-x-1/2 text-lg text-white bg-slate-800/70 px-4 py-1 rounded-md">
        {message}
      </p>
    </div>
  );
}

export default SineGame;
