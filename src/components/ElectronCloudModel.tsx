import React, { useState } from "react";
import { Atom, Layers, Sparkles, HelpCircle, X } from "lucide-react";

interface ElectronCloudModelProps {
  onClose?: () => void;
}

export function ElectronCloudModel(props: ElectronCloudModelProps) {
  const { onClose } = props;
  const [activeModel, setActiveModel] = useState<"modern" | "bohr">("modern");

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950 border-2 border-cyan-500/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden text-slate-100" id="electron-cloud-card">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle,rgba(6,182,212,0.15),transparent_70%)] pointer-events-none"></div>

      {/* Card Header */}
      <div className="flex items-center justify-between border-b border-cyan-800/40 pb-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-950/80 rounded-xl border border-cyan-500/40 text-cyan-400">
            <Atom className="w-6 h-6 animate-spin text-cyan-400" style={{ animationDuration: "1s" }} />
          </div>
          <div>
            <h3 className="text-base md:text-lg font-black text-white uppercase tracking-tight">
              Mô Hình Thực Nghiệm Nguyên Tử
            </h3>
            <p className="text-xs text-slate-400 font-medium">Trực quan hóa cấu trúc vỏ hạt nhân tốc độ cực cao</p>
          </div>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-all cursor-pointer"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Model Selector Tabs */}
      <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-xl border border-slate-880 mb-4 select-none">
        <button
          type="button"
          onClick={() => setActiveModel("modern")}
          className={`py-2 px-3 rounded-lg text-xs md:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeModel === "modern"
              ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/15"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Sparkles className="w-4 h-4 animate-pulse" />
          <span>Đám Mây Hiện Đại (90%)</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveModel("bohr")}
          className={`py-2 px-3 rounded-lg text-xs md:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeModel === "bohr"
              ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/15"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Quỹ Đạo Bohr (Cổ Điển)</span>
        </button>
      </div>

      {/* Interative Visualized SVG Plane */}
      <div className="w-full h-64 bg-slate-950 rounded-2xl border border-slate-850 relative flex items-center justify-center overflow-hidden mb-4 select-none">
        
        {/* Ambient Grid for sci-fi look */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.02)_1px,transparent_1px)] bg-[size:16px_16px]"></div>

        {/* 1. NUCLEUS (Shared central nucleus simulation) */}
        <div className="absolute z-20 flex flex-wrap items-center justify-center w-10 h-10 bg-slate-900/95 rounded-full border-2 border-yellow-500/50 shadow-[0_0_20px_rgba(234,179,8,0.35)]">
          {/* Protons: Red, Neutrons: Yellow spheres */}
          <div className="grid grid-cols-2 gap-0.5 p-1 animate-pulse" style={{ animationDuration: "0.2s" }}>
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 ring-1 ring-rose-400 text-[6px] font-black flex items-center justify-center text-white" title="Proton (p)">+</span>
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 ring-1 ring-yellow-350" title="Neutron (n)"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 ring-1 ring-yellow-350" title="Neutron (n)"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 ring-1 ring-rose-400 text-[6px] font-black flex items-center justify-center text-white" title="Proton (p)">+</span>
          </div>
          {/* Core glow label */}
          <span className="absolute -bottom-5 text-[9px] font-black text-yellow-500 uppercase font-mono tracking-widest bg-slate-950/80 px-1 rounded border border-yellow-500/20">
            HẠT NHÂN
          </span>
        </div>

        {/* 2. ELECTRON RENDER - MODERN QUANTUM PROBABILITY CLOUD */}
        {activeModel === "modern" && (
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Blurry quantum shells representing high density areas - SCIENTIFIC SPEED INCREASED TO FAST PULSE/SPIN */}
            <div className="absolute w-28 h-28 rounded-full bg-[radial-gradient(circle,rgba(6,182,212,0.35)_0%,transparent_70%)] animate-pulse" style={{ animationDuration: "0.25s" }}></div>
            <div className="absolute w-44 h-44 rounded-full bg-[radial-gradient(circle,rgba(6,182,212,0.2)_0%,transparent_75%)] animate-pulse" style={{ animationDuration: "0.35s" }}></div>
            <div className="absolute w-56 h-56 rounded-full border border-cyan-500/20 bg-[radial-gradient(circle,rgba(99,102,241,0.15)_0%,transparent_80%)] animate-spin" style={{ animationDuration: "1.2s" }}></div>

            {/* Electron Probability Dots with ultra-rapid blink delay representing particles in infinite speed state */}
            <svg className="absolute inset-0 w-full h-full text-cyan-400" viewBox="0 0 200 200">
              {/* Central high-probability core scatter dots */}
              <circle cx="100" cy="100" r="16" fill="none" stroke="rgba(6,182,212,0.3)" strokeDasharray="2,2" />
              
              {/* Electron density dot representations - fast delay & lightning duration ping */}
              {[
                { x: 92, y: 78 }, { x: 112, y: 84 }, { x: 104, y: 118 }, { x: 82, y: 95 },
                { x: 122, y: 106 }, { x: 108, y: 74 }, { x: 88, y: 110 }, { x: 116, y: 114 },
                { x: 68, y: 104 }, { x: 132, y: 94 }, { x: 102, y: 62 }, { x: 96, y: 138 },
                { x: 74, y: 82 }, { x: 126, y: 122 }, { x: 128, y: 74 }, { x: 72, y: 118 },
                { x: 58, y: 92 }, { x: 142, y: 108 }, { x: 105, y: 48 }, { x: 94, y: 152 },
                { x: 150, y: 86 }, { x: 52, y: 114 }, { x: 82, y: 56 }, { x: 118, y: 144 },
                { x: 144, y: 124 }, { x: 56, y: 76 }, { x: 135, y: 55 }, { x: 65, y: 145 },
              ].map((dot, idx) => (
                <circle
                  key={idx}
                  cx={dot.x}
                  cy={dot.y}
                  r="1.7"
                  className="fill-cyan-400 animate-ping"
                  style={{
                    animationDelay: `${idx * 0.02}s`,
                    animationDuration: `${0.12 + (idx % 3) * 0.04}s`
                  }}
                />
              ))}

              {/* Constant static dot probability density for visual weight */}
              {[
                { x: 84, y: 88 }, { x: 115, y: 92 }, { x: 98, y: 108 }, { x: 106, y: 88 },
                { x: 94, y: 102 }, { x: 110, y: 103 }, { x: 89, y: 115 }, { x: 118, y: 78 },
                { x: 128, y: 102 }, { x: 102, y: 128 }, { x: 72, y: 96 }, { x: 85, y: 72 },
                { x: 134, y: 86 }, { x: 64, y: 110 }, { x: 122, y: 132 }, { x: 78, y: 135 },
                { x: 114, y: 58 }, { x: 148, y: 112 }, { x: 50, y: 94 }, { x: 100, y: 38 },
                { x: 100, y: 162 }, { x: 38, y: 100 }, { x: 162, y: 100 }, { x: 138, y: 138 },
              ].map((dot, idx) => (
                <circle
                  key={`static-${idx}`}
                  cx={dot.x}
                  cy={dot.y}
                  r="1.3"
                  className="fill-cyan-300 ring-1 ring-cyan-500/50"
                />
              ))}
            </svg>
            
            <div className="absolute right-4 top-4 bg-cyan-950/90 border border-cyan-700/60 px-2.5 py-1 rounded text-[10px] font-mono font-bold text-cyan-400">
              ⚡ TỐC ĐỘ SÁT ÁNH SÁNG (~300,000 km/s)
            </div>
          </div>
        )}

        {/* 3. ELECTRON RENDER - BOHR CLASSICAL ORBITAL MODEL */}
        {activeModel === "bohr" && (
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Orbit rings: K, L, M Shells - SPEEDS DRAMATICALLY INCREASED TO MATCH SCIENTIFIC ENERGY EXCITATION */}
            <div className="absolute w-24 h-24 rounded-full border border-dashed border-cyan-500/30 animate-spin" style={{ animationDuration: "0.35s" }}>
              {/* Electron Node */}
              <span className="absolute top-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-cyan-300 ring-2 ring-cyan-400 shadow-[0_0_12px_#38bdf8] flex items-center justify-center text-[6px] font-extrabold text-slate-950">-</span>
            </div>
            
            <div className="absolute w-40 h-40 rounded-full border border-dashed border-cyan-500/20 animate-spin" style={{ animationDuration: "0.55s", animationDirection: "reverse" }}>
              {/* 2 Electrons */}
              <span className="absolute top-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-cyan-300 ring-2 ring-cyan-400 shadow-[0_0_12px_#38bdf8] flex items-center justify-center text-[6px] font-extrabold text-slate-950">-</span>
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-cyan-300 ring-2 ring-cyan-400 shadow-[0_0_12px_#38bdf8] flex items-center justify-center text-[6px] font-extrabold text-slate-950">-</span>
            </div>

            <div className="absolute w-52 h-52 rounded-full border border-dashed border-cyan-500/10 animate-spin" style={{ animationDuration: "0.8s" }}>
              {/* Electron */}
              <span className="absolute top-1/4 left-0 w-2.5 h-2.5 rounded-full bg-cyan-300 ring-2 ring-cyan-400 shadow-[0_0_12px_#38bdf8] flex items-center justify-center text-[6px] font-extrabold text-slate-950">-</span>
            </div>

            <div className="absolute right-4 top-4 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded text-[10px] font-mono font-bold text-slate-400">
              ⚡ CHUYỂN ĐỘNG TRÒN NĂNG LƯỢNG
            </div>
          </div>
        )}
      </div>

      {/* Educational Explanation Box - Increased font size, structured readability for back-of-class students */}
      <div className="p-4 bg-slate-950/90 border border-slate-805 rounded-2xl">
        <div className="flex items-start gap-3">
          <HelpCircle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-2">
            <h4 className="text-sm md:text-base font-extrabold text-amber-400 uppercase select-none">
              Ý Nghĩa Giáo Khoa Vật Lý - Hóa Học Lớp 10
            </h4>
            {activeModel === "modern" ? (
              <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-semibold">
                🎓 <strong className="text-cyan-400 uppercase">Mẫu hiện đại (Cơ học lượng tử)</strong>: Electron chuyển động cực kỳ nhanh trong vùng không gian bao quanh hạt nhân, tạo ra một <strong className="text-white">đám mây electron</strong>. Mật độ chấm sáng thể hiện xác suất bắt gặp electron (vùng đậm có xác suất cao nhất tới <strong className="text-cyan-400">90%</strong>).
              </p>
            ) : (
              <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-semibold">
                🎓 <strong className="text-cyan-400 uppercase">mẫu Bohr cổ điển</strong>: Electron chuyển động với vận tốc cực kì cao trên những <strong className="text-white">quỹ đạo tròn đồng tâm</strong> xác định riêng biệt, tương tự các hành tinh xoay xung quanh Mặt Trời.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
