import { useState, useEffect } from "react";
import { createDeck, getAllDecks, deleteDeck } from "./api/decks";
import type { Deck } from "./types";
import DeckDetail from "./DeckDetail";
import DeckCreation from "./DeckCreation"
import "./App.css";

function App() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
  const [deckCreation, setDeckCreation] = useState(false);

  async function loadDecks() {
    const result = await getAllDecks();
    setDecks(result);
  }

  async function handleBackFromCreation() {
    setDeckCreation(false);
    await loadDecks();
  }

  useEffect(() => {
    loadDecks();
  }, []);


  async function handleDeleteDeck(id: number) {
    await deleteDeck(id);
    await loadDecks();
  }

  if (selectedDeck) {
    return (
      <DeckDetail
        deck={selectedDeck}
        onBack={() => setSelectedDeck(null)}
      />
    );
  }

  if (deckCreation) {
        return <DeckCreation onBack={() => handleBackFromCreation()} />;
    }

  return (
    <main className="container">
      <div className="page-header">
        <h1>LauFlashCards</h1>
        <button onClick={() => setDeckCreation(true)} className="add-button">+</button>
      </div>

      <div className="scrollable-area">
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
      </div>
    </main>
  );
}

export default App;