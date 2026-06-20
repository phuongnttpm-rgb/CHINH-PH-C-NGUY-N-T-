/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { AtomicBot } from "./AtomicBot";
import { soundEngine } from "../utils/SoundEngine";
import { HelpCircle, Award, Sparkles, AlertCircle, ArrowRight } from "lucide-react";

interface StageOneProps {
  onComplete: (scoreGained: number) => void;
  onAddScore: (points: number) => void;
}

// Shuffle helper
function shuffleArray<T>(array: readonly T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

interface QuestionOption {
  label: string;
  correct: boolean;
}

interface Question {
  id: string;
  type: "mcq" | "fill";
  title: string;
  points: number;
  hint: string;
  description?: string;
  options1?: string[];
  options2?: string[];
  options?: QuestionOption[];
}

const ORIGINAL_QUESTIONS: Question[] = [
  {
    id: "q1",
    type: "mcq",
    title: "Trong các hạt cấu tạo nên nguyên tử, hạt nào mang điện tích âm?",
    options: [
      { label: "Proton", correct: false },
      { label: "Neutron", correct: false },
      { label: "Electron", correct: true },
      { label: "Hạt nhân", correct: false },
    ],
    points: 10,
    hint: "Hạt này vỏ ngoài nguyên tử, mang điện tích quy ước là 1-.",
  },
  {
    id: "q2",
    type: "fill",
    title: "Hãy chọn từ thích hợp điền khuyết lý thuyết cấu tạo nguyên tử.",
    description: "Nguyên tử có cấu tạo (1)…………, gồm hạt nhân nằm ở tâm và vỏ nguyên tử chứa các (2)………… chuyển động rất nhanh trong không gian xung quanh hạt nhân.",
    options1: ["đặc khít", "rỗng", "hình lập phương"],
    options2: ["proton", "neutron", "electron"],
    points: 15,
    hint: "Chọn từ thể hiện độ trống trải (1) và loại hạt mang điện ở lớp vỏ ngoài (2).",
  },
  {
    id: "q3",
    type: "mcq",
    title: "Nếu phóng đại hạt nhân thành một quả bóng tennis thì đường kính nguyên tử sẽ lớn bằng cả một sân vận động lớn. Điều này chứng minh đặc điểm quan trọng gì?",
    options: [
      { label: "Nguyên tử có cấu tạo rất rỗng, khoảng không gian phía ngoài hạt nhân là cực kỳ lớn.", correct: true },
      { label: "Hạt nhân có kích thước to tương đương lớp vỏ electron.", correct: false },
      { label: "Nguyên tử rất đặc khít và không cho bất kì vật gì đi xuyên qua.", correct: false },
      { label: "Electron luôn chuyển động rất sát bên cạnh hạt nhân.", correct: false },
    ],
    points: 15,
    hint: "Sân vận động so với quả bóng tennis ở trung tâm cho thấy tỉ lệ vô cùng rỗng của nguyên tử.",
  },
  {
    id: "q4",
    type: "mcq",
    title: "Khối lượng của hạt electron (e) khi so sánh với khối lượng của proton (p) và neutron (n) như thế nào?",
    options: [
      { label: "Lớn hơn hẳn khối lượng của proton và neutron cộng lại.", correct: false },
      { label: "Xấp xỉ bằng một nửa khối lượng hạt proton.", correct: false },
      { label: "Vô cùng nhỏ bé (khoảng 1/1840 amu).", correct: true },
      { label: "Bằng hoàn toàn khối lượng của hạt neutron.", correct: false },
    ],
    points: 10,
    hint: "Hạt electron nhẹ đến mức khối lượng nguyên tử gần như chỉ tập trung ở hạt nhân.",
  },
];

export const StageOne: React.FC<StageOneProps> = ({ onComplete, onAddScore }) => {
  const [questions] = useState<Question[]>(() => {
    return shuffleArray(ORIGINAL_QUESTIONS).map((q) => {
      if (q.type === "mcq" && q.options) {
        return {
          ...q,
          options: shuffleArray(q.options),
        };
      }
      return q;
    });
  });

  const [currentStep, setCurrentStep] = useState<0 | 1 | 2 | 3 | 4>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [fillVal1, setFillVal1] = useState<string>("");
  const [fillVal2, setFillVal2] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [botSpeech, setBotSpeech] = useState<string>(
    "Chào mừng bạn đến với Phim Trường Ký Ức! Bạn cần hồi phục 4 Mảnh ghép Tri thức về nguyên tử bị thất lạc nhé!"
  );

  // Core Memories content
  const memories = [
    {
      id: 1,
      title: "Mảnh ghép 1: Cấu trúc chung",
      text: "Nguyên tử có kích thước vô cùng nhỏ và được cấu tạo bởi 2 phần chính là hạt nhân và lớp vỏ nguyên tử.",
      restored: currentStep > 1,
    },
    {
      id: 2,
      title: "Mảnh ghép 2: Các hạt cơ bản",
      text: "Lớp vỏ nguyên tử: Được tạo nên bởi các hạt electron (e). Hạt nhân nguyên tử: Được tạo nên bởi các hạt proton (p) và hạt neutron (n).",
      restored: currentStep > 0,
    },
    {
      id: 3,
      title: "Mảnh ghép 3: Kích thước rỗng",
      text: "Kích thước của hạt nhân rất nhỏ bé so với kích thước của toàn bộ nguyên tử.",
      restored: currentStep > 2,
    },
    {
      id: 4,
      title: "Mảnh ghép 4: Tỉ lệ khối lượng",
      text: "Khối lượng của hạt electron rất nhỏ khi đem so sánh với khối lượng của hạt proton và neutron.",
      restored: currentStep > 3,
    },
  ];

  const handleMCQSubmit = (idx: number) => {
    if (isAnswered) return;
    const currentQ = questions[currentStep];
    const isAnsCorrect = currentQ.options ? currentQ.options[idx].correct : false;

    setSelectedAnswer(idx);
    setIsAnswered(true);
    setIsCorrect(isAnsCorrect);

    if (isAnsCorrect) {
      soundEngine.playCorrect();
      onAddScore(currentQ.points);
      setBotSpeech(`Tuyệt vời! Bạn đã trả lời đúng để giải mã mảnh kí ức thứ ${currentStep + 1}!`);
    } else {
      soundEngine.playIncorrect();
      setBotSpeech("Rất tiếc, câu trả lời chưa chính xác. Bạn thử suy luận lại xem nhé!");
    }
  };

  const handleFillSubmit = () => {
    if (isAnswered) return;
    if (!fillVal1 || !fillVal2) {
      setErrorMessage("Vui lòng chọn đầy đủ cả hai từ khóa!");
      return;
    }
    setErrorMessage("");
    const isAnsCorrect = fillVal1 === "rỗng" && fillVal2 === "electron";

    setIsAnswered(true);
    setIsCorrect(isAnsCorrect);

    if (isAnsCorrect) {
      soundEngine.playCorrect();
      onAddScore(questions[currentStep].points);
      setBotSpeech("Chính xác tuyệt đối! Nguyên tử rỗng và có hạt vỏ là electron!");
    } else {
      soundEngine.playIncorrect();
      setBotSpeech("Hạt vỏ hoặc cấu trúc rỗng chưa chuẩn rồi, hãy thử lại nào!");
    }
  };

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep((prev) => (prev + 1) as any);
      setSelectedAnswer(null);
      setFillVal1("");
      setFillVal2("");
      setIsAnswered(false);
      setIsCorrect(false);
      setBotSpeech(`Tiếp tục khôi phục mảnh ký ức tiếp theo nhé! Chúng ta đã có ${currentStep + 1} mảnh ghép rồi.`);
    } else {
      // Complete Stage 1
      soundEngine.playStageComplete();
      setCurrentStep(4);
      setBotSpeech(
        "TUYỆT VỜI! Tất cả 4 Mảnh ghép Ký ức đã hoàn toàn hồi phục! Hãy khởi động Cỗ Máy Sợi Dây Năng Lượng để tiến vào đấu trường Folk Chặng 2 khoa cử kéo co!"
      );
    }
  };

  const currentQuestion = questions[currentStep < 4 ? currentStep : 3];

  return (
    <div className="w-full max-w-[1550px] mx-auto px-4 lg:px-8 py-4 text-slate-100" id="stage-show-panel">
      {/* Upper Navigation Indicator & Header Theme */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 pb-4 border-b border-cyan-500/25">
        <div>
          <span className="px-3 py-1 text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-full select-none uppercase tracking-widest">
            CHẶNG 1: VNM SHOW - KÝ ỨC VUI VẺ
          </span>
          <h1 className="text-2xl md:text-3xl font-bold font-sans tracking-tight text-white mt-1">
            Phim Trường Phục Hồi Tri Thức (The Core Memory)
          </h1>
        </div>
        <div className="flex items-center gap-2 mt-4 md:mt-0 select-none bg-slate-900/60 px-4 py-2 rounded-xl border border-slate-700/50">
          <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
          <span className="text-sm font-semibold">Tỉnh táo hồi phục: </span>
          <span className="text-cyan-400 font-mono font-bold text-lg">
            {memories.filter((m) => m.restored).length}/4 Mảnh
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Virtual robot and vertical checklist progress list */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          {/* Virtual robot Atomic-Bot panel */}
          <div className="bg-slate-900/80 p-5 rounded-3xl border border-cyan-500/10 shadow-2xl flex flex-col items-center justify-between min-h-[340px]">
            <h2 className="text-xs uppercase tracking-wider text-cyan-400/80 font-semibold mb-2 text-center select-none">
              Hologram Linh Vật AI
            </h2>
            
            <AtomicBot
              stage={1}
              mood={isAnswered ? (isCorrect ? "happy" : "thinking") : "talking"}
              speechBubble={botSpeech}
              className="my-2"
            />

            <div className="w-full mt-2 p-2 bg-slate-950/80 rounded-xl border border-slate-850 text-xs text-slate-400 text-center select-none">
              Mẹo: Tìm mảnh ghép thông qua bài học lịch sử về cấu tạo nguyên tử thế kỷ 20.
            </div>
          </div>

          {/* New Optimized Space-saving Vertical Shards Matrix */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col gap-4">
            <h3 className="text-base md:text-lg font-black uppercase tracking-wider text-cyan-400 select-none pb-2 border-b border-cyan-800/40">
              Tiến Độ Hồi Phục Mảnh Ghép
            </h3>
            <div className="grid grid-cols-1 gap-3.5">
              {memories.map((m, idx) => (
                <div
                  key={m.id}
                  className={`p-4 rounded-2xl border transition-all duration-300 flex items-center gap-4 relative overflow-hidden ${
                    m.restored
                      ? "bg-cyan-950/30 border-cyan-500/40 text-cyan-100"
                      : "bg-slate-950/40 border-slate-850 text-slate-500"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-2xl font-mono font-black text-base md:text-lg flex items-center justify-center shrink-0 border shadow-lg ${
                    m.restored
                      ? "bg-cyan-500/10 border-cyan-400/50 text-cyan-400"
                      : "bg-slate-900 border-slate-800 text-slate-500"
                  }`}>
                    {m.restored ? "✓" : idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm md:text-base font-black leading-tight select-none text-white uppercase tracking-tight">{m.title}</h4>
                    <p className={`text-xs md:text-sm leading-relaxed mt-1 font-semibold select-none ${m.restored ? "text-cyan-200/90" : "text-slate-500"}`}>
                      {m.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Active Learning Engine/Questions starts at the top of viewport */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {currentStep < 4 ? (
            /* Active Question Panel */
            <div className="bg-slate-900/60 rounded-3xl border border-slate-800 p-8 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 select-none">
                <span className="text-sm font-mono bg-cyan-950 text-cyan-300 border border-cyan-800 px-3 py-1 rounded-md">
                  +{currentQuestion.points} điểm
                </span>
              </div>

              <div className="mb-6">
                <p className="text-sm font-bold uppercase tracking-widest text-amber-500">
                  Thử thách Phục Hồi
                </p>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white mt-2 pr-16 leading-relaxed">
                  {currentQuestion.title}
                </h2>
                {currentQuestion.description && (
                  <p className="mt-5 p-6 bg-slate-950/70 border-l-4 border-cyan-500 rounded-r-2xl text-xl md:text-2xl lg:text-3xl font-semibold leading-relaxed text-slate-200">
                    {currentQuestion.description}
                  </p>
                )}
              </div>

              {/* Input Forms Depending on Quiz Type */}
              {currentQuestion.type === "mcq" ? (
                /* Multiple Choice Layout */
                <div className="grid grid-cols-1 gap-4 mt-6">
                  {currentQuestion.options?.map((opt, oIdx) => {
                    const isSelected = selectedAnswer === oIdx;
                    let btnStyle = "bg-slate-800/40 border-slate-700 hover:border-slate-500 text-slate-200";
                    if (isAnswered) {
                      if (opt.correct) {
                        btnStyle = "bg-emerald-950/80 border-emerald-500 text-emerald-100 shadow-[0_0_12px_rgba(16,185,129,0.2)]";
                      } else if (isSelected) {
                        btnStyle = "bg-rose-950/80 border-rose-500 text-rose-100";
                      } else {
                        btnStyle = "bg-slate-900/20 border-slate-800 text-slate-500 pointer-events-none";
                      }
                    } else if (isSelected) {
                      btnStyle = "bg-cyan-950 border-cyan-400 text-cyan-100";
                    }

                    return (
                      <button
                        key={oIdx}
                        type="button"
                        id={`q1-option-${oIdx}`}
                        disabled={isAnswered}
                        onClick={() => handleMCQSubmit(oIdx)}
                        className={`w-full p-5 text-left rounded-xl border text-lg md:text-xl lg:text-2xl font-bold transition-all duration-200 flex items-center justify-between cursor-pointer ${btnStyle}`}
                      >
                        <span>{String.fromCharCode(65 + oIdx)}. {opt.label}</span>
                        {isAnswered && opt.correct && (
                          <span className="text-sm font-bold uppercase font-mono px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded border border-emerald-500/30">
                            Chuẩn
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : (
                /* Dialogue drag-drop input simulated by dropdown grids */
                <div className="mt-6 space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-950/50 p-6 rounded-2xl border border-slate-800">
                    <div>
                      <label className="block text-base font-bold text-slate-300 mb-2 select-none">
                        Từ khóa (1) cấu trúc
                      </label>
                      <select
                        value={fillVal1}
                        id="fill-select-1"
                        disabled={isAnswered}
                        onChange={(e) => setFillVal1(e.target.value)}
                        className="w-full px-4 py-3.5 bg-slate-900 border-2 border-slate-700 rounded-xl text-lg text-slate-200 focus:outline-none focus:border-cyan-500 disabled:opacity-50"
                      >
                        <option value="">-- Chọn từ phù hợp --</option>
                        {currentQuestion.options1?.map((o) => (
                          <option key={o} value={o}>
                            {o}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-base font-bold text-slate-300 mb-2 select-none">
                        Từ khóa (2) hạt lớp vỏ
                      </label>
                      <select
                        value={fillVal2}
                        id="fill-select-2"
                        disabled={isAnswered}
                        onChange={(e) => setFillVal2(e.target.value)}
                        className="w-full px-4 py-3.5 bg-slate-900 border-2 border-slate-700 rounded-xl text-lg text-slate-200 focus:outline-none focus:border-cyan-500 disabled:opacity-50"
                      >
                        <option value="">-- Chọn từ phù hợp --</option>
                        {currentQuestion.options2?.map((o) => (
                          <option key={o} value={o}>
                            {o}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {errorMessage && (
                    <div className="text-rose-400 text-sm flex items-center gap-2 bg-rose-500/10 p-3 rounded-lg border border-rose-500/20 select-none">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {!isAnswered ? (
                    <button
                      type="button"
                      id="submit-fill-button"
                      onClick={handleFillSubmit}
                      className="w-full py-4.5 bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold rounded-xl text-lg md:text-xl transition-all duration-150 cursor-pointer shadow-lg shadow-cyan-500/20 active:translate-y-0.5"
                    >
                      Kiểm Tra Đáp Án
                    </button>
                  ) : (
                    <div
                      className={`p-6 rounded-2xl border text-lg md:text-xl font-bold flex flex-col gap-2 ${
                        isCorrect
                          ? "bg-emerald-950/60 border-emerald-500 text-emerald-300"
                          : "bg-rose-950/60 border-rose-500 text-rose-300"
                      }`}
                    >
                      <span className="text-sm uppercase tracking-wider">
                        {isCorrect ? "Hoàn thành nhiệm vụ!" : "Thất bại cấu tạo"}
                      </span>
                      <span>
                        {isCorrect
                          ? "Từ chọn: [rỗng] và [electron] là đáp án hoàn hảo!"
                          : "Đáp án đúng phải là cấu trúc [rỗng] và vỏ là [electron]!"}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Feedback overlay and controller */}
              <div className="mt-8 pt-5 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
                {/* Hint Toggle */}
                <div className="flex items-center gap-2 text-sm text-slate-300 bg-slate-950/50 px-4 py-2.5 rounded-xl select-none">
                  <HelpCircle className="w-5 h-5 text-cyan-400 shrink-0" />
                  <span className="font-bold">Ý kiến Bot:</span>
                  <span className="italic">{currentQuestion.hint}</span>
                </div>

                {isAnswered && (
                  <button
                    type="button"
                    id="next-step-button"
                    onClick={handleNextStep}
                    className="w-full md:w-auto px-8 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-extrabold rounded-xl text-base md:text-lg tracking-wide shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/40 active:scale-95 transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{currentStep === 3 ? "TỔNG HỢP NĂNG LƯỢNG" : "CHẶNG TIẾP"}</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Restoration Phase Complete Screen - The Energy Rope Assembly */
            <div className="bg-gradient-to-br from-cyan-950/50 to-slate-900/40 rounded-3xl border-2 border-cyan-400 p-8 shadow-2xl relative overflow-hidden text-center flex flex-col items-center">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.15),transparent_60%)] animate-pulse pointer-events-none"></div>

              <div className="w-16 h-16 bg-cyan-900/30 border-2 border-cyan-400 rounded-full flex items-center justify-center mb-4 text-cyan-400 animate-bounce">
                <Award className="w-10 h-10" />
              </div>

              <h2 className="text-xl md:text-3xl font-extrabold text-white tracking-wide">
                BẢN ĐỒ KÝ ỨC PHỤC HỒI 100%
              </h2>
              <p className="max-w-xl text-sm leading-relaxed text-slate-300 mt-2 select-none">
                Cả 4 mảnh ghép cấu tạo nguyên tử cơ bản đã hòa làm một! Sợi dây năng lượng tri thức được ngưng tụ lấp lánh, sẵn sàng kết nối bạn với Đấu Trường Kéo Co Dân Gian của Chặng 2.
              </p>

              {/* Abstract Visualization of Rope of Knowledge */}
              <div className="w-full max-w-md h-24 my-6 bg-slate-950/80 rounded-2xl border border-cyan-500/30 relative flex items-center justify-center overflow-hidden">
                <div className="absolute w-full h-1 bg-gradient-to-r from-red-500 via-yellow-400 via-cyan-400 via-blue-500 to-amber-500 blur-sm rounded animate-pulse"></div>
                <div className="absolute w-full h-0.5 bg-gradient-to-r from-red-500 via-amber-400 via-cyan-400 to-blue-500 rounded animate-[spin_5s_linear_infinite]"></div>
                <div className="flex gap-8 z-10">
                  <div className="px-3 py-1 bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 rounded-md text-xs font-mono font-bold uppercase animate-pulse">
                    Proton (p)
                  </div>
                  <div className="px-3 py-1 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded-md text-xs font-mono font-bold uppercase animate-pulse">
                    Electron (e)
                  </div>
                  <div className="px-3 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/20 rounded-md text-xs font-mono font-bold uppercase animate-pulse">
                    Neutron (n)
                  </div>
                </div>
              </div>

              <button
                type="button"
                id="enter-stage-2-button"
                onClick={() => onComplete(50)} // Gain direct points as bonus
                className="w-full max-w-sm py-4 bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500 hover:from-cyan-300 hover:to-indigo-400 text-slate-950 font-extrabold rounded-xl text-lg uppercase tracking-wider shadow-xl shadow-cyan-400/20 hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>BƯỚC VÀO CỔNG CHẶNG 2</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
