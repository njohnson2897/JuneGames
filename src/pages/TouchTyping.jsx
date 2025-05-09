import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const TouchTyping = () => {
  const [currentWord, setCurrentWord] = useState("");
  const [typedWord, setTypedWord] = useState("");
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isPlaying, setIsPlaying] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);
  const [correctKeystrokes, setCorrectKeystrokes] = useState(0);
  const inputRef = useRef(null);

  const fetchRandomWord = async () => {
    try {
      const response = await fetch(
        "https://random-word-api.herokuapp.com/word"
      );
      const data = await response.json();
      return data[0];
    } catch (error) {
      console.error("Error fetching word:", error);
      setFeedback("Failed to load word. Check your connection!");
      return null;
    }
  };

  const updateWord = async () => {
    const randomWord = await fetchRandomWord();
    if (randomWord) {
      setCurrentWord(randomWord);
      setTypedWord("");
      setFeedback("");
    }
  };

  const startGame = () => {
    setIsPlaying(true);
    setTimeLeft(60);
    setScore(0);
    setWpm(0);
    setAccuracy(100);
    setTotalKeystrokes(0);
    setCorrectKeystrokes(0);
    updateWord();
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const endGame = () => {
    setIsPlaying(false);
    setFeedback(
      `Game Over! Final Score: ${score} | WPM: ${wpm} | Accuracy: ${accuracy}%`
    );
  };

  useEffect(() => {
    let timer;
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft]);

  useEffect(() => {
    if (typedWord === currentWord) {
      setScore((prev) => prev + 1);
      setFeedback("Correct!");
      updateWord();
    }
  }, [typedWord, currentWord]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setTypedWord(value);
    setTotalKeystrokes((prev) => prev + 1);

    // Calculate accuracy
    const correctChars = value
      .split("")
      .filter((char, index) => char === currentWord[index]).length;
    setCorrectKeystrokes(correctChars);
    const newAccuracy = (correctChars / value.length) * 100 || 100;
    setAccuracy(Math.round(newAccuracy));

    // Calculate WPM (assuming average word length of 5 characters)
    const wordsTyped = correctChars / 5;
    const minutes = (60 - timeLeft) / 60;
    const newWpm = Math.round(wordsTyped / minutes) || 0;
    setWpm(newWpm);
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <h1>Touch Typing Practice</h1>
      </div>
      <div className="game-content">
        <div className="typing-game">
          <div className="game-stats">
            <div className="stat">
              <span>Time:</span>
              <span>{timeLeft}s</span>
            </div>
            <div className="stat">
              <span>Score:</span>
              <span>{score}</span>
            </div>
            <div className="stat">
              <span>WPM:</span>
              <span>{wpm}</span>
            </div>
            <div className="stat">
              <span>Accuracy:</span>
              <span>{accuracy}%</span>
            </div>
          </div>

          <div className="word-display">{currentWord}</div>

          <input
            ref={inputRef}
            type="text"
            value={typedWord}
            onChange={handleInputChange}
            placeholder="Type the word here"
            disabled={!isPlaying}
            className="typing-input"
          />

          <p className={`feedback ${feedback === "Correct!" ? "correct" : ""}`}>
            {feedback}
          </p>

          <div className="button-group">
            {!isPlaying && (
              <button onClick={startGame} className="start-button">
                {score > 0 ? "Play Again" : "Start Game"}
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

export default TouchTyping;
