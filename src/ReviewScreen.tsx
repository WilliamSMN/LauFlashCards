import { useState, useEffect } from "react";
import { getCardsDueForReview, updateCardAfterReview } from "./api/cards";
import { calculateSM2, type ReviewQuality } from "./sm2";
import type { Card, Deck } from "./types";

interface ReviewScreenProps {
  deck: Deck;
  onBack: () => void;
}

function ReviewScreen({ deck, onBack }: ReviewScreenProps) {
    const [queue, setQueue] = useState<Card[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showBack, setShowBack] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    loadDueCards();
    }, [deck.id]);

    async function loadDueCards() {
    setLoading(true);
    const cards = await getCardsDueForReview(deck.id);
    setQueue(cards);
    setCurrentIndex(0);
    setShowBack(false);
    setLoading(false);
    }

    async function handleAnswer(quality: ReviewQuality) {
    const currentCard = queue[currentIndex];
    const result = calculateSM2(currentCard, quality);

    await updateCardAfterReview(
        currentCard.id,
        result.ease_factor,
        result.interval_days,
        result.repetitions,
        result.next_review_date
    );

    setShowBack(false);

    // Si la carte était "again", on la remet en fin de file pour la revoir tout de suite
    if (quality === "again") {
        setQueue((prev) => [...prev.slice(0, currentIndex), ...prev.slice(currentIndex + 1), currentCard]);
    } else {
        setCurrentIndex((prev) => prev + 1);
    }
    }

    if (loading) {
    return <main className="container"><p>Chargement...</p></main>;
    }

    const isFinished = queue.length > 0 && currentIndex >= queue.length;

    function handleBack(){
        setQueue([]);
        setCurrentIndex(0);
        setShowBack(false);
        onBack();
    }

    return (
    <main className="container">
        <button onClick={handleBack} className="back-button">← Retour</button>
        <h1>Révision : {deck.name}</h1>

        {isFinished ? (
        <div className="review-done">
            <p>🎉 Toutes les cartes dues ont été révisées !</p>
            <button onClick={handleBack}>Retour au paquet</button>
        </div>
        ) : queue.length === 0 ? (
        <p>Aucune carte à réviser pour l'instant. Reviens plus tard !</p>
        ) : (
        <div className="review-card">
            <p className="review-progress">{currentIndex + 1} / {queue.length}</p>

            <div className="flashcard" onClick={() => setShowBack(!showBack)}>
            <p>{showBack ? queue[currentIndex].back : queue[currentIndex].front}</p>
            {!showBack && <span className="flip-hint">Cliquer pour retourner</span>}
            </div>

            {showBack && (
            <div className="review-buttons">
                <button className="btn-again" onClick={() => handleAnswer("again")}>Encore</button>
                <button className="btn-hard" onClick={() => handleAnswer("hard")}>Difficile</button>
                <button className="btn-easy" onClick={() => handleAnswer("easy")}>Facile</button>
            </div>
            )}
        </div>
        )}
    </main>
    );
}

export default ReviewScreen;