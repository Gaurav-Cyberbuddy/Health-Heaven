"use client";

export function Heartbeat3D() {
  return (
    <div className="relative inline-flex items-center justify-center">
      {/* 3D Heart Container */}
      <div className="relative w-10 h-10 md:w-14 md:h-14" style={{ perspective: '1000px' }}>
        {/* Heart shape with 3D transform */}
        <div 
          className="relative w-full h-full animate-heartbeat-3d"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Front face */}
          <div 
            className="absolute inset-0"
            style={{
              transform: 'translateZ(8px)',
            }}
          >
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="drop-shadow-[0_0_12px_rgba(124,58,237,0.6)]"
            >
              <path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                fill="url(#heartGradient)"
                className="transition-all duration-300"
              />
              <defs>
                <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7c3aed" stopOpacity="1" />
                  <stop offset="50%" stopColor="#a855f7" stopOpacity="1" />
                  <stop offset="100%" stopColor="#22d3ee" stopOpacity="1" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          
          {/* Back face (subtle) */}
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              transform: 'translateZ(-8px) rotateY(180deg)',
            }}
          >
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                fill="url(#heartGradientBack)"
              />
              <defs>
                <linearGradient id="heartGradientBack" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.3" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
        
        {/* Pulse rings */}
        <div className="absolute inset-0 rounded-full border-2 border-cyan-400/40 animate-pulse-ring-1 pointer-events-none" />
        <div className="absolute inset-0 rounded-full border-2 border-violet-400/30 animate-pulse-ring-2 pointer-events-none" />
      </div>
    </div>
  );
}

