import type { Card } from "./types";

export type ReviewQuality = "again" | "hard" | "easy";

export interface SM2Result {
  ease_factor: number;
  interval_days: number;
  repetitions: number;
  next_review_date: string;
}

export function calculateSM2(card: Card, quality: ReviewQuality): SM2Result {
  let { ease_factor, interval_days, repetitions } = card;

  if (quality === "again") {
    // Mauvaise réponse : on repart de zéro, la carte revient vite
    repetitions = 0;
    interval_days = 0; // sera revue dans la même session ou le lendemain
    ease_factor = Math.max(1.3, ease_factor - 0.2);
  } else {
    // Bonne réponse (hard ou easy)
    repetitions += 1;

    if (repetitions === 1) {
      interval_days = 1;
    } else if (repetitions === 2) {
      interval_days = 6;
    } else {
      interval_days = Math.round(interval_days * ease_factor);
    }

    if (quality === "hard") {
      ease_factor = Math.max(1.3, ease_factor - 0.15);
    } else {
      ease_factor = ease_factor + 0.1;
    }
  }

  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + interval_days);

  return {
    ease_factor: Math.round(ease_factor * 100) / 100,
    interval_days,
    repetitions,
    next_review_date: nextDate.toISOString(),
  };
}