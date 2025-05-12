import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";

const Pong = () => {
  const canvasRef = useRef(null);
  const [paddle1Y, setPaddle1Y] = useState(200);
  const [paddle2Y, setPaddle2Y] = useState(200);
  const [ballX, setBallX] = useState(400);
  const [ballY, setBallY] = useState(300);
  const [ballSpeedX, setBallSpeedX] = useState(5);
  const [ballSpeedY, setBallSpeedY] = useState(5);
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);

  const PADDLE_HEIGHT = 100;
  const PADDLE_WIDTH = 10;
  const BALL_SIZE = 10;
  const PADDLE_SPEED = 10;
  const WINNING_SCORE = 5;

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (gameOver) return;

      // Player 1 controls (WASD)
      if (e.key === "w" && paddle1Y > 0) {
        setPaddle1Y((prev) => prev - PADDLE_SPEED);
      }
      if (e.key === "s" && paddle1Y < 500) {
        setPaddle1Y((prev) => prev + PADDLE_SPEED);
      }
      // Player 2 controls (Arrow keys)
      if (e.key === "ArrowUp" && paddle2Y > 0) {
        setPaddle2Y((prev) => prev - PADDLE_SPEED);
      }
      if (e.key === "ArrowDown" && paddle2Y < 500) {
        setPaddle2Y((prev) => prev + PADDLE_SPEED);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [paddle1Y, paddle2Y, gameOver]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const gameLoop = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw center line
      ctx.setLineDash([10, 10]);
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, 0);
      ctx.lineTo(canvas.width / 2, canvas.height);
      ctx.strokeStyle = "#00ff00";
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw paddles
      ctx.fillStyle = "#00ff00";
      ctx.fillRect(50, paddle1Y, PADDLE_WIDTH, PADDLE_HEIGHT);
      ctx.fillRect(740, paddle2Y, PADDLE_WIDTH, PADDLE_HEIGHT);

      // Draw ball
      ctx.beginPath();
      ctx.arc(ballX, ballY, BALL_SIZE, 0, Math.PI * 2);
      ctx.fillStyle = "#00ff00";
      ctx.fill();
      ctx.closePath();

      // Draw scores
      ctx.font = "30px 'Press Start 2P'";
      ctx.fillStyle = "#00ff00";
      ctx.fillText(score1, 300, 50);
      ctx.fillText(score2, 500, 50);

      if (!gameOver) {
        // Ball movement and collision detection
        setBallX((prev) => prev + ballSpeedX);
        setBallY((prev) => prev + ballSpeedY);

        // Wall collisions
        if (ballY <= 0 || ballY >= 600) {
          setBallSpeedY((prev) => -prev);
        }

        // Paddle collisions
        if (
          ballX <= 60 &&
          ballY >= paddle1Y &&
          ballY <= paddle1Y + PADDLE_HEIGHT
        ) {
          setBallSpeedX((prev) => -prev);
        }
        if (
          ballX >= 730 &&
          ballY >= paddle2Y &&
          ballY <= paddle2Y + PADDLE_HEIGHT
        ) {
          setBallSpeedX((prev) => -prev);
        }

        // Score points
        if (ballX <= 0) {
          setScore2((prev) => {
            const newScore = prev + 1;
            if (newScore >= WINNING_SCORE) {
              setGameOver(true);
              setWinner("Player 2");
            }
            return newScore;
          });
          resetBall();
        }
        if (ballX >= 800) {
          setScore1((prev) => {
            const newScore = prev + 1;
            if (newScore >= WINNING_SCORE) {
              setGameOver(true);
              setWinner("Player 1");
            }
            return newScore;
          });
          resetBall();
        }
      }

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    const resetBall = () => {
      setBallX(400);
      setBallY(300);
      setBallSpeedX(5 * (Math.random() > 0.5 ? 1 : -1));
      setBallSpeedY(5 * (Math.random() > 0.5 ? 1 : -1));
    };

    gameLoop();
    return () => cancelAnimationFrame(animationFrameId);
  }, [
    ballX,
    ballY,
    paddle1Y,
    paddle2Y,
    ballSpeedX,
    ballSpeedY,
    score1,
    score2,
    gameOver,
  ]);

  const restartGame = () => {
    setPaddle1Y(200);
    setPaddle2Y(200);
    setBallX(400);
    setBallY(300);
    setBallSpeedX(5);
    setBallSpeedY(5);
    setScore1(0);
    setScore2(0);
    setGameOver(false);
    setWinner(null);
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <h1>Pong</h1>
      </div>
      <div className="game-content">
        <div className="pong-game">
          <div className="game-stats">
            <div className="stat">
              <span>Player 1:</span>
              <span>{score1}</span>
            </div>
            <div className="stat">
              <span>Player 2:</span>
              <span>{score2}</span>
            </div>
          </div>

          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="game-canvas"
          />

          {gameOver && (
            <div className="game-over">
              <h2>Game Over!</h2>
              <p>{winner} Wins!</p>
              <button onClick={restartGame} className="restart-button">
                Play Again
              </button>
            </div>
          )}

          <div className="controls-info">
            <p>Player 1: W/S keys</p>
            <p>Player 2: Up/Down arrows</p>
          </div>

          <div className="button-group">
            <Link to="/" className="back-button">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pong;
