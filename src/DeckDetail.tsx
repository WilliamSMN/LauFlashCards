import { useState, useEffect } from "react";
import { getCardsByDeck, createCard, deleteCard, resetCardsProgress } from "./api/cards";
import type { Card, Deck } from "./types";
import ReviewScreen from "./ReviewScreen";

interface DeckDetailProps {
  deck: Deck;
  onBack: () => void;
}

function DeckDetail({ deck, onBack }: DeckDetailProps) {
    const [cards, setCards] = useState<Card[]>([]);
    const [front, setFront] = useState("");
    const [back, setBack] = useState("");
    const [reviewing, setReviewing] = useState(false);

    async function loadCards() {
    const result = await getCardsByDeck(deck.id);
    setCards(result);
    }

    useEffect(() => {
    loadCards();
    }, [deck.id]);

    async function handleAddCard(e: React.FormEvent) {
    e.preventDefault();
    if (!front.trim() || !back.trim()) return;

    await createCard(deck.id, front, back);
    setFront("");
    setBack("");
    await loadCards();
    }

    async function handleDeleteCard(id: number) {
    await deleteCard(id);
    await loadCards();
    }

    async function handleResetProgress() {
        const confirmed = window.confirm(
            "Réinitialiser la progression de toutes les cartes de ce paquet ?"
        );
        if (!confirmed) return;

        await resetCardsProgress(deck.id);
        await loadCards();
    }

    if (reviewing) {
        return <ReviewScreen deck={deck} onBack={() => setReviewing(false)} />;
    }

    return (
    <main className="container">
        <button onClick={onBack} className="back-button">← Retour aux paquets</button>
        <h1>{deck.name}</h1>
        <button onClick={() => setReviewing(true)} className="review-button">
            Réviser ce paquet
        </button>
        <button onClick={handleResetProgress} className="reset-button">
            Réinitialiser la progression
        </button>
        {deck.description && <p>{deck.description}</p>}

        <form onSubmit={handleAddCard} className="card-form">
        <input
            placeholder="Recto (question)"
            value={front}
            onChange={(e) => setFront(e.target.value)}
        />
        <input
            placeholder="Verso (réponse)"
            value={back}
            onChange={(e) => setBack(e.target.value)}
        />
        <button type="submit">Ajouter la carte</button>
        </form>

        <ul className="card-list">
        {cards.map((card) => (
            <li key={card.id} className="card-item">
            <div>
                <strong>{card.front}</strong>
                <p>{card.back}</p>
            </div>
            <button onClick={() => handleDeleteCard(card.id)}>Supprimer</button>
            </li>
        ))}
        </ul>

        {cards.length === 0 && <p>Aucune carte pour l'instant. Ajoute la première ci-dessus !</p>}
    </main>
    );
}

export default DeckDetail;