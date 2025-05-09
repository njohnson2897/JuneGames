import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

function BallAvoidance() {
  const [balls, setBalls] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const gameAreaRef = useRef(null);
  const ballCreationIntervalRef = useRef(3000);
  const ballSpeedMultiplierRef = useRef(1);
  const ballSize = 20;
  const avoidRadius = 50;

  useEffect(() => {
    if (gameStarted && !gameOver) {
      const timer = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [gameStarted, startTime, gameOver]);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      const gameLoop = setInterval(updateGame, 16);
      const ballSpawner = setInterval(
        createBall,
        ballCreationIntervalRef.current
      );
      const difficultyIncrease = setInterval(() => {
        ballCreationIntervalRef.current *= 0.95;
        ballSpeedMultiplierRef.current *= 1.05;
      }, 5000);

      return () => {
        clearInterval(gameLoop);
        clearInterval(ballSpawner);
        clearInterval(difficultyIncrease);
      };
    }
  }, [gameStarted, gameOver]);

  const handleMouseMove = (e) => {
    if (!gameAreaRef.current) return;
    const rect = gameAreaRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setStartTime(Date.now());
    setElapsedTime(0);
    setBalls([]);
    createBall();
  };

  const createBall = () => {
    if (!gameAreaRef.current) return;
    const rect = gameAreaRef.current.getBoundingClientRect();

    let x, y;
    do {
      x = Math.random() * (rect.width - ballSize);
      y = Math.random() * (rect.height - ballSize);
    } while (isTooCloseToMouse(x, y));

    const newBall = {
      x,
      y,
      dx: 0,
      dy: 0,
      state: "stationary",
      id: Date.now() + Math.random(),
    };

    setBalls((prev) => [...prev, newBall]);

    setTimeout(() => {
      setBalls((prev) =>
        prev.map((ball) =>
          ball.id === newBall.id ? { ...ball, state: "moving" } : ball
        )
      );
    }, 1000);
  };

  const updateGame = () => {
    if (!gameStarted || gameOver) return;

    setBalls((prev) =>
      prev.map((ball) => {
        if (ball.state !== "moving") return ball;

        const newDx =
          ball.dx + (Math.random() - 0.5) * 2 * ballSpeedMultiplierRef.current;
        const newDy =
          ball.dy + (Math.random() - 0.5) * 2 * ballSpeedMultiplierRef.current;
        let newX = ball.x + newDx;
        let newY = ball.y + newDy;

        if (!gameAreaRef.current) return ball;
        const rect = gameAreaRef.current.getBoundingClientRect();

        newX = Math.max(0, Math.min(rect.width - ballSize, newX));
        newY = Math.max(0, Math.min(rect.height - ballSize, newY));

        if (checkCollision({ x: newX, y: newY })) {
          endGame();
          return ball;
        }

        return { ...ball, x: newX, y: newY, dx: newDx, dy: newDy };
      })
    );
  };

  const isTooCloseToMouse = (x, y) => {
    const dx = x - mousePosition.x;
    const dy = y - mousePosition.y;
    return Math.sqrt(dx * dx + dy * dy) < avoidRadius;
  };

  const checkCollision = (ball) => {
    const dx = ball.x + ballSize / 2 - mousePosition.x;
    const dy = ball.y + ballSize / 2 - mousePosition.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < avoidRadius;
  };

  const endGame = () => {
    setGameOver(true);
    setGameStarted(false);
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <h1>Ball Avoidance</h1>
      </div>
      <div className="game-content">
        <div className="ball-game">
          {!gameStarted ? (
            <div className="start-screen">
              <h2>Ball Avoidance</h2>
              <p>
                Move your mouse to avoid the balls.
                <br />
                Don't let them touch you!
              </p>
              <button onClick={startGame} className="start-button">
                Start Game
              </button>
            </div>
          ) : gameOver ? (
            <div className="game-over">
              <h2>Game Over!</h2>
              <p>You survived for {elapsedTime} seconds</p>
              <button onClick={startGame} className="restart-button">
                Play Again
              </button>
              <Link to="/" className="back-button">
                Back to Home
              </Link>
            </div>
          ) : (
            <div
              className="game-area"
              ref={gameAreaRef}
              onMouseMove={handleMouseMove}
            >
              <div className="timer">Time: {elapsedTime}s</div>
              {balls.map((ball) => (
                <div
                  key={ball.id}
                  className={`ball ${ball.state}`}
                  style={{
                    left: `${ball.x}px`,
                    top: `${ball.y}px`,
                    width: `${ballSize}px`,
                    height: `${ballSize}px`,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BallAvoidance;
