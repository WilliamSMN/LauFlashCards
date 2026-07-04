import { useState, useEffect } from "react";
import { createDeck, getAllDecks, deleteDeck } from "./api/decks";
import type { Deck } from "./types";
import DeckDetail from "./DeckDetail";
import "./App.css";

function App() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [newDeckName, setNewDeckName] = useState("");
  const [newDeckDescription, setNewDeckDescription] = useState("");
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);

  async function loadDecks() {
    const result = await getAllDecks();
    setDecks(result);
  }

  useEffect(() => {
    loadDecks();
  }, []);

  async function handleCreateDeck(e: React.FormEvent) {
    e.preventDefault();
    if (!newDeckName.trim()) return;

    await createDeck(newDeckName, newDeckDescription);
    setNewDeckName("");
    setNewDeckDescription("");
    await loadDecks();
  }

  async function handleDeleteDeck(id: number) {
    await deleteDeck(id);
    await loadDecks();
  }

  // Si un deck est sélectionné, on affiche l'écran de détail à la place
  if (selectedDeck) {
    return (
      <DeckDetail
        deck={selectedDeck}
        onBack={() => setSelectedDeck(null)}
      />
    );
  }

  return (
    <main className="container">
      <h1>Mes paquets de flashcards</h1>

      <form onSubmit={handleCreateDeck} className="deck-form">
        <input
          placeholder="Nom du paquet (ex: Espagnol)"
          value={newDeckName}
          onChange={(e) => setNewDeckName(e.target.value)}
        />
        <input
          placeholder="Description (optionnel)"
          value={newDeckDescription}
          onChange={(e) => setNewDeckDescription(e.target.value)}
        />
        <button type="submit">Créer le paquet</button>
      </form>

      <ul className="deck-list">
        {decks.map((deck) => (
          <li key={deck.id} className="deck-item">
            <div onClick={() => setSelectedDeck(deck)} style={{ cursor: "pointer", flex: 1 }}>
              <strong>{deck.name}</strong>
              {deck.description && <p>{deck.description}</p>}
            </div>
            <button onClick={() => handleDeleteDeck(deck.id)}>Supprimer</button>
          </li>
        ))}
      </ul>

      {decks.length === 0 && <p>Aucun paquet pour l'instant. Crée le premier ci-dessus !</p>}
    </main>
  );
}

export default App;