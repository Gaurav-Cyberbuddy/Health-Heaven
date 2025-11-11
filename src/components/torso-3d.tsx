"use client";

export function Torso3D() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* 3D Torso Container */}
      <div 
        className="relative w-64 h-80 md:w-80 md:h-96"
        style={{ perspective: '1200px' }}
      >
        {/* Main 3D wrapper */}
        <div 
          className="relative w-full h-full animate-float-3d"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Torso outline - front layer */}
          <div 
            className="absolute inset-0"
            style={{
              transform: 'translateZ(20px)',
            }}
          >
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 200 300"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="drop-shadow-[0_0_30px_rgba(34,211,238,0.4)]"
            >
              {/* Torso outline */}
              <path
                d="M100 20 Q120 30 130 50 L135 80 Q140 120 135 160 L130 200 Q125 240 120 280 L80 280 Q75 240 70 200 L65 160 Q60 120 65 80 L70 50 Q80 30 100 20 Z"
                fill="url(#torsoGradient)"
                fillOpacity="0.3"
                stroke="url(#torsoStroke)"
                strokeWidth="2"
                className="transition-all duration-500"
              />
              
              {/* Rib cage outline */}
              <path
                d="M85 60 Q100 70 115 60 M85 90 Q100 100 115 90 M85 120 Q100 130 115 120"
                stroke="url(#torsoStroke)"
                strokeWidth="1.5"
                strokeOpacity="0.4"
                fill="none"
              />
              
              {/* Heart - glowing center */}
              <g transform="translate(100, 120)">
                <ellipse
                  cx="0"
                  cy="0"
                  rx="25"
                  ry="30"
                  fill="url(#heartGradient)"
                  fillOpacity="0.8"
                  className="animate-pulse-heart"
                  filter="url(#glow)"
                />
                {/* Heart highlight - red area */}
                <ellipse
                  cx="-8"
                  cy="0"
                  rx="12"
                  ry="15"
                  fill="url(#heartRed)"
                  fillOpacity="0.9"
                  className="animate-pulse-red"
                />
                {/* Heart chambers detail */}
                <path
                  d="M-15 -10 Q-8 -5 0 -10 Q8 -5 15 -10 Q8 0 0 10 Q-8 0 -15 -10"
                  fill="none"
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth="1"
                />
              </g>
              
              {/* Hand overlay - lower left */}
              <g transform="translate(70, 180) rotate(-20)">
                <ellipse
                  cx="0"
                  cy="0"
                  rx="20"
                  ry="35"
                  fill="url(#handGradient)"
                  fillOpacity="0.25"
                  stroke="url(#torsoStroke)"
                  strokeWidth="1.5"
                />
                {/* Fingers */}
                <ellipse cx="-8" cy="-15" rx="3" ry="12" fill="url(#handGradient)" fillOpacity="0.3" />
                <ellipse cx="0" cy="-18" rx="3" ry="14" fill="url(#handGradient)" fillOpacity="0.3" />
                <ellipse cx="8" cy="-15" rx="3" ry="12" fill="url(#handGradient)" fillOpacity="0.3" />
              </g>
              
              <defs>
                <linearGradient id="torsoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.4" />
                  <stop offset="50%" stopColor="#7c3aed" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.4" />
                </linearGradient>
                
                <linearGradient id="torsoStroke" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#a855f7" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.8" />
                </linearGradient>
                
                <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity="1" />
                  <stop offset="50%" stopColor="#7c3aed" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#22d3ee" stopOpacity="1" />
                </linearGradient>
                
                <linearGradient id="heartRed" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="1" />
                  <stop offset="100%" stopColor="#dc2626" stopOpacity="0.9" />
                </linearGradient>
                
                <linearGradient id="handGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.2" />
                </linearGradient>
                
                <filter id="glow">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
            </svg>
          </div>
          
          {/* Back layer - subtle depth */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              transform: 'translateZ(-20px) rotateY(180deg)',
            }}
          >
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 200 300"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 20 Q120 30 130 50 L135 80 Q140 120 135 160 L130 200 Q125 240 120 280 L80 280 Q75 240 70 200 L65 160 Q60 120 65 80 L70 50 Q80 30 100 20 Z"
                fill="url(#torsoGradientBack)"
                fillOpacity="0.2"
              />
              <defs>
                <linearGradient id="torsoGradientBack" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.2" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
        
        {/* Pulse rings from heart */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-cyan-400/30 rounded-full animate-pulse-ring-heart pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 border-2 border-violet-400/20 rounded-full animate-pulse-ring-heart-2 pointer-events-none" />
      </div>
    </div>
  );
}

