/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { Introduction } from "./components/Introduction";
import { StageOne } from "./components/StageOne";
import { StageTwo } from "./components/StageTwo";
import { StageThree } from "./components/StageThree";
import { Leaderboard } from "./components/Leaderboard";
import { soundEngine } from "./utils/SoundEngine";
import { RefreshCw, Volume2, VolumeX, Timer, Star } from "lucide-react";
import { ElectronCloudModel } from "./components/ElectronCloudModel";

export default function App() {
  const [activeStage, setActiveStage] = useState<"lobby" | "stage1" | "stage2" | "stage3" | "leaderboard">("lobby");
  const [cumulativeScore, setCumulativeScore] = useState<number>(0);
  const [secondsSpent, setSecondsSpent] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isModelOpen, setIsModelOpen] = useState<boolean>(false);
  const [isVideoOpen, setIsVideoOpen] = useState<boolean>(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string>("https://www.youtube.com/embed/tu0X2mB4bs0?autoplay=1");
  const [currentVideoTitle, setCurrentVideoTitle] = useState<string>("Video Bài Giảng: Thành Phần Nguyên Tử");

  // Stopwatch ticking while actively playing stages
  useEffect(() => {
    let interval: any = null;
    const isPlaying = activeStage === "stage1" || activeStage === "stage2" || activeStage === "stage3";
    
    if (isPlaying) {
      interval = setInterval(() => {
        setSecondsSpent((prev) => prev + 1);
      }, 1000);
    } else {
      if (interval) clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeStage]);

  // Handle global sound mute state toggle
  const toggleGlobalMute = () => {
    const isMutedNow = soundEngine.toggleMute();
    setIsMuted(isMutedNow);
    if (!isMutedNow) {
      soundEngine.startMusic();
    } else {
      soundEngine.stopMusic();
    }
  };

  const handleStartGame = () => {
    setCumulativeScore(0);
    setSecondsSpent(0);
    setActiveStage("stage1");
  };

  const handleStageOneComplete = (scoreGained: number) => {
    setCumulativeScore((prev) => prev + scoreGained);
    setActiveStage("stage2");
  };

  const handleStageTwoComplete = (scoreGained: number) => {
    setCumulativeScore((prev) => prev + scoreGained);
    setActiveStage("stage3");
  };

  const handleStageThreeComplete = (scoreGained: number) => {
    setCumulativeScore((prev) => prev + scoreGained);
    setActiveStage("leaderboard");
  };

  const handleAddPoints = (pts: number) => {
    setCumulativeScore((prev) => prev + pts);
  };

  const handleResetToLobby = () => {
    soundEngine.stopMusic();
    setIsMuted(true);
    setActiveStage("lobby");
    setCumulativeScore(0);
    setSecondsSpent(0);
  };

  // Convert seconds spent count to pretty string
  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none antialiased">
      
      {/* GLOBAL BACKGROUND NOISE DECORATORS */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.06),transparent_50%)] pointer-events-none z-0"></div>
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(244,63,94,0.04),transparent_50%)] pointer-events-none z-0"></div>
      <div className="fixed inset-0 bg-[linear-gradient(to_bottom,transparent_90%,rgba(15,23,42,0.8))] pointer-events-none z-0"></div>

      {/* HEADER SECTION PANEL */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-slate-950/80 border-b border-slate-900/80 transition-all select-none">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* Logo Brand / Navigation back home */}
          <button
            type="button"
            id="header-home-btn"
            onClick={handleResetToLobby}
            className="flex items-center gap-3 group cursor-pointer text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center justify-center text-slate-950 text-xl font-extrabold shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-all">
              ⚛
            </div>
            <div>
              <span className="text-base md:text-lg font-black tracking-tight text-white block leading-none">
                HÀNH TRÌNH NGUYÊN TỬ
              </span>
              <span className="text-[10px] font-mono font-medium tracking-wide text-cyan-400 uppercase mt-0.5 block">
                Từ ký ức đến tương lai
              </span>
            </div>
          </button>

          {/* User Score & Time HUD while playing */}
          {activeStage !== "lobby" && activeStage !== "leaderboard" && (
            <div className="flex items-center gap-6 bg-slate-900 border-2 border-slate-800 px-5 py-2.5 rounded-2xl shadow-indigo-900/10 shadow-lg">
              {/* Score HUD */}
              <div className="flex items-center gap-2 select-none text-sm md:text-base">
                <Star className="w-5 h-5 text-amber-400 fill-amber-400 animate-pulse shrink-0" />
                <span className="text-slate-300 font-bold">Điểm:</span>
                <span className="text-amber-400 font-mono font-black text-lg md:text-xl">{cumulativeScore}</span>
              </div>
              {/* Divider vertical */}
              <div className="h-6 w-0.5 bg-slate-800"></div>
              {/* Timer StopWatch HUD */}
              <div className="flex items-center gap-2 select-none text-sm md:text-base">
                <Timer className="w-5 h-5 text-cyan-400 shrink-0" />
                <span className="text-slate-300 font-bold">Thời gian:</span>
                <span className="text-cyan-400 font-mono font-black text-lg md:text-xl">{formatTime(secondsSpent)}</span>
              </div>
            </div>
          )}

          {/* Sound Mute/Volume controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              id="header-mute-toggle"
              onClick={toggleGlobalMute}
              className="p-2 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 bg-slate-900/40 rounded-lg transition-all cursor-pointer active:scale-95"
              title={isMuted ? "Mở nhạc" : "Tắt nhạc"}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-cyan-400 animate-pulse" />}
            </button>

            {activeStage !== "lobby" && (
              <button
                type="button"
                id="header-restart-toggle"
                onClick={handleResetToLobby}
                className="p-2 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/20 bg-slate-900/40 rounded-lg transition-all cursor-pointer active:rotate-180 duration-500"
                title="Quay lại sảnh"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>

        {/* Global Journey progression indicator line */}
        {activeStage !== "lobby" && activeStage !== "leaderboard" && (
          <div className="w-full h-1 bg-slate-900 select-none relative overflow-hidden">
            <div
              style={{
                width:
                  activeStage === "stage1"
                    ? "33%"
                    : activeStage === "stage2"
                      ? "66%"
                      : "100%",
              }}
              className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 transition-all duration-700 ease-out"
            ></div>
          </div>
        )}
      </header>

      {/* DETAILED CONTENT CONTAINER */}
      <main className="flex-1 flex flex-col justify-center items-center relative z-10 select-none">
        {activeStage === "lobby" && (
          <Introduction 
            onStart={handleStartGame} 
            onWatchVideoComponent={() => {
              setCurrentVideoUrl("https://www.youtube.com/embed/tu0X2mB4bs0?autoplay=1");
              setCurrentVideoTitle("Video Bài Giảng: Thành Phần Nguyên Tử");
              setIsVideoOpen(true);
            }} 
            onWatchVideoShell={() => {
              setCurrentVideoUrl("https://www.youtube.com/embed/J8QV6g9YXuc?autoplay=1");
              setCurrentVideoTitle("Video Bài Giảng: Lớp Vỏ Electron");
              setIsVideoOpen(true);
            }} 
          />
        )}
        {activeStage === "stage1" && (
          <StageOne onComplete={handleStageOneComplete} onAddScore={handleAddPoints} />
        )}
        {activeStage === "stage2" && (
          <StageTwo onComplete={handleStageTwoComplete} onAddScore={handleAddPoints} />
        )}
        {activeStage === "stage3" && (
          <StageThree onComplete={handleStageThreeComplete} onAddScore={handleAddPoints} />
        )}
        {activeStage === "leaderboard" && (
          <Leaderboard finalScore={cumulativeScore} timeSpent={secondsSpent} onRestart={handleResetToLobby} />
        )}
      </main>

      {/* FLOATING ACTION TOOL: ATOMIC CLOUD SIMULATOR MODAL TRIGGER */}
      {activeStage !== "lobby" && activeStage !== "leaderboard" && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            type="button"
            id="floating-model-trigger"
            onClick={() => {
              soundEngine.playTing();
              setIsModelOpen(true);
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-400 via-violet-500 to-purple-500 text-white font-extrabold px-3.5 py-2.5 rounded-xl text-xs md:text-sm shadow-xl shadow-violet-500/25 hover:scale-105 active:scale-95 transition-all cursor-pointer group"
          >
            <span className="text-sm">⚛</span>
            <span className="tracking-tight uppercase">Đám mây e⁻</span>
          </button>
        </div>
      )}

      {/* DETAILED DIALOG/MODAL OVERLAY (ELECTRON CLOUD) */}
      {isModelOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md transition-all duration-300 animate-fade-in"
          onClick={() => setIsModelOpen(false)}
        >
          <div 
            className="w-full max-w-2xl bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border-2 border-cyan-500/20 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <ElectronCloudModel onClose={() => setIsModelOpen(false)} />
          </div>
        </div>
      )}

      {/* LECTURE VIDEO DETAILED MODAL OVERLAY */}
      {isVideoOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md transition-all duration-300 animate-fade-in"
          onClick={() => setIsVideoOpen(false)}
        >
          <div 
            className="w-full max-w-3xl bg-slate-950 border-2 border-amber-500/40 rounded-3xl overflow-hidden shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 p-5 bg-slate-900/40">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-950/80 rounded-xl border border-amber-500/40 text-amber-400 text-lg">
                  🎬
                </div>
                <div>
                  <h3 className="text-sm md:text-base font-black text-white uppercase tracking-tight">
                    {currentVideoTitle}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-medium">Bản quyền học liệu Giáo khoa Hóa học Lớp 10 THPT</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsVideoOpen(false)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-all cursor-pointer"
                aria-label="Đóng"
              >
                <span className="text-lg font-bold font-mono">✕</span>
              </button>
            </div>

            {/* Video Iframe Container with elegant padding and aspect ratio */}
            <div className="p-6 bg-slate-900">
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-black">
                <iframe 
                  className="absolute top-0 left-0 w-full h-full"
                  src={currentVideoUrl} 
                  title="YouTube video player" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  referrerPolicy="strict-origin-when-cross-origin" 
                  allowFullScreen
                ></iframe>
              </div>
            </div>

            {/* Educational takeaway footnote */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 text-center text-xs text-amber-200/90 font-semibold select-none flex items-center justify-center gap-2">
              <span>💡</span>
              <span>Hãy quan sát kĩ các mô phỏng tương tác cấu trúc vỏ hạt nhân trong clip để hoàn thành trọn vẹn điểm số 3 chặng đua!</span>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER SECTION BRAND */}
      <footer className="w-full py-6 select-none bg-slate-950/20 text-center text-xs text-slate-600 border-t border-slate-950/10">
        <p className="tracking-wide">
          HÀNH TRÌNH NGUYÊN TỬ © 2026 • TRẢI NGHIỆM HỌC TẬP THPT TOÀN DIỆN
        </p>
      </footer>

    </div>
  );
}
