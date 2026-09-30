import { useState, ButtonHTMLAttributes } from 'react';

interface RippleWaveButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'danger' | 'primary';
  enableWave?: boolean;
  enableRipple?: boolean;
  className?: string;
}

export const RippleWaveButton = ({
  children,
  variant = 'default',
  enableWave = true,
  enableRipple = true,
  className = '',
  onClick,
  ...props
}: RippleWaveButtonProps) => {
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);

  const addRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!enableRipple) return;

    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();

    setRipples((prev) => [...prev, { x, y, id }]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== id));
    }, 600);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    addRipple(e);
    if (onClick) onClick(e);
  };

  const variantStyles = {
    default: 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white',
    success: 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white',
    danger: 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white',
    primary: 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white',
  };

  return (
    <button
      {...props}
      className={`relative overflow-hidden ${variantStyles[variant]} ${
        enableWave ? 'animate-wave-button' : ''
      } ${className}`}
      onClick={handleClick}
    >
      <span className="relative z-10">{children}</span>
      
      {enableWave && <span className="wave-overlay"></span>}
      
      {enableRipple && ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: '10px',
            height: '10px',
            transform: 'translate(-50%, -50%) scale(0)',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.6)',
            animation: 'ripple-animation 600ms ease-out',
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
        
        @keyframes wave-button {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        
        @keyframes wave-overlay {
          0% {
            transform: translateX(-100%) skewX(-15deg);
            opacity: 0;
          }
          50% {
            opacity: 0.3;
          }
          100% {
            transform: translateX(100%) skewX(-15deg);
            opacity: 0;
          }
        }
        
        .animate-wave-button {
          background-size: 200% 200%;
          animation: wave-button 3s ease infinite;
        }
        
        .wave-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
          animation: wave-overlay 2.5s ease-in-out infinite;
          pointer-events: none;
        }
      `}</style>
    </button>
  );
};