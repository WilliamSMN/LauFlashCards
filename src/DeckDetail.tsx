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
    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const [showResetToast, setShowResetToast] = useState(false);

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

    async function confirmResetProgress() {
        setShowResetConfirm(false);
        await resetCardsProgress(deck.id);
        await loadCards();

        setShowResetToast(true);
        setTimeout(() => setShowResetToast(false), 2500);
    }

    if (reviewing) {
        return <ReviewScreen deck={deck} onBack={() => setReviewing(false)} />;
    }

    return (
        <main className="container">
            <button onClick={onBack} className="back-button">← Retour aux paquets</button>

            <div className="deck-header">
            <div className="deck-header-top">
                <div>
                <h1>{deck.name}</h1>
                {deck.description && <p className="deck-description">{deck.description}</p>}
                </div>
                <button onClick={() => setReviewing(true)} className="review-button">
                Réviser
                </button>
            </div>

            <div className="deck-meta">
                <span>{cards.length} carte{cards.length > 1 ? "s" : ""}</span>
                <button onClick={() => setShowResetConfirm(true)} className="reset-link">
                Réinitialiser la progression
                </button>
            </div>
            </div>

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

            <div className="scrollable-area">
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
            </div>

            {showResetConfirm && (
                <div className="modal-overlay" onClick={() => setShowResetConfirm(false)}>
                    <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                        <h2>Réinitialiser la progression ?</h2>
                        <p>Toutes les cartes de ce paquet reviendront à leur état initial. Cette action est irréversible.</p>
                        <div className="modal-actions">
                            <button onClick={() => setShowResetConfirm(false)} className="cancel-button">
                                Annuler
                            </button>
                            <button onClick={confirmResetProgress} className="confirm-danger-button">
                                Réinitialiser
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showResetToast && (
                <div className="toast">
                    ✓ Progression réinitialisée
                </div>
            )}
        </main>
    );
}

export default DeckDetail;