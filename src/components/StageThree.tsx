/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { AtomicBot } from "./AtomicBot";
import { soundEngine } from "../utils/SoundEngine";
import { Sparkles, CheckCircle, XCircle, ShieldAlert, Zap, Send, Keyboard } from "lucide-react";

interface StageThreeProps {
  onComplete: (scoreGained: number) => void;
  onAddScore: (points: number) => void;
}

export const StageThree: React.FC<StageThreeProps> = ({ onComplete, onAddScore }) => {
  const [stepIdx, setStepIdx] = useState<number>(0);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [selectedBool, setSelectedBool] = useState<boolean | null>(null);
  
  // Custom states for why atom is neutral (Câu 5)
  const [explanationText, setExplanationText] = useState<string>("");
  
  // Custom states for Aluminium Math (Câu 3)
  const [calcNum, setCalcNum] = useState<string>("");

  // Custom states for system of particle equations (Câu 6)
  const [protonDial, setProtonDial] = useState<number>(10);
  const [neutronDial, setNeutronDial] = useState<number>(10);
  const [electronDial, setElectronDial] = useState<number>(10);

  const [botSpeech, setBotSpeech] = useState<string>(
    "Chúng ta đã tiến vào Trạm Không Gian tương lai! Hãy khởi động các lò phản ứng hạt bằng tính toán logic cấp cao nhé!"
  );

  const challenges = [
    {
      id: "sp1",
      title: "CÂU 4 (ĐÚNG/SAI): Khối lượng của nguyên tử hầu hết tập trung ở lớp vỏ electron.",
      points: 15,
      hint: "Nhớ rằng khối lượng electron vô cùng nhẹ so với khối lượng hạt nhân (gồm proton và neutron) ở tâm.",
    },
    {
      id: "sp2",
      title: "CÂU 5 (TRẢ LỜI NGẮN): Tại sao nguyên tử bình thường lại luôn trung hòa về điện?",
      points: 15,
      hint: "Hãy suy nghĩ về mối tương quan giữa tổng số hạt proton (mang điện dương) và số hạt electron (mang điện âm). Chọn nhập câu trả lời ngắn có chứa từ khóa 'p = e' hoặc 'bằng' nhé!",
    },
    {
      id: "sp3",
      title: "CÂU 3 (TÍNH TOÁN NHANH): Một nguyên tử nhôm Aluminium (Al) có hạt nhân chứa 13 proton và 14 neutron. Số khối (A) của nguyên tử này bằng bao nhiêu?",
      points: 15,
      hint: "Công thức số khối: A = Số proton (p) + Số neutron (n).",
    },
    {
      id: "sp4",
      title: "CÂU 6 (ĐIỀU KHIỂN HỢP HẠT NHÂN): Tổng số lượng hạt (p, n, e) trong một nguyên tử nguyên tố X là 40. Biết số hạt mang điện nhiều hơn số hạt không mang điện là 12. Hãy điều chỉnh ba lò phản ứng để tìm giá trị p, n, e thích hợp cứu trạm!",
      points: 25,
      hint: "Hệ phương trình: 2p + n = 40; 2p - n = 12. Cộng hai vế ta được 4p = 52. Tính số lượng proton (p), electron (e = p) và sau đó tính neutron n.",
    },
  ];

  const handleBoolSubmit = (val: boolean) => {
    if (isAnswered) return;
    setSelectedBool(val);
    const isCorrectVal = val === false; // The question "Atoms mass concentracted at electron shell" is false (Incorrect!)

    setIsAnswered(true);
    setIsCorrect(isCorrectVal);

    if (isCorrectVal) {
      soundEngine.playCorrect();
      onAddScore(challenges[0].points);
      setBotSpeech("Rất chính xác! Lớp vỏ electron nhẹ không đáng kể, khối lượng tập trung ở hạt nhân!");
    } else {
      soundEngine.playIncorrect();
      setBotSpeech("Sai rồi phi hành gia ơi! Hạt nhân mới thực sự gồng gánh 99.9% khối lượng nguyên tử!");
    }
  };

  const handleTextAnalysisSubmit = () => {
    if (isAnswered) return;
    const txt = explanationText.toLowerCase().trim();
    if (txt.length < 3) {
      setBotSpeech("Hãy nhập câu giải thích rõ ràng hơn một chút nhé!");
      return;
    }

    // Keyword detection
    const hasP = txt.includes("p") || txt.includes("proton");
    const hasE = txt.includes("e") || txt.includes("electron");
    const hasEqual = txt.includes("bằng") || txt.includes("=") || txt.includes("bằng nhau");
    
    // Valid combination
    const isAnsCorrect = (hasP && hasE && hasEqual) || txt.includes("p = e") || txt.includes("p=e");

    setIsAnswered(true);
    setIsCorrect(isAnsCorrect);

    if (isAnsCorrect) {
      soundEngine.playCorrect();
      onAddScore(challenges[1].points);
      setBotSpeech("Câu trả lời tuyệt vời! Vì số proton (dương) luôn bằng số electron (âm) nên nguyên tử trung hòa!");
    } else {
      soundEngine.playIncorrect();
      setBotSpeech("Chưa đúng trọng tâm rồi! Hãy nhớ: Vì số hạt proton (+) luôn BẰNG số hạt electron (-) nhé!");
    }
  };

  const handleAluminiumKeypad = (char: string) => {
    if (isAnswered) return;
    if (char === "Del") {
      setCalcNum((prev) => prev.slice(0, -1));
    } else if (calcNum.length < 3) {
      setCalcNum((prev) => prev + char);
    }
  };

  const handleAluminiumSubmit = () => {
    if (isAnswered) return;
    if (!calcNum) return;
    const val = parseInt(calcNum, 10);
    const isAnsCorrect = val === 27; // Aluminium mass number: 13 + 14 = 27

    setIsAnswered(true);
    setIsCorrect(isAnsCorrect);

    if (isAnsCorrect) {
      soundEngine.playCorrect();
      onAddScore(challenges[2].points);
      setBotSpeech("Quá đỉnh! Số khối A = 13 + 14 = 27 amu. Máy tính trạm vũ trụ đã ổn định!");
    } else {
      soundEngine.playIncorrect();
      setBotSpeech("Hầy, nhầm lẫn con số rồi! Lấy 13 proton cộng với 14 neutron ra bao nhiêu nhỉ?");
    }
  };

  const handleReactorCoreStabilizeSubmit = () => {
    if (isAnswered) return;
    const isAnsCorrect = protonDial === 13 && neutronDial === 14 && electronDial === 13;

    setIsAnswered(true);
    setIsCorrect(isAnsCorrect);

    if (isAnsCorrect) {
      soundEngine.playCorrect();
      onAddScore(challenges[3].points);
      setBotSpeech(
        "XUẤT SẮC! Cả ba lò phản ứng proton (13), neutron (14), electron (13) đã hòa âm ổn định tối đa! Động cơ Warp sẵn sàng nổ tung vượt không gian!"
      );
    } else {
      soundEngine.playIncorrect();
      setBotSpeech(
        `Lỗi cân bằng hạt nhân! Proton:${protonDial}, Neutron:${neutronDial}, Electron:${electronDial} chưa chuẩn. Gợi ý giải: 2p+n = 40 & 2p-n = 12.`
      );
    }
  };

  const handleNavigateNext = () => {
    if (stepIdx < challenges.length - 1) {
      setStepIdx((prev) => prev + 1);
      setIsAnswered(false);
      setIsCorrect(false);
      setSelectedBool(null);
      setExplanationText("");
      setCalcNum("");
      setBotSpeech("Nhiệm vụ ổn định trạm vũ trụ tiếp theo! Cố gắng giải mã chuẩn xác nhé!");
    } else {
      // Warp sound first
      soundEngine.playWarp();
      onComplete(80); // Jump to global Leaderboard!
    }
  };

  const activeChallenge = challenges[stepIdx];

  return (
    <div className="w-full max-w-[1550px] mx-auto px-4 lg:px-8 py-4 text-slate-100" id="stage-space-panel">
      {/* Upper Navigation Indicator & Header Theme */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-5 pb-3 border-b border-cyan-500/25">
        <div>
          <span className="px-3 py-1 text-xs font-semibold bg-cyan-950 text-cyan-400 border border-cyan-800 rounded-full select-none uppercase tracking-widest">
            CHẶNG 3: 3D SPACE STATION - ADVANCED LAB
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold font-sans tracking-tight text-white mt-1">
            Trạm Thí Nghiệm Nguyên Tử Tương Lai (Advanced Lab)
          </h1>
        </div>
        <div className="flex items-center gap-2 mt-4 md:mt-0 select-none bg-slate-900/60 px-4 py-2 rounded-xl border border-slate-700/50">
          <Zap className="w-5 h-5 text-cyan-400 animate-pulse" />
          <span className="text-sm font-semibold">Tải Động Cơ Warp: </span>
          <span className="text-cyan-400 font-mono font-bold text-lg">
            {Math.round(((stepIdx + (isAnswered && isCorrect ? 1 : 0)) / 4) * 100)}%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Outer Space Astronaut Atomic Bot - Compact auto-height */}
        <div className="lg:col-span-4 bg-slate-900/80 p-5 rounded-3xl border border-cyan-500/10 shadow-2xl flex flex-col items-center justify-between min-h-0 gap-3">
          <h2 className="text-xs uppercase tracking-wider text-cyan-400/80 font-bold text-center select-none">
            Visor Phi Hành Gia AI
          </h2>
          
          <AtomicBot
            stage={3} // Glass space visor astronaut style!
            mood={answeredStateDescription()}
            speechBubble={botSpeech}
            className="my-1"
          />

          <div className="w-full mt-1 p-2.5 bg-cyan-950/20 rounded-xl border border-cyan-500/10 text-xs text-slate-400 text-center select-none">
            Gợi ý: Áp dụng các định luật bảo toàn $A = Z + n$, hạt trung hòa để cân bằng lõi.
          </div>
        </div>

        {/* Right Column: Calculations controls dashboards */}
        <div className="lg:col-span-8 bg-slate-900/60 rounded-3xl border border-slate-800 p-8 shadow-xl relative min-h-[380px] flex flex-col justify-between">
          
          <div>
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-6">
              <span className="text-sm font-bold text-cyan-400 uppercase tracking-widest select-none">
                Thí nghiệm {stepIdx + 1}/4: Logic Trạm Không Gian
              </span>
              <span className="text-sm font-mono bg-cyan-950 text-cyan-300 border border-cyan-800 px-3 py-1 rounded-md">
                +{activeChallenge.points} điểm
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white mb-6 leading-relaxed">
              {activeChallenge.title}
            </h2>

            {/* Render sub-game based on active challenge step */}
            {stepIdx === 0 && (
              /* TRUE / FALSE SELECTION (Câu 4) */
              <div className="grid grid-cols-2 gap-4 my-4">
                <button
                  type="button"
                  id="choice-true-button"
                  onClick={() => handleBoolSubmit(true)}
                  disabled={isAnswered}
                  className={`p-8 rounded-2xl border text-center font-black text-xl md:text-2xl transition-all flex flex-col items-center gap-2 cursor-pointer ${
                    isAnswered
                      ? selectedBool === true
                        ? "bg-rose-950/80 border-rose-500 text-rose-200"
                        : "bg-slate-900/20 border-slate-800 text-slate-500"
                      : "bg-slate-800/40 border-slate-700 hover:border-emerald-500 hover:bg-slate-800 text-emerald-400"
                  }`}
                >
                  <CheckCircle className="w-10 h-10 text-emerald-400 mb-1" />
                  <span>ĐÚNG</span>
                </button>

                <button
                  type="button"
                  id="choice-false-button"
                  onClick={() => handleBoolSubmit(false)}
                  disabled={isAnswered}
                  className={`p-8 rounded-2xl border text-center font-black text-xl md:text-2xl transition-all flex flex-col items-center gap-2 cursor-pointer ${
                    isAnswered
                      ? selectedBool === false
                        ? "bg-emerald-950/80 border-emerald-500 text-emerald-200"
                        : "bg-slate-900/20 border-slate-800 text-slate-500"
                      : "bg-slate-800/40 border-slate-700 hover:border-rose-500 hover:bg-slate-800 text-rose-400"
                  }`}
                >
                  <XCircle className="w-10 h-10 text-rose-400 mb-1" />
                  <span>SAI</span>
                </button>
              </div>
            )}

            {stepIdx === 1 && (
              /* SHORT ANSWER ANALYSIS BOX (Câu 5) */
              <div className="space-y-4 my-4">
                <div className="flex gap-2 p-4 bg-slate-950/60 rounded-xl border border-slate-800 items-start">
                  <ShieldAlert className="w-5 h-5 text-cyan-400 mt-0.5 shrink-0" />
                  <p className="text-sm font-semibold text-slate-300 leading-relaxed italic select-none">
                    Nhập câu trả lời của bạn vào ô dưới. Ví dụ ý tưởng chính: Phải giải thích do số lượng hạt proton (mang điện dương) bằng số hạt electron (mang điện âm).
                  </p>
                </div>

                <div className="relative flex items-center">
                  <input
                    type="text"
                    id="neutral-reason-input"
                    value={explanationText}
                    disabled={isAnswered}
                    onChange={(e) => setExplanationText(e.target.value)}
                    placeholder="Nhập câu giải thích tại đây... (Ví dụ: vì số p = số e)"
                    className="w-full px-5 py-4 bg-slate-950 border border-slate-700 rounded-xl text-lg placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 text-slate-100 disabled:opacity-50 pr-16"
                  />
                  {!isAnswered && (
                    <button
                      type="button"
                      id="submit-explanation-button"
                      onClick={handleTextAnalysisSubmit}
                      className="absolute right-3 p-2.5 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-white transition-all cursor-pointer active:scale-95 text-base md:text-lg"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {stepIdx === 2 && (
              /* ALUMINIUM MASS KEYPAD SIMULATOR (Câu 3) */
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 my-4">
                
                {/* Result Display */}
                <div className="md:col-span-5 flex flex-col justify-center items-center p-6 bg-slate-950 rounded-2xl border border-slate-800 relative">
                  <div className="absolute top-2 left-2 text-xs font-extrabold text-cyan-400 select-none flex items-center gap-1">
                    <Keyboard className="w-4 h-4" />
                    <span>Màn hình tính A</span>
                  </div>
                  <span className="text-sm font-bold text-slate-400 select-none mb-1">Số khối của Aluminum</span>
                  <div className="text-5xl font-mono font-black text-cyan-400 h-16 flex items-center justify-center tracking-widest my-2">
                    {calcNum || "---"}
                  </div>
                  {!isAnswered ? (
                    <button
                      type="button"
                      id="aluminium-submit"
                      onClick={handleAluminiumSubmit}
                      disabled={!calcNum}
                      className="mt-4 px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-black text-sm rounded-xl transition-all cursor-pointer disabled:opacity-50"
                    >
                      XÁC NHẬN SỐ
                    </button>
                  ) : (
                    <span className="mt-4 text-sm font-bold text-slate-400 uppercase">
                      Đã ghi nhận dữ liệu
                    </span>
                  )}
                </div>

                {/* Keypad */}
                <div className="md:col-span-7 bg-slate-950/40 p-4 rounded-2xl border border-slate-800">
                  <div className="grid grid-cols-3 gap-2">
                    {["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "Del"].map((char) => (
                      <button
                        key={char}
                        type="button"
                        id={`calc-key-${char}`}
                        disabled={isAnswered}
                        onClick={() => handleAluminiumKeypad(char)}
                        className="py-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg font-mono font-bold text-xl text-slate-300 active:scale-95 transition-all cursor-pointer disabled:opacity-40"
                      >
                        {char}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {stepIdx === 3 && (
              /* SYSTEM OF EQUATIONS DIALS REACTOR (Câu 6) */
              <div className="space-y-6 my-4 bg-slate-950/40 p-5 rounded-2xl border border-slate-800">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  {/* Proton Dial Core */}
                  <div className="flex flex-col items-center bg-slate-950/70 p-4 rounded-xl border border-rose-500/10">
                    <span className="text-sm font-extrabold text-rose-400 uppercase tracking-wider mb-2 select-none">
                      Hạt Proton (p)
                    </span>
                    <div className="text-5xl md:text-6xl font-mono font-black text-white my-2">
                      {protonDial}
                    </div>
                    <div className="flex gap-2 mt-2 w-full">
                      <button
                        type="button"
                        id="p-minus-btn"
                        disabled={isAnswered || protonDial <= 1}
                        onClick={() => setProtonDial((v) => v - 1)}
                        className="flex-1 py-2 bg-slate-900 border-2 border-slate-700 hover:bg-slate-800 text-slate-100 font-extrabold text-xl rounded cursor-pointer"
                      >
                        -
                      </button>
                      <button
                        type="button"
                        id="p-plus-btn"
                        disabled={isAnswered || protonDial >= 30}
                        onClick={() => setProtonDial((v) => v + 1)}
                        className="flex-1 py-2 bg-slate-900 border-2 border-slate-700 hover:bg-slate-800 text-slate-100 font-extrabold text-xl rounded cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Neutron Dial Core */}
                  <div className="flex flex-col items-center bg-slate-950/70 p-4 rounded-xl border border-amber-500/10">
                    <span className="text-sm font-extrabold text-amber-400 uppercase tracking-wider mb-2 select-none">
                      Hạt Neutron (n)
                    </span>
                    <div className="text-5xl md:text-6xl font-mono font-black text-white my-2">
                      {neutronDial}
                    </div>
                    <div className="flex gap-2 mt-2 w-full">
                      <button
                        type="button"
                        id="n-minus-btn"
                        disabled={isAnswered || neutronDial <= 1}
                        onClick={() => setNeutronDial((v) => v - 1)}
                        className="flex-1 py-2 bg-slate-900 border-2 border-slate-700 hover:bg-slate-800 text-slate-100 font-extrabold text-xl rounded cursor-pointer"
                      >
                        -
                      </button>
                      <button
                        type="button"
                        id="n-plus-btn"
                        disabled={isAnswered || neutronDial >= 30}
                        onClick={() => setNeutronDial((v) => v + 1)}
                        className="flex-1 py-2 bg-slate-900 border-2 border-slate-700 hover:bg-slate-800 text-slate-100 font-extrabold text-xl rounded cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Electron Dial Core */}
                  <div className="flex flex-col items-center bg-slate-950/70 p-4 rounded-xl border border-cyan-500/10">
                    <span className="text-sm font-extrabold text-cyan-400 uppercase tracking-wider mb-2 select-none">
                      Hạt Electron (e)
                    </span>
                    <div className="text-5xl md:text-6xl font-mono font-black text-white my-2">
                      {electronDial}
                    </div>
                    <div className="flex gap-2 mt-2 w-full">
                      <button
                        type="button"
                        id="e-minus-btn"
                        disabled={isAnswered || electronDial <= 1}
                        onClick={() => setElectronDial((v) => v - 1)}
                        className="flex-1 py-2 bg-slate-900 border-2 border-slate-700 hover:bg-slate-800 text-slate-100 font-extrabold text-xl rounded cursor-pointer"
                      >
                        -
                      </button>
                      <button
                        type="button"
                        id="e-plus-btn"
                        disabled={isAnswered || electronDial >= 30}
                        onClick={() => setElectronDial((v) => v + 1)}
                        className="flex-1 py-2 bg-slate-900 border-2 border-slate-700 hover:bg-slate-800 text-slate-100 font-extrabold text-xl rounded cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                </div>

                {!isAnswered ? (
                  <button
                    type="button"
                    id="reactor-submit-btn"
                    onClick={handleReactorCoreStabilizeSubmit}
                    className="w-full py-4.5 bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold text-base md:text-lg rounded-xl uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-cyan-500/15"
                  >
                    KÍCH HOẠT LÒ PHẢN ỨNG CÂN BẰNG
                  </button>
                ) : (
                  <div
                    className={`p-4 rounded-xl border text-sm md:text-base font-bold flex items-center justify-between ${
                      isCorrect
                        ? "bg-emerald-950/60 border-emerald-500 text-emerald-300"
                        : "bg-rose-950/60 border-rose-500 text-rose-300"
                    }`}
                  >
                    <span> Dữ liệu nghiệm đúng: Proton (p) = 13, Neutron (n) = 14, Electron (e) = 13.</span>
                  </div>
                )}
              </div>
            )}

            {/* Answer State Display Box */}
            {isAnswered && (
              <div
                className={`mt-4 p-5 rounded-xl border flex items-center gap-3 animate-fade-in ${
                  isCorrect
                    ? "bg-emerald-950/40 border-emerald-500/50 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                    : "bg-rose-950/40 border-rose-500/50 text-rose-300"
                }`}
              >
                <div>
                  <h4 className="text-base font-bold uppercase tracking-widest mb-1 select-none">
                    {isCorrect ? "Ủy nhiệm thành công!" : "Lỗi hệ thống"}
                  </h4>
                  <p className="text-sm leading-relaxed font-medium select-none">
                    {isCorrect
                      ? "Một đáp án chuẩn xác! Trạm vũ trụ được tiếp thêm năng lượng tinh hoa!"
                      : "Dữ liệu phân tách hạt chưa chính xác. Lò phản ứng hạt nhân ở tâm chưa đạt độ cân bằng cần thiết!"}
                  </p>
                </div>
              </div>
            )}

          </div>

          {/* Footer controls layout */}
          <div className="mt-8 pt-4 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-300 bg-slate-950/50 px-4 py-2.5 rounded-xl select-none">
              <ShieldAlert className="w-5 h-5 text-cyan-400 shrink-0" />
              <span className="font-bold shrink-0">Hỗ trợ trạm:</span>
              <span className="italic line-clamp-1">{activeChallenge.hint}</span>
            </div>

            {isAnswered && (
              <button
                type="button"
                id="next-space-challenge-btn"
                onClick={handleNavigateNext}
                className="w-full md:w-auto px-8 py-3.5 bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-slate-950 font-extrabold rounded-xl text-base md:text-lg tracking-wide shadow-lg shadow-cyan-500/25 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{stepIdx === challenges.length - 1 ? "KÍCH HOẠT ĐỘNG CƠ WARP" : "THỬ NGHIỆM TIẾP"}</span>
              </button>
            )}
          </div>

        </div>

      </div>

    </div>
  );

  function answeredStateDescription() {
    if (!isAnswered) return "talking";
    return isCorrect ? "happy" : "thinking";
  }
};
