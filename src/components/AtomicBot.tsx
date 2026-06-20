/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

interface AtomicBotProps {
  stage: 1 | 2 | 3;
  mood?: "idle" | "happy" | "thinking" | "talking";
  speechBubble?: string;
  className?: string;
}

export const AtomicBot: React.FC<AtomicBotProps> = ({
  stage,
  mood = "idle",
  speechBubble,
  className = "",
}) => {
  // Determine eye expression based on mood
  const renderEyes = () => {
    switch (mood) {
      case "happy":
        return (
          <>
            {/* Left Happy Curved Eye */}
            <path
              d="M135 145 Q145 130 155 145"
              fill="none"
              stroke="#06b6d4"
              strokeWidth="5.5"
              strokeLinecap="round"
              className="animate-pulse"
            />
            {/* Right Happy Curved Eye */}
            <path
              d="M165 145 Q175 130 185 145"
              fill="none"
              stroke="#06b6d4"
              strokeWidth="5.5"
              strokeLinecap="round"
              className="animate-pulse"
            />
          </>
        );
      case "thinking":
        return (
          <>
            {/* Left Flat questioning eye */}
            <line
              x1="135"
              y1="140"
              x2="155"
              y2="140"
              stroke="#fbbf24"
              strokeWidth="5"
              strokeLinecap="round"
            />
            {/* Right Curious curved eye */}
            <path
              d="M165 145 Q175 135 185 140"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </>
        );
      case "talking":
        return (
          <>
            {/* Glowing active speak wave bars */}
            <rect
              x="136"
              y="135"
              width="6"
              height="15"
              rx="3"
              fill="#06b6d4"
              className="animate-[bounce_0.6s_infinite_alternate]"
            />
            <rect
              x="146"
              y="130"
              width="6"
              height="25"
              rx="3"
              fill="#22d3ee"
              className="animate-[bounce_0.6s_infinite_alternate_0.2s]"
            />
            <rect
              x="156"
              y="133"
              width="6"
              height="19"
              rx="3"
              fill="#06b6d4"
              className="animate-[bounce_0.6s_infinite_alternate_0.1s]"
            />
            <rect
              x="166"
              y="128"
              width="6"
              height="29"
              rx="3"
              fill="#22d3ee"
              className="animate-[bounce_0.6s_infinite_alternate_0.3s]"
            />
            <rect
              x="176"
              y="135"
              width="6"
              height="15"
              rx="3"
              fill="#06b6d4"
              className="animate-[bounce_0.6s_infinite_alternate_0.15s]"
            />
          </>
        );
      case "idle":
      default:
        return (
          <>
            {/* Standard circular glowing cyan AI displays */}
            <circle cx="145" cy="142" r="7" fill="#06b6d4" className="animate-pulse">
              <animate attributeName="r" values="7;5;7" dur="2.5s" repeatCount="indefinite" />
            </circle>
            <circle cx="175" cy="142" r="7" fill="#06b6d4" className="animate-pulse">
              <animate attributeName="r" values="7;5;7" dur="2.5s" repeatCount="indefinite" />
            </circle>
            {/* Screen digital line */}
            <path
              d="M152 153 Q160 156 168 153"
              fill="none"
              stroke="#22d3ee"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </>
        );
    }
  };

  const renderHat = () => {
    // Stage 2: Mũ trạng nguyên (Red Vietnamese Scholar Cap)
    if (stage === 2) {
      return (
        <g id="mu-trang-nguyen">
          {/* Main Scholar Cap Body: Deep Red and Gold trim */}
          <path
            d="M125 102 C125 78, 195 78, 195 102 Z"
            fill="#dc2626"
            stroke="#eab308"
            strokeWidth="3.5"
          />
          <path
            d="M115 102 H205 V109 H115 Z"
            fill="#eab308"
            stroke="#9a3412"
            strokeWidth="1.5"
            className="drop-shadow-md"
          />
          <circle cx="160" cy="90" r="6" fill="#facc15" />
          <circle cx="160" cy="90" r="3" fill="#dc2626" />
          
          {/* Scholar Cap Wings (Chuồn chuồn / Wings of Trạng Nguyên hat) */}
          {/* Left Wing */}
          <path
            d="M115 105 Q65 112, 55 102 Q55 95, 75 99 Q115 102, 115 105"
            fill="#cb2020"
            stroke="#eab308"
            strokeWidth="2"
          />
          <circle cx="58" cy="100" r="4.5" fill="#facc15" />

          {/* Right Wing */}
          <path
            d="M205 105 Q255 112, 265 102 Q265 95, 245 99 Q205 102, 205 105"
            fill="#cb2020"
            stroke="#eab308"
            strokeWidth="2"
          />
          <circle cx="262" cy="100" r="4.5" fill="#facc15" />
          
          {/* Hanging Red Tassels */}
          <path d="M75 100 V122" stroke="#dc2626" strokeWidth="2.5" />
          <circle cx="75" cy="123" r="3.5" fill="#facc15" />
          
          <path d="M245 100 V122" stroke="#dc2626" strokeWidth="2.5" />
          <circle cx="245" cy="123" r="3.5" fill="#facc15" />
        </g>
      );
    }

    // Stage 3: Space Astronaut Helmet Visor
    if (stage === 3) {
      return (
        <g id="space-helmet">
          {/* Futuristic Headset antennas */}
          <line x1="110" y1="140" x2="90" y2="135" stroke="#06b6d4" strokeWidth="4.5" />
          <circle cx="87" cy="134" r="5" fill="#22d3ee" className="animate-ping" />
          
          <line x1="210" y1="140" x2="230" y2="135" stroke="#06b6d4" strokeWidth="4.5" />
          <circle cx="233" cy="134" r="5" fill="#22d3ee" />

          {/* Helmet Dome glass reflection */}
          <path
            d="M112 140 C108 95, 212 95, 208 140"
            fill="none"
            stroke="rgba(34, 211, 238, 0.45)"
            strokeWidth="4"
          />
          {/* Glass glare */}
          <path
            d="M130 110 A 30 30 0 0 1 185 110"
            fill="none"
            stroke="rgba(255, 255, 255, 0.6)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Futuristic HUD display around ears */}
          <circle cx="115" cy="140" r="14" fill="none" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="3,3" />
          <circle cx="205" cy="140" r="14" fill="none" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="3,3" />
        </g>
      );
    }

    // Stage 1: Standard orbiting electrons
    return (
      <g id="standard-orbits">
        {/* Ring 1 - Vertical electron orbit */}
        <ellipse
          cx="160"
          cy="140"
          rx="58"
          ry="15"
          fill="none"
          stroke="rgba(6, 182, 212, 0.6)"
          strokeWidth="1.5"
          transform="rotate(35, 160, 140)"
        />
        {/* Electron 1 ball */}
        <g className="animate-[spin_4s_linear_infinite]" style={{ transformOrigin: "160px 140px" }}>
          <circle cx="218" cy="140" r="4.5" fill="#22d3ee" className="shadow-[0_0_8px_#22d3ee]" />
        </g>

        {/* Ring 2 - Opposite rotated electron orbit */}
        <ellipse
          cx="160"
          cy="140"
          rx="58"
          ry="15"
          fill="none"
          stroke="rgba(245, 158, 11, 0.6)"
          strokeWidth="1.5"
          transform="rotate(-35, 160, 140)"
        />
        {/* Electron 2 ball */}
        <g className="animate-[spin_3s_linear_infinite_reverse]" style={{ transformOrigin: "160px 140px" }}>
          <circle cx="102" cy="140" r="4.5" fill="#fbbf24" className="shadow-[0_0_8px_#fbbf24]" />
        </g>
      </g>
    );
  };

  return (
    <div className={`flex flex-col items-center gap-3 select-none ${className}`}>
      {/* Balloon speak bubble if text exists */}
      {speechBubble && (
        <div className="relative max-w-sm sm:max-w-md md:max-w-lg px-6 py-5 text-base md:text-lg lg:text-xl font-extrabold text-slate-900 bg-white border-3 border-cyan-400 rounded-3xl shadow-2xl shadow-cyan-500/10 animate-fade-in-down">
          <p className="leading-relaxed text-center text-slate-900 tracking-wide">{speechBubble}</p>
          {/* Arrow */}
          <div className="absolute left-1/2 -bottom-2 w-4.5 h-4.5 bg-white border-r-3 border-b-3 border-cyan-400 rotate-45 -translate-x-1/2"></div>
        </div>
      )}

      {/* Floating SVG Bot */}
      <div className="relative w-44 h-44 animate-[bounce_3s_ease-in-out_infinite] hover:scale-105 transition-all duration-300">
        <svg
          viewBox="40 50 240 180"
          width="100%"
          height="100%"
          className="filter drop-shadow-[0_12px_16px_rgba(6,182,212,0.15)]"
        >
          {/* Shadow beneath robot to represent floating depth */}
          <ellipse
            cx="160"
            cy="195"
            rx="35"
            ry="6"
            fill="rgba(2, 6, 23, 0.35)"
            className="animate-[pulse_1.5s_infinite_alternate]"
          />

          {/* Under-glow thruster light stream */}
          <path
            d="M148 168 L160 190 L172 168 Z"
            fill="url(#thrusterGlow)"
            className="animate-pulse"
          />

          {/* Core metallic main chassis */}
          {/* Outer case dark-metal */}
          <circle cx="160" cy="140" r="40" fill="#1e293b" stroke="#334155" strokeWidth="3" />
          
          {/* Glowing blue central screen visor mapping */}
          <path
            d="M125 130 C125 125, 195 125, 195 130 L195 152 C195 158, 125 158, 125 152 Z"
            fill="#0f172a"
            stroke="#0ec5e9"
            strokeWidth="2"
          />

          {/* Inner details / glowing accents */}
          <line x1="130" y1="120" x2="190" y2="120" stroke="rgba(34, 211, 238, 0.4)" strokeWidth="1" />
          <circle cx="160" cy="113" r="3" fill="#06b6d4" />

          {/* Render face elements */}
          {renderEyes()}

          {/* Render accessory/hat above head */}
          {renderHat()}

          {/* Decorative metal rivets / bolts */}
          <circle cx="127" cy="116" r="1.5" fill="#64748b" />
          <circle cx="193" cy="116" r="1.5" fill="#64748b" />
          <circle cx="160" cy="172" r="2.5" fill="#06b6d4" />

          {/* Gradients definitions */}
          <defs>
            <linearGradient id="thrusterGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#0891b2" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0891b2" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};
