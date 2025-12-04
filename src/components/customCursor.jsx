import { useEffect, useState } from "react";

function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setVisible(true);
    };

    const handleLeave = () => {
      setVisible(false);
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseleave", handleLeave);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  const { x, y } = position;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] hidden md:block">
      <div
        className="custom-cursor"
        style={{
          transform: `translate3d(${x}px, ${y}px, 0)`,
          opacity: visible ? 1 : 0,
        }}
      >
        <div className="custom-cursor-inner" />
      </div>
    </div>
  );
}

export default CustomCursor;


