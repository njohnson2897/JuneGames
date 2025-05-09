import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Blackjack() {
  const [deck, setDeck] = useState([]);
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [playerScore, setPlayerScore] = useState(0);
  const [dealerScore, setDealerScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [dealerHidden, setDealerHidden] = useState(true);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("");

  // Utility Functions
  const createDeck = () => {
    const suits = ["H", "D", "C", "S"];
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
    const newDeck = [];
    for (let suit of suits) {
      for (let value of values) {
        newDeck.push(value + suit);
      }
    }
    return newDeck;
  };

  const shuffleDeck = (deckToShuffle) => {
    const shuffled = [...deckToShuffle];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const getCardValue = (card) => {
    const value = card.slice(0, -1);
    if (["J", "Q", "K"].includes(value)) return 10;
    if (value === "A") return 11;
    return parseInt(value);
  };

  const calculateHandValue = (hand) => {
    let totalValue = 0;
    let hasAce = false;
    for (let card of hand) {
      let cardValue = getCardValue(card);
      if (cardValue === 11) hasAce = true;
      totalValue += cardValue;
    }
    if (totalValue > 21 && hasAce) {
      totalValue -= 10;
    }
    return totalValue;
  };

  // Game Logic Functions
  const dealHands = () => {
    const newDeck = shuffleDeck(createDeck());
    const newPlayerHand = [newDeck.pop(), newDeck.pop()];
    const newDealerHand = [newDeck.pop(), newDeck.pop()];

    setDeck(newDeck);
    setPlayerHand(newPlayerHand);
    setDealerHand(newDealerHand);
    setPlayerScore(calculateHandValue(newPlayerHand));
    setDealerScore(calculateHandValue([newDealerHand[1]])); // Only show second card's value
    setDealerHidden(true);
    setGameStarted(true);
    setMessage("Game started! Hit or Stand?");
  };

  const handleHit = () => {
    if (!gameStarted) return;

    const newPlayerHand = [...playerHand, deck[deck.length - 1]];
    const newDeck = deck.slice(0, -1);
    const newPlayerScore = calculateHandValue(newPlayerHand);

    setPlayerHand(newPlayerHand);
    setDeck(newDeck);
    setPlayerScore(newPlayerScore);

    if (newPlayerScore > 21) {
      setScore((prev) => prev - 10);
      setGameStarted(false);
      setMessage("You busted!");
    }
  };

  const handleStand = () => {
    if (!gameStarted) return;

    setDealerHidden(false);
    let newDealerHand = [...dealerHand];
    let newDeck = [...deck];
    let newDealerScore = calculateHandValue(newDealerHand);

    while (newDealerScore < 17) {
      newDealerHand.push(newDeck.pop());
      newDealerScore = calculateHandValue(newDealerHand);
    }

    setDealerHand(newDealerHand);
    setDeck(newDeck);
    setDealerScore(newDealerScore);

    // Determine winner
    if (newDealerScore > 21) {
      setScore((prev) => prev + 10);
      setMessage("Dealer busted! You win!");
    } else if (playerScore > newDealerScore) {
      setScore((prev) => prev + 10);
      setMessage("You win!");
    } else if (playerScore === newDealerScore) {
      setMessage("It's a tie!");
    } else {
      setScore((prev) => prev - 10);
      setMessage("You lose!");
    }
    setGameStarted(false);
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <h1>Blackjack</h1>
      </div>
      <div className="game-content">
        <div className="blackjack-game">
          <div className="score-box">Score: {score}</div>
          <div className="cards-container">
            <div className="hand-section">
              <h2 className="cards-title">Dealer Hand</h2>
              <div className="cards">
                {dealerHand.map((card, index) => (
                  <div
                    key={index}
                    className={`card ${
                      index === 0 && dealerHidden ? "hidden" : ""
                    }`}
                  >
                    {index === 0 && dealerHidden ? "" : card}
                  </div>
                ))}
              </div>
              {!dealerHidden && (
                <div className="hand-value">Dealer: {dealerScore}</div>
              )}
            </div>
            <div className="hand-section">
              <h2 className="cards-title">Player Hand</h2>
              <div className="cards">
                {playerHand.map((card, index) => (
                  <div key={index} className="card">
                    {card}
                  </div>
                ))}
              </div>
              <div className="hand-value">Player: {playerScore}</div>
            </div>
          </div>
          <div className="message-box">{message}</div>
          <div className="button-container">
            <button
              className="game-button hit-button"
              onClick={handleHit}
              disabled={!gameStarted}
            >
              Hit
            </button>
            <button
              className="game-button stand-button"
              onClick={handleStand}
              disabled={!gameStarted}
            >
              Stand
            </button>
            <button
              className="game-button deal-button"
              onClick={dealHands}
              disabled={gameStarted}
            >
              Deal
            </button>
          </div>
          <Link to="/" className="back-button">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Blackjack;
