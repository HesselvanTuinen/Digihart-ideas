
import React, { useState, useRef } from 'react';
import { Hexagon, Cpu } from 'lucide-react';

const HologramHeader: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [reflectionPos, setReflectionPos] = useState({ x: 50, y: 50 });
  const [isInteracting, setIsInteracting] = useState(false);

  const handleInteraction = (clientX: number, clientY: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    // Calculate relative position (-1 to 1)
    const relX = ((clientX - rect.left) / rect.width) * 2 - 1;
    const relY = ((clientY - rect.top) / rect.height) * 2 - 1;

    // Set tilt rotation (max 18 degrees for more drama)
    setRotation({
      x: -relY * 18,
      y: relX * 18
    });

    // Set reflection position for the light streak (0 to 100)
    setReflectionPos({
      x: ((clientX - rect.left) / rect.width) * 100,
      y: ((clientY - rect.top) / rect.height) * 100
    });
    
    setIsInteracting(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleInteraction(e.clientX, e.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches[0]) {
      handleInteraction(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
    setReflectionPos({ x: 50, y: 50 });
    setIsInteracting(false);
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onMouseLeave={handleMouseLeave}
      className="w-full h-64 sm:h-72 md:h-80 relative flex items-center justify-center overflow-hidden bg-slate-100 dark:bg-slate-950 border-b border-cyan-500/30 touch-none"
    >
        {/* Dynamic Background Glow - Interactive */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none transition-opacity duration-700"
          style={{
            background: `radial-gradient(circle at ${reflectionPos.x}% ${reflectionPos.y}%, rgba(14, 165, 233, 0.5) 0%, transparent 60%)`
          }}
        ></div>

        {/* Interactive Holographic Light Beam Sweep */}
        <div 
          className="absolute inset-0 pointer-events-none mix-blend-color-dodge transition-opacity duration-1000"
          style={{
            background: `linear-gradient(115deg, transparent 0%, transparent 40%, rgba(14, 165, 233, 0.3) 47%, rgba(255, 255, 255, 0.6) 50%, rgba(14, 165, 233, 0.3) 53%, transparent 60%, transparent 100%)`,
            backgroundSize: '250% 100%',
            backgroundPosition: `${100 - reflectionPos.x}% 0%`,
            opacity: isInteracting ? 0.25 : 0.08,
            transition: 'background-position 0.3s ease-out, opacity 0.5s ease-in-out'
          }}
        ></div>

        {/* Neural Grid Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05] bg-[linear-gradient(rgba(14,165,233,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.2)_1px,transparent_1px)] bg-[length:40px_40px]"></div>

        {/* Scanning Lines Overlay with subtle movement */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.08] bg-[linear-gradient(rgba(14,165,233,0.1)_1px,transparent_1px)] bg-[length:100%_3px] animate-pulse"></div>

        {/* Bottom Horizon Line with Bloom */}
        <div className="absolute bottom-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent shadow-[0_0_25px_#0ea5e9]"></div>
        
        <div className="hologram-container relative z-10 text-center select-none perspective-[1500px] w-full px-4">
            <div 
              className="hologram-element flex flex-col items-center justify-center space-y-4 sm:space-y-6 transition-transform duration-300 ease-out transform-gpu"
              style={{
                transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
                transformStyle: 'preserve-3d'
              }}
            >
                {/* 3D Floating Icon Section */}
                <div className="relative group cursor-pointer" style={{ transform: 'translateZ(40px) sm:translateZ(60px)' }}>
                    <div className="absolute inset-0 bg-cyan-500/20 blur-2xl rounded-full scale-150 animate-pulse"></div>
                    <Hexagon 
                      className="text-cyan-600 dark:text-cyan-400 transition-transform duration-700 w-20 h-20 sm:w-28 sm:h-28" 
                      style={{ transform: `rotateZ(${rotation.y * 1.5}deg)` }}
                      strokeWidth={1} 
                    />
                    <Cpu className="text-pink-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse shadow-[0_0_15px_rgba(236,72,153,0.5)] w-8 h-8 sm:w-11 sm:h-11" />
                </div>
                
                {/* Interactive Holographic Title */}
                <div className="relative" style={{ transform: 'translateZ(60px) sm:translateZ(100px)' }}>
                    {/* Chromatic Aberration Layer - Cyan (Parallax) */}
                    <h1 
                      className={`font-display text-4xl sm:text-6xl md:text-7xl font-black absolute inset-0 text-cyan-400 opacity-0 transition-opacity pointer-events-none mix-blend-screen whitespace-nowrap ${isInteracting ? 'animate-glitch' : ''}`}
                      style={{ 
                        transform: `translateX(${rotation.y * 0.4}px) translateY(${rotation.x * 0.4}px)`,
                        opacity: isInteracting ? 0.4 : 0
                      }}
                    >
                        DigiHart.nl
                    </h1>

                    {/* Chromatic Aberration Layer - Magenta (Opposite Parallax) */}
                    <h1 
                      className={`font-display text-4xl sm:text-6xl md:text-7xl font-black absolute inset-0 text-pink-500 opacity-0 transition-opacity pointer-events-none mix-blend-screen whitespace-nowrap ${isInteracting ? 'animate-glitch' : ''}`}
                      style={{ 
                        transform: `translateX(${rotation.y * -0.4}px) translateY(${rotation.x * -0.4}px)`,
                        opacity: isInteracting ? 0.4 : 0
                      }}
                    >
                        DigiHart.nl
                    </h1>
                    
                    {/* Main Title with Gradient and Interaction-Driven Sweep */}
                    <h1 className={`font-display text-4xl sm:text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 neon-text-blue tracking-tighter relative z-10 drop-shadow-[0_0_8px_rgba(14,165,233,0.3)] whitespace-nowrap ${isInteracting ? 'animate-glitch' : ''}`}>
                        DigiHart.nl
                        {/* Interactive Light Shimmer Sweep */}
                        <span 
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent mix-blend-overlay pointer-events-none opacity-0"
                          style={{
                            transform: `translateX(${(reflectionPos.x - 50) * 2.2}%)`,
                            opacity: isInteracting ? 1 : 0,
                            transition: 'transform 0.15s cubic-bezier(0.33, 1, 0.68, 1), opacity 0.3s'
                          }}
                        ></span>
                    </h1>

                    <p className="mt-2 sm:mt-3 text-cyan-700 dark:text-cyan-300/90 text-[10px] sm:text-[13px] font-black tracking-[0.2em] sm:tracking-[0.4em] uppercase opacity-90 transition-all duration-300" style={{ transform: 'translateZ(30px) sm:translateZ(40px)' }}>
                        Deel je idee en kom in gesprek!
                    </p>
                    
                    <div className="flex items-center justify-center space-x-2 sm:space-x-3 mt-2 opacity-40 transition-opacity" style={{ transform: 'translateZ(15px) sm:translateZ(20px)' }}>
                        <div className="h-px w-6 sm:w-10 bg-gradient-to-r from-transparent to-slate-400"></div>
                        <p className="text-slate-400 text-[7px] sm:text-[9px] font-mono tracking-[0.3em] sm:tracking-[0.5em] uppercase">
                            Neural Innovation Network // Ver. 2.5
                        </p>
                        <div className="h-px w-6 sm:w-10 bg-gradient-to-l from-transparent to-slate-400"></div>
                    </div>
                </div>
            </div>
            
            {/* Background Digital Floating Particles (Subtle) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] pointer-events-none z-[-1]">
              <div 
                className="w-full h-full opacity-10 transition-transform duration-1000"
                style={{ transform: `rotateZ(${rotation.y * 0.1}deg) scale(${1 + Math.abs(rotation.y) * 0.005})` }}
              >
                {[...Array(6)].map((_, i) => (
                  <div 
                    key={i} 
                    className="absolute rounded-full bg-cyan-500 blur-xl"
                    style={{
                      width: `${Math.random() * 30 + 10}px`,
                      height: `${Math.random() * 30 + 10}px`,
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      opacity: Math.random() * 0.5 + 0.2
                    }}
                  />
                ))}
              </div>
            </div>
        </div>
    </div>
  );
};

export default HologramHeader;
