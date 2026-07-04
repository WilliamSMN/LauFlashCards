import { getDb } from '../db';
import type { Card } from '../types';

export async function createCard(deckId: number, front: string, back: string): Promise<void> {
  const db = await getDb();
  await db.execute(
    'INSERT INTO cards (deck_id, front, back) VALUES ($1, $2, $3)',
    [deckId, front, back]
  );
}

export async function getCardsByDeck(deckId: number): Promise<Card[]> {
  const db = await getDb();
  return await db.select<Card[]>(
    'SELECT * FROM cards WHERE deck_id = $1 ORDER BY created_at ASC',
    [deckId]
  );
}

export async function deleteCard(id: number): Promise<void> {
  const db = await getDb();
  await db.execute('DELETE FROM cards WHERE id = $1', [id]);
}

export async function getCardsDueForReview(deckId: number): Promise<Card[]> {
  const db = await getDb();
  return await db.select<Card[]>(
    `SELECT * FROM cards 
     WHERE deck_id = $1 AND next_review_date <= datetime('now') 
     ORDER BY next_review_date ASC`,
    [deckId]
  );
}

export async function updateCardAfterReview(
  cardId: number,
  ease_factor: number,
  interval_days: number,
  repetitions: number,
  next_review_date: string
): Promise<void> {
  const db = await getDb();
  await db.execute(
    `UPDATE cards 
     SET ease_factor = $1, interval_days = $2, repetitions = $3, next_review_date = $4 
     WHERE id = $5`,
    [ease_factor, interval_days, repetitions, next_review_date, cardId]
  );
}

export async function resetCardsProgress(deckId: number): Promise<void> {
  const db = await getDb();
  await db.execute(
    `UPDATE cards 
     SET ease_factor = 2.5, interval_days = 0, repetitions = 0, next_review_date = datetime('now')
     WHERE deck_id = $1`,
    [deckId]
  );
}