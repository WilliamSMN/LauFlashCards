import { getDb } from '../db';
import type { Deck } from '../types';

export async function createDeck(name: string, description?: string): Promise<void> {
  const db = await getDb();
  await db.execute(
    'INSERT INTO decks (name, description) VALUES ($1, $2)',
    [name, description ?? null]
  );
}

export async function getAllDecks(): Promise<Deck[]> {
  const db = await getDb();
  return await db.select<Deck[]>('SELECT * FROM decks ORDER BY created_at DESC');
}

export async function deleteDeck(id: number): Promise<void> {
  const db = await getDb();
  await db.execute('DELETE FROM decks WHERE id = $1', [id]);
}