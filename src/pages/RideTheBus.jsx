import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";

const RideTheBus = () => {
  const [deck, setDeck] = useState([]);
  const [currentRound, setCurrentRound] = useState(1);
  const [previousCards, setPreviousCards] = useState([]);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  const MAX_ATTEMPTS = 10;
  const SUITS = ["hearts", "diamonds", "clubs", "spades"];
  const VALUES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

  const initializeDeck = useCallback(() => {
    const newDeck = SUITS.flatMap((suit) =>
      VALUES.map((value) => ({ suit, value }))
    );
    setDeck(newDeck.sort(() => Math.random() - 0.5));
  }, []);

  const resetGame = useCallback(() => {
    initializeDeck();
    setCurrentRound(1);
    setAttempts(0);
    setPreviousCards([]);
    setFeedback("");
    setGameOver(false);
    setGameWon(false);
  }, [initializeDeck]);

  const drawCard = useCallback(() => {
    const newDeck = [...deck];
    const card = newDeck.pop();
    setDeck(newDeck);
    return card;
  }, [deck]);

  const getCardName = useCallback((value) => {
    const names = { 1: "A", 11: "J", 12: "Q", 13: "K" };
    return names[value] || value;
  }, []);

  const getRoundQuestion = useCallback((round) => {
    switch (round) {
      case 1:
        return "Pick Red or Black";
      case 2:
        return "Higher or Lower";
      case 3:
        return "Inside or Outside";
      case 4:
        return "Pick a Suit";
      default:
        return "";
    }
  }, []);

  const getRoundOptions = useCallback((round) => {
    switch (round) {
      case 1:
        return ["Red", "Black"];
      case 2:
        return ["Higher", "Lower"];
      case 3:
        return ["Inside", "Outside"];
      case 4:
        return ["Hearts", "Diamonds", "Clubs", "Spades"];
      default:
        return [];
    }
  }, []);

  const checkRoundResult = useCallback(
    (card, choice) => {
      if (currentRound === 1) {
        // Round 1: Red or Black
        return (
          (choice === "Red" && ["hearts", "diamonds"].includes(card.suit)) ||
          (choice === "Black" && ["clubs", "spades"].includes(card.suit))
        );
      } else if (currentRound === 2) {
        // Round 2: Higher or Lower
        const previousCard = previousCards[0];
        return (
          (choice === "Higher" && card.value > previousCard.value) ||
          (choice === "Lower" && card.value < previousCard.value)
        );
      } else if (currentRound === 3) {
        // Round 3: Inside or Outside
        const [first, second] = previousCards;
        const min = Math.min(first.value, second.value);
        const max = Math.max(first.value, second.value);
        return (
          (choice === "Inside" && card.value > min && card.value < max) ||
          (choice === "Outside" && (card.value < min || card.value > max))
        );
      } else if (currentRound === 4) {
        // Round 4: Suit
        return card.suit.toLowerCase() === choice.toLowerCase();
      }
      return false;
    },
    [currentRound, previousCards]
  );

  const playRound = useCallback(
    (choice) => {
      const card = drawCard();
      const newPreviousCards = [...previousCards, card];
      setPreviousCards(newPreviousCards);

      if (checkRoundResult(card, choice)) {
        if (currentRound === 4) {
          setGameWon(true);
          setFeedback("You won! Congratulations!");
        } else {
          setCurrentRound((prev) => prev + 1);
          setFeedback("Correct! Moving to the next round.");
        }
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        setFeedback(
          `Incorrect! Attempt ${newAttempts} of ${MAX_ATTEMPTS}. Restarting...`
        );

        if (newAttempts >= MAX_ATTEMPTS) {
          setGameOver(true);
          setFeedback("You've reached the maximum attempts. Game over!");
        } else {
          setCurrentRound(1);
          setPreviousCards([]);
        }
      }
    },
    [attempts, checkRoundResult, currentRound, drawCard, previousCards]
  );

  useEffect(() => {
    resetGame();
  }, [resetGame]);

  return (
    <div className="game-container">
      <div className="game-header">
        <h1>Ride the Bus</h1>
      </div>
      <div className="game-content">
        <div className="bus-game">
          <div className="round-info">
            <h2>Round: {currentRound}</h2>
            <p className="question">{getRoundQuestion(currentRound)}</p>
          </div>

          <div className="options">
            {getRoundOptions(currentRound).map((option, index) => (
              <button
                key={option}
                onClick={() => playRound(option)}
                className="game-button"
                disabled={gameOver || gameWon}
              >
                {option}
              </button>
            ))}
          </div>

          <div className="card-display">
            <h3>Flipped Cards:</h3>
            <div className="cards-container">
              {previousCards.map((card, index) => (
                <div
                  key={index}
                  className={`card ${
                    ["hearts", "diamonds"].includes(card.suit) ? "red" : "black"
                  }`}
                >
                  {getCardName(card.value)}
                </div>
              ))}
            </div>
          </div>

          <div className="game-stats">
            <p className="feedback">{feedback}</p>
            <p className="attempts">
              Attempts: {attempts}/{MAX_ATTEMPTS}
            </p>
          </div>

          <div className="button-group">
            <button onClick={resetGame} className="restart-button">
              Restart Game
            </button>
            <Link to="/" className="back-button">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RideTheBus;
