/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { AtomicBot } from "./AtomicBot";
import { soundEngine } from "../utils/SoundEngine";
import { Sparkles, Trophy, HelpCircle, ArrowRight, CheckCircle2, RefreshCw } from "lucide-react";

interface QuestionOption {
  label: string;
  correct: boolean;
}

interface Question {
  id: string;
  type?: string;
  title: string;
  points: number;
  hint: string;
  options?: QuestionOption[];
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

const ORIGINAL_FOLK_QUESTIONS: Question[] = [
  {
    id: "fk1",
    title: "ĐỊNH NGHĨA KHOA CỬ: Số khối (A) và Số hiệu nguyên tử (Z) trong kí hiệu hóa học $^A_Z X$ đại diện cho điều gì?",
    options: [
      { label: "A là số khối (p+n), Z là số hiệu nguyên tử (số p)", correct: true },
      { label: "A là số proton, Z là tổng hạt electron vỏ", correct: false },
      { label: "A là điện tích hạt nhân, Z là số hạt neutron", correct: false },
      { label: "A là số hiệu nguyên tử, Z là số hạt electron cực nhỏ", correct: false },
    ],
    points: 15,
    hint: "Nhớ rằng chỉ số phía dưới Z đại diện cho số đơn vị điện tích hạt nhân (số hiệu), phía trên A là tổng số proton và neutron (số khối).",
  },
  {
    id: "fk2",
    title: "ĐỊNH NGHĨA ĐỒNG VỊ: Đồng vị là những nguyên tử có mối liên hệ như thế nào?",
    options: [
      { label: "Đồng vị là những nguyên tử có cùng số proton nhưng khác nhau về số neutron, dẫn đến khác nhau về số khối.", correct: true },
      { label: "Đồng vị là nguyên tử có cùng số neutron nhưng khác số electron vỏ.", correct: false },
      { label: "Đồng vị là những nguyên tử có cùng khối lượng nhưng số proton thay đổi tùy ý.", correct: false },
      { label: "Là các nguyên tố có cùng số hiệu khác nhau điện tích lớp vỏ.", correct: false },
    ],
    points: 15,
    hint: "Đồng vị chung một ô trong bảng tuần hoàn (cùng p, cùng vị trí) nhưng nặng nhẹ khác nhau do khác số hạt neutron.",
  },
  {
    id: "fk3",
    title: "NGUYÊN TỬ KHỐI: Một nguyên tố có 2 đồng vị: Đồng vị X chiếm 75% có khối lượng hạt là 35 amu, Đồng vị Y chiếm 25% có khối lượng hạt là 37 amu. Tính nguyên tử khối trung bình.",
    options: [
      { label: "35.5 amu", correct: true },
      { label: "36.0 amu", correct: false },
      { label: "35.8 amu", correct: false },
      { label: "35.2 amu", correct: false },
    ],
    points: 15,
    hint: "Sử dụng công thức tính Nguyên tử khối trung bình bằng tổng tỉ lệ phần trăm nhân số khối mỗi đồng vị thương cho 100.",
  },
  {
    id: "fk4",
    title: "GHÉP ĐÔI HẠT SƠ CẤP: Ghép các hạt sơ cấp với điện tích tương ứng của chúng.",
    type: "match",
    points: 20,
    hint: "Hãy nhấn lần lượt 1 hạt ở cột trái rồi nhấn tiếp 1 trị điện tích ở cột phải để ghép cặp.",
  },
  {
    id: "fk5",
    title: "SO SÁNH KHỐI LƯỢNG: So sánh khối lượng của hạt proton và hạt neutron trong hạt nhân?",
    options: [
      { label: "Khối lượng hạt proton và neutron xấp xỉ bằng nhau, gần bằng 1 amu.", correct: true },
      { label: "Khối lượng proton gấp 1000 lần khối lượng neutron.", correct: false },
      { label: "Khối lượng neutron bằng không, còn proton rất lớn.", correct: false },
      { label: "Khối lượng electron và proton bằng nhau, lớn hơn neutron.", correct: false },
    ],
    points: 10,
    hint: "Hai hạt cấu tạo hạt nhân nguyên tử đều cực kỳ nặng khi so với electron, và xấp xỉ bằng nhau.",
  },
  {
    id: "fk6",
    title: "ĐIỆN TÍCH HẠT NHÂN: Điện tích hạt nhân của nguyên tử có số hiệu Z = 11 là bao nhiêu?",
    options: [
      { label: "11", correct: false },
      { label: "-11", correct: false },
      { label: "+11", correct: true },
      { label: "+23", correct: false },
    ],
    points: 15,
    hint: "Số hiệu Z chỉ số proton. Điện tích của hạt nhân phải mang gốc dương (+).",
  },
];

interface StageTwoProps {
  onComplete: (scoreGained: number) => void;
  onAddScore: (points: number) => void;
}

export const StageTwo: React.FC<StageTwoProps> = ({ onComplete, onAddScore }) => {
  const [folkQuestions] = useState<Question[]>(() => {
    return shuffleArray(ORIGINAL_FOLK_QUESTIONS).map((q) => {
      if (q.options) {
        return {
          ...q,
          options: shuffleArray(q.options),
        };
      }
      return q;
    });
  });

  const [questionIdx, setQuestionIdx] = useState<number>(0);
  const [ropePosition, setRopePosition] = useState<number>(50); // 50 is middle, >50 close to player, <50 close to AI
  const [answeredState, setAnsweredState] = useState<"unanswered" | "correct" | "incorrect">("unanswered");
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  
  // Custom states for Interactive Matching Sub-Game (Câu 7)
  const [selectedHạt, setSelectedHạt] = useState<string | null>(null);
  const [selectedĐiệnTích, setSelectedĐiệnTích] = useState<string | null>(null);
  const [matches, setMatches] = useState<{ [key: string]: string }>({}); // e.g. { "Proton": "1+" }
  const [botSpeech, setBotSpeech] = useState<string>(
    "Sẵn sàng chưa sĩ tử khoa cử? Đeo Mũ Trạng Nguyên và dồn sức kéo co từ vựng nguyên tử với AI nào!"
  );

  const handleMatchSelect = (type: "hạt" | "điệnTích", value: string) => {
    if (answeredState !== "unanswered") return;

    if (type === "hạt") {
      setSelectedHạt(value);
      if (selectedĐiệnTích) {
        processMatch(value, selectedĐiệnTích);
      }
    } else {
      setSelectedĐiệnTích(value);
      if (selectedHạt) {
        processMatch(selectedHạt, value);
      }
    }
  };

  const processMatch = (hạt: string, điện_tích: string) => {
    const newMatches = { ...matches, [hạt]: điện_tích };
    setMatches(newMatches);
    setSelectedHạt(null);
    setSelectedĐiệnTích(null);
    soundEngine.playWhoosh();

    // Check if three match associations are configured
    const correctPairs: { [key: string]: string } = {
      "Proton (p)": "1+",
      "Electron (e)": "1-",
      "Neutron (n)": "Không mang điện",
    };

    if (Object.keys(newMatches).length === 3) {
      let allCorrect = true;
      Object.keys(newMatches).forEach((k) => {
        if (newMatches[k] !== correctPairs[k]) {
          allCorrect = false;
        }
      });

      if (allCorrect) {
        setAnsweredState("correct");
        soundEngine.playCorrect();
        const newPos = Math.min(100, ropePosition + 15);
        setRopePosition(newPos);
        const matchPoints = folkQuestions.find(q => q.type === "match")?.points || 20;
        onAddScore(matchPoints);
        setBotSpeech("Ghép cặp quá đỉnh sĩ tử ơi! Điện tích các hạt đã được xác định rõ ràng!");
      } else {
        setAnsweredState("incorrect");
        soundEngine.playIncorrect();
        const newPos = Math.max(0, ropePosition - 10);
        setRopePosition(newPos);
        setBotSpeech("Rất tiếc! Cặp ghép điện tích sai lệch khiến sợi dây bị AI kéo lùi rồi!");
      }
    }
  };

  const resetMatchSubGame = () => {
    setMatches({});
    setSelectedHạt(null);
    setSelectedĐiệnTích(null);
    setAnsweredState("unanswered");
  };

  const handleMCQOptionClick = (optIdx: number) => {
    if (answeredState !== "unanswered") return;
    const currentQ = folkQuestions[questionIdx];
    const isAnsCorrect = currentQ.options ? currentQ.options[optIdx].correct : false;

    setSelectedOpt(optIdx);
    setAnsweredState(isAnsCorrect ? "correct" : "incorrect");

    if (isAnsCorrect) {
      soundEngine.playCorrect();
      const newPos = Math.min(100, ropePosition + 12);
      setRopePosition(newPos);
      onAddScore(currentQ.points);
      setBotSpeech("Quá giỏi! Trả lời xuất sắc, kéo lùi quân AI thêm một bước nữa rồi!");
    } else {
      soundEngine.playIncorrect();
      const newPos = Math.max(0, ropePosition - 8);
      setRopePosition(newPos);
      setBotSpeech("Ui dẹ! Đáp án chưa chuẩn rồi, AI đang tranh thủ giật phăng sợi dây kìa!");
    }
  };

  const traverseToNext = () => {
    if (questionIdx < folkQuestions.length - 1) {
      setQuestionIdx((prev) => prev + 1);
      setAnsweredState("unanswered");
      setSelectedOpt(null);
      setBotSpeech("Câu kéo co từ vựng tiếp theo! Tập trung dồn toàn lực kéo nhé!");
    } else {
      // Direct Stage Complete trigger if rope favors player, otherwise final portal opens anyway
      soundEngine.playWarp();
      onComplete(60); // Completion points
    }
  };

  const currentQ = folkQuestions[questionIdx];

  // Particle position style for rope tugging visual
  const forceToOffset = (r: number) => {
    const val = r;
    return `calc(${val}% - 12px)`;
  };

  return (
    <div className="w-full max-w-[1550px] mx-auto px-4 lg:px-8 py-4 text-slate-100" id="stage-folk-panel">
      
      {/* Header block with interactive score status */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-4 pb-3 border-b border-rose-500/25">
        <div>
          <span className="px-3 py-1 text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30 rounded-full select-none uppercase tracking-widest">
            CHẶNG 2: VNM FOLK - KÉO CO TỪ VỰNG
          </span>
          <h1 className="text-2xl md:text-3xl font-bold font-sans tracking-tight text-white mt-1">
            Đấu Trường Khoa Cử Dân Gian (Vocabulary Tug-of-War)
          </h1>
        </div>
        <div className="flex items-center gap-3 mt-4 md:mt-0 select-none bg-slate-900/60 px-4 py-2 rounded-xl border border-rose-500/20">
          <Trophy className="w-5 h-5 text-yellow-400 animate-bounce" />
          <span className="text-sm font-semibold">Tỉ số kéo co: </span>
          <span className="text-rose-400 font-mono font-bold text-lg">
            {ropePosition}% Lực
          </span>
        </div>
      </div>

      {/* TUG OF WAR 3D Arena representation container */}
      <div className="w-full bg-slate-950/80 rounded-2xl border border-slate-800 p-4 shadow-2xl mb-4 relative overflow-hidden">
        {/* Dynamic Neon lights simulation */}
        <div className="absolute inset-0 bg-radial-gradient from-rose-500/5 to-cyan-500/5 pointer-events-none"></div>

        {/* Traditional Village Gate background style with glowing science accents */}
        <div className="flex justify-between items-center px-4 md:px-12 mb-2 text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-500 select-none">
          <span className="text-rose-400">Đấu Sĩ AI (Vùng Đỏ)</span>
          <span className="text-cyan-400">Trạng Nguyên Ta (Vùng Xanh)</span>
        </div>

        {/* Rope Visualization Stage - Slimmed height from h-32 to h-20 */}
        <div className="w-full h-20 bg-slate-900/50 rounded-xl relative border border-slate-800 flex items-center justify-between px-12 overflow-hidden">
          
          {/* AI Bot Side (Left) */}
          <div className="flex flex-col items-center gap-1 relative z-10 select-none">
            {/* Villain floating AI Bot wrapper */}
            <div className="w-10 h-10 rounded-full bg-rose-950/50 border border-rose-500/30 flex items-center justify-center text-red-500 shadow-lg shadow-rose-950/50">
              <span className="font-mono text-center leading-none text-[8px]">
                SYSTEM<br/>AI
              </span>
            </div>
            <span className="text-[9px] font-bold text-rose-500 leading-none">Đối Thủ</span>
          </div>

          {/* Central Tug-of-war Glowing rope line */}
          <div className="absolute left-20 right-20 h-2 bg-slate-950 border border-slate-800 rounded-full flex items-center">
            {/* Glowing neon energy thread */}
            <div className="w-full h-full bg-gradient-to-r from-rose-600 via-yellow-400 to-cyan-400 rounded-full relative">
              {/* Dynamic center rope knot representing position */}
              <div
                style={{ left: forceToOffset(ropePosition) }}
                className="absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white border-2 border-amber-400 shadow-[0_0_12px_#fff] z-30 transition-all duration-700 ease-out flex items-center justify-center cursor-pointer"
              >
                <div className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping"></div>
              </div>
            </div>
          </div>

          {/* Player Trạng Nguyên Bot Side (Right) */}
          <div className="flex flex-col items-center gap-1 relative z-10 select-none">
            <div className="w-10 h-10 rounded-full bg-cyan-950/50 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-950/50">
              <span className="font-mono text-center leading-none text-[8px]">
                BẠN CHƠI<br/>TRẠNG
              </span>
            </div>
            <span className="text-[9px] font-bold text-cyan-400 leading-none">Trạng Nguyên</span>
          </div>
        </div>

        {/* Informative text representing narrative force status */}
        <div className="text-center text-xs text-slate-400 py-0.5 font-medium select-none">
          {ropePosition > 50 ? (
            <span className="text-cyan-400 animate-pulse font-semibold">
              ★ Thế chủ động! Sợi dây đang tiến sát về phía Sân Đình của ta!
            </span>
          ) : ropePosition < 50 ? (
            <span className="text-rose-400 font-semibold">
              ⚠ Cảnh báo! Linh lực AI quá khỏe, hãy gỡ gạc bằng đáp án chính xác!
            </span>
          ) : (
            <span>Hòa khí hai bên đang cân bằng tại tâm.</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left column: AI character and dialogue speaking bubble - Removed min-h-[380px] */}
        <div className="lg:col-span-3 bg-slate-900/80 p-5 rounded-3xl border border-rose-500/10 flex flex-col items-center justify-between min-h-0 gap-3">
          <h2 className="text-xs uppercase tracking-wider text-rose-400/80 font-semibold text-center select-none">
            Linh Vật Đồng Hành Chặng Folk
          </h2>
          
          <AtomicBot
            stage={2} // Wearing Red scholar cap!
            mood={answeredState === "unanswered" ? "idle" : (answeredState === "correct" ? "happy" : "thinking")}
            speechBubble={botSpeech}
            className="my-1"
          />

          <div className="w-full mt-1 p-2.5 bg-red-950/20 rounded-xl border border-red-500/10 text-xs text-slate-400 text-center select-none">
            Đeo Mũ Trạng Nguyên tăng chí tuệ học tập, nỗ lực thắng cộc cổng kéo co.
          </div>
        </div>

        {/* Right column: Subject Question Box with expanded width to make use of screen width */}
        <div className="lg:col-span-9 bg-slate-900/60 rounded-3xl border border-slate-800 p-8 shadow-xl relative">
          
          <div className="absolute top-0 right-0 p-4 select-none">
            <span className="text-sm font-mono bg-rose-950 text-rose-300 border border-rose-800 px-3 py-1 rounded-md">
              +{currentQ.points} điểm
            </span>
          </div>

          <div className="mb-6 pb-5 border-b border-slate-800/60">
            <span className="text-sm font-bold uppercase tracking-widest text-indigo-400">
              Câu hỏi {questionIdx + 1}/{folkQuestions.length}
            </span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white mt-2 pr-16 leading-relaxed">
              {currentQ.title}
            </h2>
          </div>

          {/* Dynamic interactive quiz structures depending on type */}
          {currentQ.type === "match" ? (
            /* Interactive custom dragging matching simulation (Câu 7) */
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                
                {/* Column Left: Hạt cơ bản */}
                <div className="space-y-3">
                  <h3 className="text-base uppercase tracking-wider text-slate-300 font-extrabold mb-3">
                    Loại Hạt
                  </h3>
                  {["Proton (p)", "Electron (e)", "Neutron (n)"].map((hât) => {
                    const isSelected = selectedHạt === hât;
                    const matchedValue = matches[hât];
                    const isMatched = !!matchedValue;

                    let btnC = "bg-slate-800/40 border-slate-700 text-slate-200 cursor-pointer";
                    if (isMatched) {
                      btnC = "bg-slate-900/30 border-cyan-800 text-cyan-400 pointer-events-none line-through";
                    } else if (isSelected) {
                      btnC = "bg-cyan-950 border-cyan-500 text-cyan-100 shadow-[0_0_10px_rgba(6,182,212,0.2)]";
                    }

                    return (
                      <button
                        key={hât}
                        type="button"
                        id={`match-hat-${hât.replace(/\s+/g, '-').toLowerCase()}`}
                        onClick={() => handleMatchSelect("hạt", hât)}
                        className={`w-full p-5 text-left rounded-xl border text-lg md:text-xl font-bold transition-all flex items-center justify-between ${btnC}`}
                      >
                        <span>{hât}</span>
                        {isMatched && (
                          <span className="text-xs font-bold uppercase bg-cyan-950 px-2.5 py-1 border border-cyan-800 rounded">
                            {matchedValue}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Column Right: Điện tích tương đương */}
                <div className="space-y-3">
                  <h3 className="text-base uppercase tracking-wider text-slate-300 font-extrabold mb-3">
                    Điện Tích
                  </h3>
                  {["1-", "Không mang điện", "1+"].map((điẹn_tích) => {
                    const isSelected = selectedĐiệnTích === điẹn_tích;
                    // Check if value is matched on anyway inside records
                    const isMatched = Object.values(matches).includes(điẹn_tích);

                    let btnC = "bg-slate-800/40 border-slate-700 text-slate-200 cursor-pointer";
                    if (isMatched) {
                      btnC = "bg-slate-900/30 border-cyan-800 text-cyan-400 pointer-events-none line-through";
                    } else if (isSelected) {
                      btnC = "bg-cyan-950 border-cyan-500 text-cyan-100 shadow-[0_0_10px_rgba(6,182,212,0.2)]";
                    }

                    return (
                      <button
                        key={điẹn_tích}
                        type="button"
                        id={`match-charge-${điẹn_tích.replace(/\s+/g, '-').toLowerCase()}`}
                        onClick={() => handleMatchSelect("điệnTích", điẹn_tích)}
                        className={`w-full p-5 text-left rounded-xl border text-lg md:text-xl font-bold transition-all ${btnC}`}
                      >
                        {điẹn_tích}
                      </button>
                    );
                  })}
                </div>

              </div>

              {/* Reset matching system */}
              <div className="flex items-center justify-between bg-slate-950/60 p-5 rounded-xl border border-slate-800">
                <span className="text-sm text-slate-300 italic font-semibold">
                  Khớp cặp: Proton → 1+; Electron → 1-; Neutron → Không mang điện.
                </span>
                <button
                  type="button"
                  id="reset-match-button"
                  onClick={resetMatchSubGame}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-sm font-bold text-slate-200 flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Xóa Làm Lại</span>
                </button>
              </div>
            </div>
          ) : (
            /* Traditional MCQ Form */
            <div className="grid grid-cols-1 gap-4">
              {currentQ.options?.map((opt, oIdx) => {
                const isSelected = selectedOpt === oIdx;
                let btnStyle = "bg-slate-800/40 border-slate-700 hover:border-slate-500 text-slate-200 cursor-pointer";

                if (answeredState !== "unanswered") {
                  if (opt.correct) {
                    btnStyle = "bg-emerald-950/80 border-emerald-500 text-emerald-100 shadow-[0_0_12px_rgba(16,185,129,0.2)] pointer-events-none";
                  } else if (isSelected) {
                    btnStyle = "bg-rose-950/80 border-rose-500 text-rose-100 pointer-events-none";
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
                    id={`folk-option-${oIdx}`}
                    onClick={() => handleMCQOptionClick(oIdx)}
                    disabled={answeredState !== "unanswered"}
                    className={`w-full p-5 text-left rounded-xl border text-lg md:text-xl lg:text-2xl font-bold transition-all duration-150 flex items-center justify-between ${btnStyle}`}
                  >
                    <span>{String.fromCharCode(65 + oIdx)}. {opt.label}</span>
                    {answeredState !== "unanswered" && opt.correct && (
                      <span className="text-sm font-semibold uppercase font-mono px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded border border-emerald-500/30">
                        Chính Xác
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Navigation controller elements */}
          <div className="mt-8 pt-5 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-300 bg-slate-950/50 px-4 py-2.5 rounded-xl select-none">
              <HelpCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <span className="font-bold">Mách nước:</span>
              <span className="italic">{currentQ.hint}</span>
            </div>

            {answeredState !== "unanswered" && (
              <button
                type="button"
                id="next-tug-question-button"
                onClick={traverseToNext}
                className="w-full md:w-auto px-8 py-3.5 bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-slate-950 font-extrabold rounded-xl text-base md:text-lg tracking-wide shadow-lg shadow-rose-500/35 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{questionIdx === folkQuestions.length - 1 ? "ĐẾN TRẠM KHÔNG GIAN" : "CÂU TIẾP THEO"}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
