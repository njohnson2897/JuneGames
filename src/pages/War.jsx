import { useState } from "react";
import { Link } from "react-router-dom";

const War = () => {
  const [playerDeck, setPlayerDeck] = useState([]);
  const [computerDeck, setComputerDeck] = useState([]);
  const [playerCard, setPlayerCard] = useState(null);
  const [computerCard, setComputerCard] = useState(null);
  const [playerScore, setPlayerScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isWar, setIsWar] = useState(false);
  const [warCards, setWarCards] = useState([]);

  const suits = ["♠", "♥", "♦", "♣"];
  const values = [
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
    "A",
  ];

  const createDeck = () => {
    const deck = [];
    for (let suit of suits) {
      for (let value of values) {
        deck.push({ suit, value });
      }
    }
    return deck;
  };

  const shuffleDeck = (deck) => {
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const dealCards = () => {
    const deck = shuffleDeck(createDeck());
    const half = Math.ceil(deck.length / 2);
    setPlayerDeck(deck.slice(0, half));
    setComputerDeck(deck.slice(half));
    setPlayerCard(null);
    setComputerCard(null);
    setPlayerScore(0);
    setComputerScore(0);
    setGameOver(false);
    setMessage("");
    setIsPlaying(true);
    setIsWar(false);
    setWarCards([]);
  };

  const getCardValue = (value) => {
    const valueMap = {
      2: 2,
      3: 3,
      4: 4,
      5: 5,
      6: 6,
      7: 7,
      8: 8,
      9: 9,
      10: 10,
      J: 11,
      Q: 12,
      K: 13,
      A: 14,
    };
    return valueMap[value];
  };

  const playRound = () => {
    if (gameOver || playerDeck.length === 0 || computerDeck.length === 0) {
      return;
    }

    const newPlayerCard = playerDeck[0];
    const newComputerCard = computerDeck[0];

    setPlayerCard(newPlayerCard);
    setComputerCard(newComputerCard);

    const playerValue = getCardValue(newPlayerCard.value);
    const computerValue = getCardValue(newComputerCard.value);

    if (playerValue > computerValue) {
      setPlayerScore((prev) => prev + 1);
      setMessage("You win this round!");
      setPlayerDeck((prev) => [
        ...prev.slice(1),
        newPlayerCard,
        newComputerCard,
      ]);
      setComputerDeck((prev) => prev.slice(1));
    } else if (computerValue > playerValue) {
      setComputerScore((prev) => prev + 1);
      setMessage("Computer wins this round!");
      setComputerDeck((prev) => [
        ...prev.slice(1),
        newComputerCard,
        newPlayerCard,
      ]);
      setPlayerDeck((prev) => prev.slice(1));
    } else {
      setIsWar(true);
      setWarCards([newPlayerCard, newComputerCard]);
      setMessage("WAR!");
    }

    checkGameOver();
  };

  const playWar = () => {
    if (playerDeck.length < 4 || computerDeck.length < 4) {
      setGameOver(true);
      return;
    }

    const playerWarCards = playerDeck.slice(0, 4);
    const computerWarCards = computerDeck.slice(0, 4);
    const playerWarCard = playerWarCards[3];
    const computerWarCard = computerWarCards[3];

    setWarCards([...warCards, ...playerWarCards, ...computerWarCards]);
    setPlayerCard(playerWarCard);
    setComputerCard(computerWarCard);

    const playerValue = getCardValue(playerWarCard.value);
    const computerValue = getCardValue(computerWarCard.value);

    if (playerValue > computerValue) {
      setPlayerScore((prev) => prev + 1);
      setMessage("You win the war!");
      setPlayerDeck((prev) => [
        ...prev.slice(4),
        ...playerWarCards,
        ...computerWarCards,
      ]);
      setComputerDeck((prev) => prev.slice(4));
    } else if (computerValue > playerValue) {
      setComputerScore((prev) => prev + 1);
      setMessage("Computer wins the war!");
      setComputerDeck((prev) => [
        ...prev.slice(4),
        ...computerWarCards,
        ...playerWarCards,
      ]);
      setPlayerDeck((prev) => prev.slice(4));
    } else {
      setMessage("Another war!");
      playWar();
    }

    setIsWar(false);
    checkGameOver();
  };

  const checkGameOver = () => {
    if (playerDeck.length === 0) {
      setGameOver(true);
      setMessage("Game Over! Computer wins!");
    } else if (computerDeck.length === 0) {
      setGameOver(true);
      setMessage("Game Over! You win!");
    }
  };

  const getCardColor = (suit) => {
    return suit === "♥" || suit === "♦" ? "red" : "black";
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <h1>War</h1>
      </div>
      <div className="game-content">
        <div className="war-game">
          <div className="game-stats">
            <div className="stat">
              <span>Your Cards:</span>
              <span>{playerDeck.length}</span>
            </div>
            <div className="stat">
              <span>Computer Cards:</span>
              <span>{computerDeck.length}</span>
            </div>
            <div className="stat">
              <span>Your Score:</span>
              <span>{playerScore}</span>
            </div>
            <div className="stat">
              <span>Computer Score:</span>
              <span>{computerScore}</span>
            </div>
          </div>

          <div className="cards-container">
            <div className="player-cards">
              {playerCard && (
                <div
                  className="card"
                  style={{ color: getCardColor(playerCard.suit) }}
                >
                  <div className="card-value">{playerCard.value}</div>
                  <div className="card-suit">{playerCard.suit}</div>
                </div>
              )}
            </div>
            <div className="computer-cards">
              {computerCard && (
                <div
                  className="card"
                  style={{ color: getCardColor(computerCard.suit) }}
                >
                  <div className="card-value">{computerCard.value}</div>
                  <div className="card-suit">{computerCard.suit}</div>
                </div>
              )}
            </div>
          </div>

          {isWar && (
            <div className="war-cards">
              {warCards.map((card, index) => (
                <div
                  key={index}
                  className="card war-card"
                  style={{ color: getCardColor(card.suit) }}
                >
                  <div className="card-value">{card.value}</div>
                  <div className="card-suit">{card.suit}</div>
                </div>
              ))}
            </div>
          )}

          <div className="message">{message}</div>

          <div className="button-group">
            {!isPlaying ? (
              <button onClick={dealCards} className="start-button">
                Start Game
              </button>
            ) : (
              <button
                onClick={isWar ? playWar : playRound}
                className="play-button"
                disabled={gameOver}
              >
                {isWar ? "Play War" : "Play Card"}
              </button>
            )}
            {gameOver && (
              <button onClick={dealCards} className="restart-button">
                Play Again
              </button>
            )}
            <Link to="/" className="back-button">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default War;
