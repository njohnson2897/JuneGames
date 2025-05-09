import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";

const Memory = () => {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [score, setScore] = useState(0);
  const [consecutiveMatches, setConsecutiveMatches] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [moves, setMoves] = useState(0);

  const colors = [
    "red",
    "blue",
    "green",
    "yellow",
    "purple",
    "orange",
    "pink",
    "cyan",
    "red",
    "blue",
    "green",
    "yellow",
    "purple",
    "orange",
    "pink",
    "cyan",
  ];

  const initializeGame = useCallback(() => {
    const shuffledColors = [...colors].sort(() => Math.random() - 0.5);
    const newCards = shuffledColors.map((color, index) => ({
      id: index,
      color,
      isFlipped: false,
      isMatched: false,
    }));
    setCards(newCards);
    setFlippedCards([]);
    setMatchedPairs([]);
    setScore(0);
    setConsecutiveMatches(0);
    setGameWon(false);
    setMoves(0);
  }, []);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const handleCardClick = (clickedCard) => {
    // Prevent clicking if:
    // 1. Card is already flipped
    // 2. Two cards are already flipped
    // 3. Card is already matched
    if (
      flippedCards.length === 2 ||
      flippedCards.includes(clickedCard.id) ||
      matchedPairs.includes(clickedCard.id)
    ) {
      return;
    }

    const newFlippedCards = [...flippedCards, clickedCard.id];
    setFlippedCards(newFlippedCards);

    // Update cards state to show flipped card
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === clickedCard.id ? { ...card, isFlipped: true } : card
      )
    );

    // If this is the second card, check for a match
    if (newFlippedCards.length === 2) {
      setMoves((prev) => prev + 1);
      const [firstCardId, secondCardId] = newFlippedCards;
      const firstCard = cards.find((card) => card.id === firstCardId);
      const secondCard = cards.find((card) => card.id === secondCardId);

      if (firstCard.color === secondCard.color) {
        // Match found
        setMatchedPairs((prev) => [...prev, firstCardId, secondCardId]);
        setConsecutiveMatches((prev) => prev + 1);
        setScore((prev) => prev + 100 * (consecutiveMatches + 1));
        setFlippedCards([]);

        // Check if all pairs are matched
        if (matchedPairs.length + 2 === colors.length) {
          setGameWon(true);
        }
      } else {
        // No match
        setConsecutiveMatches(0);
        setTimeout(() => {
          setCards((prevCards) =>
            prevCards.map((card) =>
              newFlippedCards.includes(card.id)
                ? { ...card, isFlipped: false }
                : card
            )
          );
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <h1>Memory</h1>
      </div>
      <div className="game-content">
        <div className="memory-game">
          <div className="game-stats">
            <div className="score">Score: {score}</div>
            <div className="moves">Moves: {moves}</div>
          </div>
          <div className="game-board">
            {cards.map((card) => (
              <div
                key={card.id}
                className={`memory-card ${
                  card.isFlipped || matchedPairs.includes(card.id)
                    ? "revealed"
                    : ""
                } ${matchedPairs.includes(card.id) ? "matched" : ""}`}
                style={{
                  backgroundColor:
                    card.isFlipped || matchedPairs.includes(card.id)
                      ? card.color
                      : "#2a2a2a",
                }}
                onClick={() => handleCardClick(card)}
              />
            ))}
          </div>
          {gameWon && (
            <div className="game-over">
              <h2>Congratulations!</h2>
              <p>You won in {moves} moves!</p>
              <p>Final Score: {score}</p>
              <button className="restart-button" onClick={initializeGame}>
                Play Again
              </button>
            </div>
          )}
          <Link to="/" className="back-button">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Memory;
