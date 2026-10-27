"use client";

import { useEffect } from 'react';
import { ArrowDown, Sliders } from 'lucide-react';
import { StudioConfigurator } from '@/components/ui/StudioConfigurator';

export default function Home() {
  useEffect(() => {
    // Trigger GSAP initialization when Home page mounts
    if (typeof window !== 'undefined' && (window as any).init3DScrollAnimations) {
      (window as any).init3DScrollAnimations();
    }
  }, []);

  return (
    <div className="w-full">
      <div id="view-home" className="spa-view active relative z-10 w-full overflow-hidden">
        
        {/*  Left Side Floating Navigation (Prevents Studio Collisions)  */}
        <div className="fixed left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 hidden lg:flex flex-col items-center space-y-5 pointer-events-none">
            <a href="#hero" className="group relative flex items-center pointer-events-auto">
                <div className="w-3 h-3 rounded-full border border-white/40 bg-black/50 group-hover:border-burgundy-bright group-hover:bg-burgundy-bright transition-all shadow-md"></div>
                <span className="absolute left-7 text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity bg-black/90 px-2.5 py-1 rounded-md border border-white/10 whitespace-nowrap text-gray-300 shadow-xl pointer-events-none">01 // Front Overview</span>
            </a>
            <a href="#fabric" className="group relative flex items-center pointer-events-auto">
                <div className="w-3 h-3 rounded-full border border-white/40 bg-black/50 group-hover:border-burgundy-bright group-hover:bg-burgundy-bright transition-all shadow-md"></div>
                <span className="absolute left-7 text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity bg-black/90 px-2.5 py-1 rounded-md border border-white/10 whitespace-nowrap text-gray-300 shadow-xl pointer-events-none">02 // 450GSM Cotton</span>
            </a>
            <a href="#graphics" className="group relative flex items-center pointer-events-auto">
                <div className="w-3 h-3 rounded-full border border-white/40 bg-black/50 group-hover:border-burgundy-bright group-hover:bg-burgundy-bright transition-all shadow-md"></div>
                <span className="absolute left-7 text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity bg-black/90 px-2.5 py-1 rounded-md border border-white/10 whitespace-nowrap text-gray-300 shadow-xl pointer-events-none">03 // Back Emblem</span>
            </a>
            <a href="#details" className="group relative flex items-center pointer-events-auto">
                <div className="w-3 h-3 rounded-full border border-white/40 bg-black/50 group-hover:border-burgundy-bright group-hover:bg-burgundy-bright transition-all shadow-md"></div>
                <span className="absolute left-7 text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity bg-black/90 px-2.5 py-1 rounded-md border border-white/10 whitespace-nowrap text-gray-300 shadow-xl pointer-events-none">04 // Rib Cuffs</span>
            </a>
            <a href="#studio" className="group relative flex items-center pointer-events-auto">
                <div className="w-3 h-3 rounded-full border border-white/40 bg-black/50 group-hover:border-burgundy-bright group-hover:bg-burgundy-bright transition-all shadow-md"></div>
                <span className="absolute left-7 text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity bg-black/90 px-2.5 py-1 rounded-md border border-white/10 whitespace-nowrap text-gray-300 shadow-xl pointer-events-none">05 // 3D Studio</span>
            </a>
        </div>

        {/*  1. Hero Overview Section  */}
        <section id="hero" className="story-section px-4 sm:px-8 md:px-12 lg:px-16 justify-center text-center">
            <div className="max-w-4xl w-full mx-auto flex flex-col items-center">
                <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full glass-panel border border-burgundy-bright/40 text-burgundy-bright text-[10px] sm:text-xs font-mono mb-4 sm:mb-6">
                    <span className="w-2 h-2 rounded-full bg-burgundy-bright animate-ping"></span>
                    <span className="font-bold tracking-wider uppercase">AUTUMN / WINTER 2026</span>
                </div>
                <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black font-display tracking-tight text-white mb-4 sm:mb-6 uppercase leading-tight sm:leading-none">
                    BURGUNDY <br/>
                    <span className="bg-gradient-to-r from-white via-burgundy-bright to-red-600 bg-clip-text text-transparent">HEAVYWEIGHT</span>
                </h1>
                <p className="text-gray-300 text-xs sm:text-sm md:text-base max-w-xl mx-auto font-light leading-relaxed mb-6 sm:mb-8 px-2">
                    Engineered from bespoke 450GSM French terry cotton. Scroll to inspect structural seams, silicone puff embroidery, and tactile double-rib construction.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto">
                    <a href="#fabric" className="w-full sm:w-auto glass-btn px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl font-mono text-xs tracking-widest text-white flex items-center justify-center space-x-2 border-white/20">
                        <span>EXPLORE DETAILS</span>
                        <i data-lucide="arrow-down" className="w-4 h-4 text-burgundy-bright"></i>
                    </a>
                    <a href="#studio" className="w-full sm:w-auto bg-gradient-to-r from-burgundy-accent to-burgundy-bright hover:from-burgundy-bright hover:to-red-600 text-white font-bold px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl font-mono text-xs tracking-widest flex items-center justify-center space-x-2 shadow-xl shadow-burgundy-accent/30 transition-all">
                        <i data-lucide="sliders" className="w-4 h-4"></i>
                        <span>LAUNCH 3D STUDIO</span>
                    </a>
                </div>
            </div>
        </section>

        {/*  2. Fabric & Hood Details  */}
        <section id="fabric" className="story-section px-4 sm:px-8 md:px-12 lg:px-16 justify-start items-end md:items-center">
            <div id="card-fabric" className="w-full max-w-md lg:max-w-lg glass-panel p-5 sm:p-7 md:p-8 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-2xl">
                <div className="flex items-center space-x-2 text-[10px] sm:text-xs font-mono text-burgundy-bright uppercase tracking-widest font-bold mb-1.5">
                    <i data-lucide="shield-check" className="w-4 h-4"></i>
                    <span>01 // MATERIAL ARCHITECTURE</span>
                </div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold font-display text-white mb-2 sm:mb-3">450 GSM FRENCH TERRY</h2>
                <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-4">
                    High-density looped back cotton dyed in signature deep burgundy. Features a structured double-layer hood that maintains its shape without drooping.
                </p>
                <div className="space-y-2.5 border-t border-white/10 pt-4">
                    <div className="flex items-center space-x-2.5 text-xs text-gray-300 font-mono">
                        <i data-lucide="check" className="w-4 h-4 text-burgundy-bright flex-shrink-0"></i>
                        <span>Zero synthetic blends (100% organic cotton)</span>
                    </div>
                    <div className="flex items-center space-x-2.5 text-xs text-gray-300 font-mono">
                        <i data-lucide="check" className="w-4 h-4 text-burgundy-bright flex-shrink-0"></i>
                        <span>Solid gunmetal drawcord aglets</span>
                    </div>
                    <div className="flex items-center space-x-2.5 text-xs text-gray-300 font-mono">
                        <i data-lucide="check" className="w-4 h-4 text-burgundy-bright flex-shrink-0"></i>
                        <span>Custom pre-shrunk wash treatment</span>
                    </div>
                </div>
            </div>
        </section>

        {/*  3. Back Print Graphic  */}
        <section id="graphics" className="story-section px-4 sm:px-8 md:px-12 lg:px-16 justify-end items-end md:items-center">
            <div id="card-graphics" className="w-full max-w-md lg:max-w-lg glass-panel p-5 sm:p-7 md:p-8 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-2xl text-left md:text-right">
                <div className="flex items-center md:justify-end space-x-2 mb-1.5 text-[10px] sm:text-xs font-mono text-burgundy-bright uppercase tracking-widest font-bold">
                    <span>02 // HIGH-DENSITY PRINT</span>
                    <i data-lucide="sparkles" className="w-4 h-4"></i>
                </div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold font-display text-white mb-2 sm:mb-3">SILICONE PUFF INSIGNIA</h2>
                <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-4">
                    Multi-pass high-density silicone print applied with thermal pressure for raised relief and extreme flexibility that will never crack.
                </p>
                <div className="grid grid-cols-2 gap-2.5 border-t border-white/10 pt-4 text-left">
                    <div className="bg-black/60 p-3 rounded-xl border border-white/10">
                        <div className="text-[9px] sm:text-[10px] font-mono text-gray-400">FINISH</div>
                        <div className="text-xs font-bold text-white mt-0.5">Matte Tactile Puff</div>
                    </div>
                    <div className="bg-black/60 p-3 rounded-xl border border-white/10">
                        <div className="text-[9px] sm:text-[10px] font-mono text-gray-400">RESISTANCE</div>
                        <div className="text-xs font-bold text-burgundy-bright mt-0.5">High Elasticity</div>
                    </div>
                </div>
            </div>
        </section>

        {/*  4. Stitching & Cuffs  */}
        <section id="details" className="story-section px-4 sm:px-8 md:px-12 lg:px-16 justify-start items-end md:items-center">
            <div id="card-details" className="w-full max-w-md lg:max-w-lg glass-panel p-5 sm:p-7 md:p-8 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-2xl">
                <div className="flex items-center space-x-2 text-[10px] sm:text-xs font-mono text-burgundy-bright uppercase tracking-widest font-bold mb-1.5">
                    <i data-lucide="scissors" className="w-4 h-4"></i>
                    <span>03 // TAILORING PRECISION</span>
                </div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold font-display text-white mb-2 sm:mb-3">REINFORCED FLATLOCK SEAMS</h2>
                <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-4">
                    Heavyweight 2x2 ribbed cuffs with 5% elastane memory blend. Double-needle flatlock construction along arms, shoulder drop, and hem.
                </p>
                <div className="flex items-center justify-between bg-black/60 p-3 sm:p-4 rounded-xl border border-white/10">
                    <div>
                        <div className="text-[9px] sm:text-[10px] font-mono text-gray-400">HEAVYWEIGHT CUFFS</div>
                        <div className="text-xs font-bold text-white">550GSM 2x2 Rib Weave</div>
                    </div>
                    <span className="px-2.5 py-1 bg-burgundy-bright/20 text-burgundy-bright border border-burgundy-bright/30 rounded-full text-[10px] font-mono font-bold">SNAG-FREE</span>
                </div>
            </div>
        </section>

        {/*  5. Interactive 3D Studio Configurator  */}
        <section id="studio" className="story-section px-4 sm:px-6 md:px-12 lg:px-16 justify-center lg:justify-end items-end md:items-center pb-8">
            <StudioConfigurator />

            {/*  Orbit Hint Tooltip  */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none text-[11px] font-mono text-gray-300 flex items-center space-x-2 bg-black/80 px-3.5 py-1.5 rounded-full border border-white/10 backdrop-blur-md z-20 whitespace-nowrap">
                <i data-lucide="move" className="w-3.5 h-3.5 text-burgundy-bright animate-bounce"></i>
                <span>Drag to rotate 3D model freely in studio</span>
            </div>
        </section>
    </div>
    </div>
  );
}
