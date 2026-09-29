import { useState } from "react";
import { createDeck } from "./api/decks";

interface DeckCreationScreenProps {
  onBack: () => void;
}

function DeckCreation({ onBack }: DeckCreationScreenProps) {
  const [newDeckName, setNewDeckName] = useState("");
  const [newDeckDescription, setNewDeckDescription] = useState("");


  async function handleCreateDeck(e: React.FormEvent) {
    e.preventDefault();
    if (!newDeckName.trim()) return;

    await createDeck(newDeckName, newDeckDescription);
    setNewDeckName("");
    setNewDeckDescription("");
    onBack();
  }

  return (
    <main className="container deck-creation-container">
      <form onSubmit={handleCreateDeck} className="deck-form deck-creation-form">
        <h1>Nouveau paquet</h1>
        <input
          placeholder="Nom du paquet"
          value={newDeckName}
          onChange={(e) => setNewDeckName(e.target.value)}
        />
        <input
          placeholder="Description (optionnel)"
          value={newDeckDescription}
          onChange={(e) => setNewDeckDescription(e.target.value)}
        />
        <div className="deck-creation-actions">
          <button type="button" onClick={onBack} className="cancel-button">
            Annuler
          </button>
          <button type="submit">Créer le paquet</button>
        </div>
      </form>
    </main>
  );
}

export default DeckCreation;