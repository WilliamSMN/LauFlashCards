export interface Deck {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
}

export interface Card {
  id: number;
  deck_id: number;
  front: string;
  back: string;
  created_at: string;
  ease_factor: number;
  interval_days: number;
  repetitions: number;
  next_review_date: string;
}