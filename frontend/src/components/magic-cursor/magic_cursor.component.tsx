import { useEffect, useRef } from "react";
import "./magic_cursor.css";

const MagicCursorComponent = () => {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let lastX = 0;
    let lastY = 0;
    let lastTime = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;

      if (glowRef.current && cursorRef.current) {
        glowRef.current.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
        cursorRef.current.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      }

      const now = performance.now();
      const distance = Math.hypot(x - lastX, y - lastY);

      // Drop sparkles more frequently for a dense trail
      if (distance > 10 && now - lastTime > 40) {
        const sparkle = document.createElement("span");
        sparkle.className = "magic-cursor-sparkle";
        sparkle.style.left = `${x}px`;
        sparkle.style.top = `${y}px`;
        document.body.appendChild(sparkle);

        // Keep them around longer (1200ms)
        setTimeout(() => {
          sparkle.remove();
        }, 1200);

        lastX = x;
        lastY = y;
        lastTime = now;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="magic-cursor-layer" aria-hidden="true">
      <div ref={glowRef} className="magic-cursor-glow" />
      <div ref={cursorRef} className="magic-cursor-dot" />
    </div>
  );
};

export default MagicCursorComponent;