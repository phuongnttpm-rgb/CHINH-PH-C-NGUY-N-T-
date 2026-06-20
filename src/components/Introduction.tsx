/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { AtomicBot } from "./AtomicBot";
import { soundEngine } from "../utils/SoundEngine";
import { Volume2, VolumeX, Sparkles, BookOpen, Layers, Zap, ArrowRight, Compass } from "lucide-react";

interface IntroductionProps {
  onStart: () => void;
  onWatchVideoComponent?: () => void;
  onWatchVideoShell?: () => void;
}

export const Introduction: React.FC<IntroductionProps> = ({ onStart, onWatchVideoComponent, onWatchVideoShell }) => {
  const [muted, setMuted] = useState<boolean>(true);

  const handleToggleMute = () => {
    const isMutedNow = soundEngine.toggleMute();
    setMuted(isMutedNow);
    if (!isMutedNow) {
      soundEngine.startMusic();
      soundEngine.playStageComplete();
    } else {
      soundEngine.stopMusic();
    }
  };

  const handleGameStart = () => {
    soundEngine.playWarp();
    onStart();
  };

  return (
    <div className="w-full max-w-[1550px] mx-auto px-4 py-4 md:py-10 text-slate-100 flex flex-col items-center justify-center relative min-h-[70vh]" id="intro-lobby">
      
      {/* Sound System Floating HUD */}
      <div className="absolute top-4 right-4 z-50">
        <button
          type="button"
          id="intro-volume-toggle"
          onClick={handleToggleMute}
          className="p-3 bg-slate-900/80 border border-slate-700/80 rounded-full hover:border-cyan-500 hover:text-cyan-400 transition-all shadow-xl flex items-center gap-2 cursor-pointer group active:scale-95"
        >
          {muted ? (
            <>
              <VolumeX className="w-5 h-5 text-slate-400 group-hover:text-amber-400" />
              <span className="text-xs font-bold leading-none pr-1 select-none">BẬT NHẠC EPIC</span>
            </>
          ) : (
            <>
              <Volume2 className="w-5 h-5 text-cyan-400 animate-pulse" />
              <span className="text-xs font-bold text-cyan-400 leading-none pr-1 select-none">ĐANG BẬT MUSIC</span>
            </>
          )}
        </button>
      </div>

      {/* Cyber Space visual decoration element */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[radial-gradient(circle,rgba(6,182,212,0.12),transparent_70%)] pointer-events-none"></div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center w-full z-10">
        
        {/* Left Core mascot column */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <AtomicBot
            stage={1}
            mood="talking"
            speechBubble="CHÀO CÁC PHI HÀNH GIA TRẺ! CÔ LÀ NGỌC PHƯỢNG. HÃY SẴN SÀNG CHINH PHỤC TRI THỨC CÙNG CÔ NHÉ!"
            className="w-full max-w-[360px] sm:max-w-[420px]"
          />
        </div>

        {/* Right Info lore description column */}
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-cyan-950 text-cyan-400 border border-cyan-800 rounded-full text-sm font-bold select-none uppercase tracking-widest mx-auto lg:mx-0">
              <Compass className="w-4 h-4" />
              <span>Cẩm Nang Khám Phá Hóa Học THPT</span>
            </div>
            
            {/* Title display */}
            <h1 className="text-4xl md:text-6xl font-black font-sans leading-tight text-white tracking-tight">
              HÀNH TRÌNH NGUYÊN TỬ:<br/>
              <span className="bg-gradient-to-r from-cyan-400 via-amber-400 to-rose-400 bg-clip-text text-transparent">
                TỪ KÝ ỨC ĐẾN TƯƠNG LAI
              </span>
            </h1>
          </div>

          <p className="text-lg md:text-xl leading-relaxed text-slate-300 max-w-2xl select-none mx-auto lg:mx-0 font-medium">
            Hệ thống trò chơi hóa liên hoàn giúp học sinh THPT củng cố, làm chủ toàn bộ nội dung lý thuyết, đặc tính đồng vị và kỹ năng giải toán phân tách hạt của chương Nguyên Tử.
          </p>

          {/* Three Steps Preview Panel */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4.5 mt-8 select-none">
            
            <div className="p-5 bg-slate-900 border border-slate-850 rounded-2xl text-left hover:border-cyan-500/20 transition-all">
              <div className="w-10 h-10 rounded-xl bg-cyan-950 text-cyan-400 flex items-center justify-center mb-3 border border-cyan-800">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-sm md:text-base font-extrabold text-white mb-2">Chặng 1: VNM Show</h3>
              <p className="text-xs md:text-sm text-slate-300 leading-snug font-medium">
                Phim trường ký ức vui vẻ củng cố cấu trúc hạt cơ bản, khối lượng vỏ và nhân nguyên tử.
              </p>
            </div>

            <div className="p-5 bg-slate-900 border border-slate-850 rounded-2xl text-left hover:border-rose-500/20 transition-all">
              <div className="w-10 h-10 rounded-xl bg-rose-950 text-rose-400 flex items-center justify-center mb-3 border border-rose-800">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-sm md:text-base font-extrabold text-white mb-2">Chặng 2: VNM Folk</h3>
              <p className="text-xs md:text-sm text-slate-300 leading-snug font-medium">
                Trực quan hóa kéo co học hỏi khái niệm đồng vị và tính toán khối lượng nguyên tử trung bình (amu).
              </p>
            </div>

            <div className="p-5 bg-slate-900 border border-slate-850 rounded-2xl text-left hover:border-amber-500/20 transition-all">
              <div className="w-10 h-10 rounded-xl bg-amber-950 text-amber-400 flex items-center justify-center mb-3 border border-amber-800">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-sm md:text-base font-extrabold text-white mb-2">Chặng 3: Advanced Lab</h3>
              <p className="text-xs md:text-sm text-slate-300 leading-snug font-medium">
                Vượt qua thách đố giải hệ phương trình số hạt tinh tế để cân bằng tinh hoa năng lượng lò phản ứng.
              </p>
            </div>

          </div>

          <div className="pt-6 flex flex-col xl:flex-row items-stretch xl:items-center gap-4 justify-center lg:justify-start w-full">
            <button
              type="button"
              id="lobby-start-button"
              onClick={handleGameStart}
              className="px-8 py-4 bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500 hover:from-cyan-300 hover:to-indigo-400 text-slate-950 font-black rounded-2xl text-base md:text-lg tracking-wider uppercase shadow-xl shadow-cyan-400/25 hover:scale-[1.03] active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer shrink-0"
            >
              <span>BẮT ĐẦU DU HÀNH</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              type="button"
              id="lobby-video-component-button"
              onClick={() => {
                soundEngine.playTing();
                onWatchVideoComponent?.();
              }}
              className="px-6 py-4 bg-slate-900 hover:bg-slate-800 border-2 border-amber-500 hover:border-amber-400 text-amber-400 font-extrabold rounded-2xl text-sm tracking-wide shadow-lg hover:scale-[1.03] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer text-center"
            >
              <span>1️⃣ THÀNH PHẦN NGUYÊN TỬ</span>
              <span className="text-base">🎬</span>
            </button>

            <button
              type="button"
              id="lobby-video-shell-button"
              onClick={() => {
                soundEngine.playTing();
                onWatchVideoShell?.();
              }}
              className="px-6 py-4 bg-slate-900 hover:bg-slate-800 border-2 border-cyan-500 hover:border-cyan-400 text-cyan-400 font-extrabold rounded-2xl text-sm tracking-wide shadow-lg hover:scale-[1.03] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer text-center"
            >
              <span>2️⃣ LỚP VỎ ELECTRON</span>
              <span className="text-base">⚡</span>
            </button>
            
            {muted && (
              <span className="text-xs text-slate-400 font-semibold italic animate-pulse xl:ml-2">
                ★ Hãy bật nhạc nền!
              </span>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
