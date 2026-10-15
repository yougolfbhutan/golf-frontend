"use client";

import { useState, ButtonHTMLAttributes } from "react";

interface RippleWaveButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  enableWave?: boolean;
  enableRipple?: boolean;
  className?: string;
}

export const RippleWaveButton = ({
  children,
  enableWave = true,
  enableRipple = true,
  className = "",
  onClick,
  disabled,
  ...props
}: RippleWaveButtonProps) => {
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);

  const addRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!enableRipple) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now() + Math.random();

    setRipples((prev) => [...prev, { x, y, id }]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 600);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    addRipple(e);
    onClick?.(e);
  };

  return (
    <button
      {...props}
      disabled={disabled}
      onClick={handleClick}
      className={`relative overflow-hidden bg-[#10B759] text-white
        shadow-md shadow-[#10B759]/30 transition-all duration-200
        hover:bg-[#0E9F4F] hover:shadow-lg
        focus:outline-none focus-visible:ring-4 focus-visible:ring-[#10B759]/30
        disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none
        ${className}`}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>

      {enableWave && <span className="wave-overlay" />}

      {enableRipple &&
        ripples.map((ripple) => (
          <span
            key={ripple.id}
            className="pointer-events-none absolute"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: "10px",
              height: "10px",
              transform: "translate(-50%, -50%) scale(0)",
              borderRadius: "50%",
              backgroundColor: "rgba(255, 255, 255, 0.45)",
              animation: "ripple-animation 600ms ease-out",
            }}
          />
        ))}

      <style jsx>{`
        @keyframes ripple-animation {
          to {
            transform: translate(-50%, -50%) scale(50);
            opacity: 0;
          }
        }

        @keyframes wave-overlay {
          0% {
            transform: translateX(-100%) skewX(-15deg);
            opacity: 0;
          }
          50% { opacity: 0.3; }
          100% {
            transform: translateX(100%) skewX(-15deg);
            opacity: 0;
          }
        }

        .wave-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.4),
            transparent
          );
          animation: wave-overlay 2.5s ease-in-out infinite;
          pointer-events: none;
        }

        @media (prefers-reduced-motion: reduce) {
          .wave-overlay {
            animation: none;
          }
        }
      `}</style>
    </button>
  );
};