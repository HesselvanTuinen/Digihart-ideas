
import React from 'react';
import { Hexagon, Zap, Globe, Cpu } from 'lucide-react';

const HologramHeader: React.FC = () => {
  return (
    <div className="w-full h-72 relative flex items-center justify-center overflow-hidden bg-slate-100 dark:bg-slate-950 border-b border-cyan-500/30">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-500 via-transparent to-transparent"></div>
        </div>
        <div className="absolute bottom-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent shadow-[0_0_20px_#0ea5e9]"></div>
        
        <div className="hologram-container relative z-10 text-center">
            <div className="hologram-element flex flex-col items-center justify-center space-y-6">
                <div className="relative group cursor-pointer">
                    <Hexagon size={100} className="text-cyan-600 dark:text-cyan-400 group-hover:rotate-90 transition-transform duration-700" strokeWidth={1} />
                    <Cpu size={40} className="text-pink-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                </div>
                <div>
                    <h1 className="font-display text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 neon-text-blue tracking-tighter">
                        DigiHart.nl
                    </h1>
                    <p className="mt-2 text-cyan-700 dark:text-cyan-300/80 text-[12px] font-black tracking-widest uppercase">
                        Deel je idee en kom in gesprek!
                    </p>
                    <p className="mt-1 text-slate-400 text-[8px] font-mono tracking-[0.4em] uppercase opacity-50">
                        Neural Innovation Network // Ver. 2.5
                    </p>
                </div>
            </div>
        </div>
    </div>
  );
};

export default HologramHeader;
