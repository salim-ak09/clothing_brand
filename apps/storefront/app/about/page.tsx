import { Layers, Recycle, Cpu } from 'lucide-react';

export default function About() {
  return (
    <div className="pt-24 sm:pt-28 pb-16 px-4 sm:px-6 md:px-10 max-w-5xl mx-auto min-h-screen">
      <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full glass-panel border border-burgundy-bright/40 text-burgundy-bright text-xs font-mono mb-3">
          <span>ATELIER DISCIPLINE // EST. 2024</span>
        </div>
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black font-display uppercase tracking-tight text-white mb-4">
          THE ART OF <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-burgundy-bright via-red-500 to-white">TACTILE WEIGHT</span>
        </h1>
        <p className="text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed font-light">
          AETHER was founded to resist fast seasonal disposability. Every garment is an architectural inquiry into structural knitwear and heavy drape.
        </p>
      </div>

      {/* Philosophy Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-12">
        <div className="glass-card p-6 sm:p-7 rounded-3xl border border-white/10">
          <div className="w-10 h-10 rounded-xl bg-burgundy-accent/30 border border-burgundy-bright/40 flex items-center justify-center text-burgundy-bright mb-4">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="text-base sm:text-lg font-bold font-display text-white mb-2">450 GSM FRENCH TERRY</h3>
          <p className="text-gray-400 text-xs leading-relaxed">
            Custom-milled combed organic yarn with zero synthetic polymers. Retains a crisp silhouette throughout repeated wash cycles.
          </p>
        </div>
        <div className="glass-card p-6 sm:p-7 rounded-3xl border border-white/10">
          <div className="w-10 h-10 rounded-xl bg-burgundy-accent/30 border border-burgundy-bright/40 flex items-center justify-center text-burgundy-bright mb-4">
            <Recycle className="w-5 h-5" />
          </div>
          <h3 className="text-base sm:text-lg font-bold font-display text-white mb-2">CLOSED LOOP DYEING</h3>
          <p className="text-gray-400 text-xs leading-relaxed">
            Our custom deep burgundy pigment uses non-toxic reactive dyes with full closed-loop water treatment recycling at our mill.
          </p>
        </div>
        <div className="glass-card p-6 sm:p-7 rounded-3xl border border-white/10">
          <div className="w-10 h-10 rounded-xl bg-burgundy-accent/30 border border-burgundy-bright/40 flex items-center justify-center text-burgundy-bright mb-4">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-base sm:text-lg font-bold font-display text-white mb-2">3D DIGITAL CRAFT</h3>
          <p className="text-gray-400 text-xs leading-relaxed">
            We digitally prototype tension, seam resistance, and drape before cutting raw rolls, eliminating overproduction waste.
          </p>
        </div>
      </div>
    </div>
  );
}
