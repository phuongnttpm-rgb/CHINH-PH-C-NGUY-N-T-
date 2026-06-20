/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Player {
  name: string;
  score: number;
  timeSpent: number; // in seconds
  completedAt: string;
  badge: "Bronze" | "Silver" | "Gold" | "Platinum";
}

export interface Question {
  id: string;
  category: "Show" | "Folk" | "Space";
  type: "mcq" | "fillBlur" | "dragMatch" | "trueFalse" | "shortAnswer" | "reactorMath";
  title: string;
  hint?: string;
  points: number;
}

export interface CoreMemory {
  id: number;
  title: string;
  text: string;
  restored: boolean;
  avatarAccessory: string;
}

export interface TugOfWarState {
  playerForce: number; // percentage (0 - 100), 50 is center
  streak: number;
  aiForce: number;
  narrative: string;
}
