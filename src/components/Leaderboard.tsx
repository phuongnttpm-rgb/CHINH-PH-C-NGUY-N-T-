/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { soundEngine } from "../utils/SoundEngine";
import { Trophy, RefreshCw, Calendar, Sparkles, User, Medal } from "lucide-react";

interface LeaderboardProps {
  finalScore: number;
  timeSpent: number;
  onRestart: () => void;
}

interface RankItem {
  name: string;
  score: number;
  timeSpent: number;
  completedAt: string;
  badge: "Bronze" | "Silver" | "Gold" | "Platinum";
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ finalScore, timeSpent, onRestart }) => {
  const [playerName, setPlayerName] = useState<string>("");
  const [saved, setSaved] = useState<boolean>(false);
  const [rankList, setRankList] = useState<RankItem[]>([]);

  // Built-in historical science masters
  const defaultScientificLeaders: RankItem[] = [
    {
      name: "Marie Curie",
      score: 180,
      timeSpent: 120, // 2 mins
      completedAt: "2026-06-19 14:24",
      badge: "Platinum",
    },
    {
      name: "Ernest Rutherford",
      score: 170,
      timeSpent: 145,
      completedAt: "2026-06-18 10:15",
      badge: "Platinum",
    },
    {
      name: "Dmitri Mendeleev",
      score: 160,
      timeSpent: 180,
      completedAt: "2026-06-17 08:30",
      badge: "Gold",
    },
    {
      name: "Atomic-AI",
      score: 140,
      timeSpent: 130,
      completedAt: "2026-06-19 22:11",
      badge: "Gold",
    },
    {
      name: "Lavoisier",
      score: 110,
      timeSpent: 210,
      completedAt: "2026-06-15 16:45",
      badge: "Silver",
    },
  ];

  useEffect(() => {
    // Load historical entries
    const cached = localStorage.getItem("atomic_journey_leaderboard");
    if (cached) {
      try {
        setRankList(JSON.parse(cached));
      } catch (e) {
        setRankList(defaultScientificLeaders);
      }
    } else {
      setRankList(defaultScientificLeaders);
    }
  }, []);

  const handleRegisterName = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) return;

    // Determine target badge based on score
    let badge: "Bronze" | "Silver" | "Gold" | "Platinum" = "Bronze";
    if (finalScore >= 160) badge = "Platinum";
    else if (finalScore >= 130) badge = "Gold";
    else if (finalScore >= 95) badge = "Silver";

    const formattedTime = new Date().toISOString().replace("T", " ").substring(0, 16);

    const newLeader: RankItem = {
      name: playerName.trim(),
      score: finalScore,
      timeSpent: timeSpent,
      completedAt: formattedTime,
      badge: badge,
    };

    // Append and sort
    const mergedList = [...rankList, newLeader].sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score; // Higher score first
      }
      return a.timeSpent - b.timeSpent; // Faster time second
    });

    localStorage.setItem("atomic_journey_leaderboard", JSON.stringify(mergedList));
    setRankList(mergedList);
    setSaved(true);
    soundEngine.playTing();
  };

  // Turn duration into pretty readable minutes:seconds
  const formatSec = (totSec: number) => {
    const mins = Math.floor(totSec / 60);
    const secs = totSec % 60;
    return `${mins} phút ${secs} giây`;
  };

  return (
    <div className="w-full max-w-[1550px] mx-auto px-4 lg:px-8 py-6 text-slate-100" id="leaderboard-panel">
      
      {/* Glow Ambient Decoration */}
      <div className="text-center mb-10 select-none">
        <Medal className="w-14 h-14 text-amber-400 mx-auto animate-bounce mb-3" />
        <h1 className="text-3xl md:text-5xl font-extrabold font-sans text-white tracking-tight">
          BẢNG XẾP HẠNG PHÚ QUÝ
        </h1>
        <p className="text-sm text-cyan-400 mt-2 font-mono uppercase tracking-widest">
          Hội tụ Anh Hùng Nguyên Tử Khắp Hệ Mặt Trời
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Player performance certificate & Register form */}
        <div className="md:col-span-4 space-y-6">
          <div className="bg-gradient-to-br from-slate-900 to-cyan-950/40 p-6 rounded-3xl border border-cyan-500/20 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle,rgba(6,182,212,0.1),transparent_60%)] pointer-events-none"></div>

            <h2 className="text-base uppercase font-extrabold text-cyan-400 tracking-wider mb-4 border-b-2 border-cyan-500/15 pb-2">
              Chứng Nhận Kỷ Lục Sĩ Tử
            </h2>

            <div className="space-y-4">
              <div>
                <span className="text-xs text-slate-400 font-bold uppercase select-none">Tổng điểm đạt được</span>
                <div className="text-4xl font-mono font-black text-white">
                  {finalScore} <span className="text-sm font-sans font-medium text-slate-400">điểm</span>
                </div>
              </div>

              <div>
                <span className="text-xs text-slate-400 font-bold uppercase select-none">Thời gian hoàn tất</span>
                <div className="text-2xl font-black text-slate-200">
                  {formatSec(timeSpent)}
                </div>
              </div>

              <div>
                <span className="text-xs text-slate-400 font-bold uppercase select-none">Danh hiệu đạt chuẩn</span>
                <div className="mt-1">
                  {finalScore >= 160 ? (
                    <span className="px-3 py-1 bg-gradient-to-r from-cyan-500 to-indigo-500 text-slate-950 font-extrabold text-sm rounded-full uppercase tracking-widest shadow-[0_0_10px_rgba(6,182,212,0.4)]">
                      🎓 Platinum Trạng Nguyên
                    </span>
                  ) : finalScore >= 130 ? (
                    <span className="px-3 py-1 bg-amber-500 text-slate-950 font-extrabold text-sm rounded-full uppercase tracking-widest">
                      🏅 Gold Bác Sĩ Càn Khôn
                    </span>
                  ) : finalScore >= 95 ? (
                    <span className="px-3 py-1 bg-slate-300 text-slate-950 font-extrabold text-sm rounded-full uppercase tracking-widest">
                      🥈 Silver Tiến Sĩ Nhỏ
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-amber-700 text-slate-200 font-extrabold text-sm rounded-full uppercase tracking-widest">
                      🥉 Bronze Tập Sự Nguyên Tử
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Registration Form */}
            {!saved ? (
              <form onSubmit={handleRegisterName} className="mt-8 pt-6 border-t border-slate-800 space-y-3">
                <label className="block text-sm font-black text-slate-300" htmlFor="nickname-input">
                  Khắc tên bảng vàng
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="nickname-input"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Nhập tên vinh dự của sĩ tử..."
                    maxLength={15}
                    className="w-full px-4 py-3.5 bg-slate-950 border border-slate-700 rounded-xl text-base text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <button
                  type="submit"
                  id="register-score-button"
                  disabled={!playerName.trim()}
                  className="w-full py-4 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-sm rounded-xl transition-all shadow-lg shadow-amber-500/10 cursor-pointer disabled:opacity-50"
                >
                  XÁC NHẬN GHI DANH PHÚ QUÝ
                </button>
              </form>
            ) : (
              <div className="mt-8 pt-6 border-t border-slate-800 text-center text-sm font-black text-emerald-400 flex items-center justify-center gap-1.5 bg-emerald-500/10 py-4 rounded-xl select-none">
                <Sparkles className="w-5 h-5 animate-spin text-amber-400 shrink-0" />
                <span>Hoàn tất khắc bảng vàng thành công!</span>
              </div>
            )}
          </div>

          <button
            type="button"
            id="global-restart-btn"
            onClick={onRestart}
            className="w-full py-4.5 bg-slate-900 hover:bg-slate-800 border-2 border-slate-700 hover:border-slate-500 text-white font-black rounded-2xl text-base transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-5 h-5" />
            <span>KHIÊU CHIẾN LẠI TỪ ĐẦU</span>
          </button>
        </div>

        {/* Right Column: Leaderboard scroll entries list */}
        <div className="md:col-span-8 bg-slate-900/60 rounded-3xl border border-slate-800 p-8 shadow-xl relative overflow-hidden">
          
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <Trophy className="w-6 h-6 text-amber-400" />
              <span>Ghi Danh Cao Thủ Khoa Học</span>
            </h2>
            <span className="text-xs text-slate-400 font-medium italic">
              * Ưu tiên: Điểm tối đa → Thời gian nhanh chân
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left" id="rank-table">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-xs md:text-sm font-extrabold uppercase tracking-widest pb-3">
                  <th className="py-2.5 pl-3">Hạng</th>
                  <th className="py-2.5 pl-2">Sĩ tử khoa học</th>
                  <th className="py-2.5">Tổng Điểm</th>
                  <th className="py-2.5">Thời Gian</th>
                  <th className="py-2.5 text-right pr-3">Danh Hiệu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {rankList.map((item, idx) => {
                  const isTop3 = idx < 3;
                  let medalColor = "text-slate-400";
                  if (idx === 0) medalColor = "text-yellow-400 text-xl";
                  else if (idx === 1) medalColor = "text-slate-300";
                  else if (idx === 2) medalColor = "text-amber-600";

                  return (
                    <tr
                      key={idx}
                      className={`hover:bg-slate-800/20 transition-all ${
                        item.name === playerName ? "bg-cyan-950/20 border-y border-cyan-800/30" : ""
                      }`}
                    >
                      {/* Rank order numbering */}
                      <td className="py-4 pl-3 font-mono font-black select-none text-base">
                        {isTop3 ? (
                          <span className={`font-black ${medalColor}`}>
                            {idx === 0 ? "🥇" : idx === 1 ? "🥈" : "🥉"}
                          </span>
                        ) : (
                          <span className="text-slate-500">{idx + 1}</span>
                        )}
                      </td>

                      {/* Name profile card mapping */}
                      <td className="py-4 pl-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-slate-950 flex items-center justify-center text-slate-400 text-xs border border-slate-800">
                            <User className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-base font-extrabold text-white block">
                              {item.name}
                            </span>
                            <span className="text-xs text-slate-500 font-mono block mt-0.5">
                              {item.completedAt}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Total score */}
                      <td className="py-4 font-mono font-black text-cyan-400 text-base md:text-lg">
                        {item.score} <span className="text-xs text-slate-500 font-sans font-medium">pts</span>
                      </td>

                      {/* Duration timer */}
                      <td className="py-4 font-mono text-sm md:text-base text-slate-300 font-bold">
                        {item.timeSpent}s
                      </td>

                      {/* Award Badge tag */}
                      <td className="py-4 pr-3 text-right">
                        <span
                          className={`text-[10px] md:text-xs font-black px-3 py-1 rounded uppercase tracking-wider ${
                            item.badge === "Platinum"
                              ? "bg-cyan-950 text-cyan-300 border border-cyan-800"
                              : item.badge === "Gold"
                                ? "bg-amber-950 text-amber-300 border border-amber-800"
                                : item.badge === "Silver"
                                  ? "bg-slate-900 border border-slate-700 text-slate-300"
                                  : "bg-red-950 text-red-300 border border-red-900"
                          }`}
                        >
                          {item.badge}
                        </span>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>

      </div>

    </div>
  );
};
