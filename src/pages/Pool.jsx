import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";

const Pool = () => {
  const canvasRef = useRef(null);
  const [angle, setAngle] = useState(45);
  const [strength, setStrength] = useState(5);
  const [gameState, setGameState] = useState({
    cueBall: { x: 0, y: 0, dx: 0, dy: 0 },
    eightBall: { x: 0, y: 0, dx: 0, dy: 0 },
    score: 0,
    gameOver: false,
  });

  const BALL_RADIUS = 10;
  const FRICTION = 0.99;
  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 400;

  const randomPosition = useCallback((max) => {
    return Math.random() * (max - 2 * BALL_RADIUS) + BALL_RADIUS;
  }, []);

  const initializeGame = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      cueBall: {
        x: randomPosition(CANVAS_WIDTH),
        y: randomPosition(CANVAS_HEIGHT),
        dx: 0,
        dy: 0,
      },
      eightBall: {
        x: randomPosition(CANVAS_WIDTH),
        y: randomPosition(CANVAS_HEIGHT),
        dx: 0,
        dy: 0,
      },
      score: 0,
      gameOver: false,
    }));
  }, [randomPosition]);

  const detectCollision = useCallback((ball1, ball2) => {
    const dx = ball1.x - ball2.x;
    const dy = ball1.y - ball2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < 2 * BALL_RADIUS;
  }, []);

  const handleCollision = useCallback((ball1, ball2) => {
    const angle = Math.atan2(ball2.y - ball1.y, ball2.x - ball1.x);
    const velocity1 = Math.sqrt(ball1.dx * ball1.dx + ball1.dy * ball1.dy);
    const velocity2 = Math.sqrt(ball2.dx * ball2.dx + ball2.dy * ball2.dy);
    const direction1 = Math.atan2(ball1.dy, ball1.dx);
    const direction2 = Math.atan2(ball2.dy, ball2.dx);
    const newVelocity1 = velocity1 * Math.cos(direction1 - angle);
    const newVelocity2 = velocity2 * Math.cos(direction2 - angle);

    return {
      ball1: {
        ...ball1,
        dx: newVelocity2 * Math.cos(angle),
        dy: newVelocity2 * Math.sin(angle),
      },
      ball2: {
        ...ball2,
        dx: newVelocity1 * Math.cos(angle),
        dy: newVelocity1 * Math.sin(angle),
      },
    };
  }, []);

  const drawBall = useCallback((context, ball, color) => {
    context.beginPath();
    context.arc(ball.x, ball.y, BALL_RADIUS, 0, Math.PI * 2);
    context.fillStyle = color;
    context.fill();
    context.closePath();
  }, []);

  const drawTrajectory = useCallback(
    (context, cueBall) => {
      const angleRad = (angle * Math.PI) / 180;
      context.beginPath();
      context.moveTo(cueBall.x, cueBall.y);
      context.lineTo(
        cueBall.x + Math.cos(angleRad) * 50,
        cueBall.y + Math.sin(angleRad) * 50
      );
      context.strokeStyle = "#00ff00";
      context.lineWidth = 2;
      context.stroke();
      context.closePath();
    },
    [angle]
  );

  const updateGame = useCallback(() => {
    setGameState((prev) => {
      const { cueBall, eightBall } = prev;

      // Apply friction
      const newCueBall = {
        ...cueBall,
        dx: cueBall.dx * FRICTION,
        dy: cueBall.dy * FRICTION,
      };

      const newEightBall = {
        ...eightBall,
        dx: eightBall.dx * FRICTION,
        dy: eightBall.dy * FRICTION,
      };

      // Update positions
      newCueBall.x += newCueBall.dx;
      newCueBall.y += newCueBall.dy;
      newEightBall.x += newEightBall.dx;
      newEightBall.y += newEightBall.dy;

      // Handle wall collisions
      if (
        newCueBall.x < BALL_RADIUS ||
        newCueBall.x > CANVAS_WIDTH - BALL_RADIUS
      ) {
        newCueBall.dx *= -1;
      }
      if (
        newCueBall.y < BALL_RADIUS ||
        newCueBall.y > CANVAS_HEIGHT - BALL_RADIUS
      ) {
        newCueBall.dy *= -1;
      }

      if (
        newEightBall.x < BALL_RADIUS ||
        newEightBall.x > CANVAS_WIDTH - BALL_RADIUS
      ) {
        newEightBall.dx *= -1;
      }
      if (
        newEightBall.y < BALL_RADIUS ||
        newEightBall.y > CANVAS_HEIGHT - BALL_RADIUS
      ) {
        newEightBall.dy *= -1;
      }

      // Handle ball collisions
      if (detectCollision(newCueBall, newEightBall)) {
        const { ball1, ball2 } = handleCollision(newCueBall, newEightBall);
        return {
          ...prev,
          cueBall: ball1,
          eightBall: ball2,
          score: prev.score + 1,
        };
      }

      return {
        ...prev,
        cueBall: newCueBall,
        eightBall: newEightBall,
      };
    });
  }, [detectCollision, handleCollision]);

  const hitCueBall = useCallback(() => {
    const angleRad = (angle * Math.PI) / 180;
    setGameState((prev) => ({
      ...prev,
      cueBall: {
        ...prev.cueBall,
        dx: Math.cos(angleRad) * strength,
        dy: Math.sin(angleRad) * strength,
      },
    }));
  }, [angle, strength]);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    const gameLoop = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      drawBall(context, gameState.cueBall, "white");
      drawBall(context, gameState.eightBall, "black");
      drawTrajectory(context, gameState.cueBall);
      updateGame();
      requestAnimationFrame(gameLoop);
    };

    const animationId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationId);
  }, [drawBall, drawTrajectory, gameState, updateGame]);

  return (
    <div className="game-container">
      <div className="game-header">
        <h1>Pool Game</h1>
      </div>
      <div className="game-content">
        <div className="pool-game">
          <canvas ref={canvasRef} className="pool-table" />
          <div className="pool-controls">
            <div className="control-group">
              <label htmlFor="angle">Angle (0-360):</label>
              <input
                type="range"
                id="angle"
                min="0"
                max="360"
                value={angle}
                onChange={(e) => setAngle(Number(e.target.value))}
              />
              <span>{angle}°</span>
            </div>
            <div className="control-group">
              <label htmlFor="strength">Strength (1-10):</label>
              <input
                type="range"
                id="strength"
                min="1"
                max="10"
                value={strength}
                onChange={(e) => setStrength(Number(e.target.value))}
              />
              <span>{strength}</span>
            </div>
            <div className="button-group">
              <button onClick={hitCueBall} className="hit-button">
                Hit
              </button>
              <button onClick={initializeGame} className="restart-button">
                Restart
              </button>
            </div>
          </div>
          <div className="score-display">Score: {gameState.score}</div>
          <Link to="/" className="back-button">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Pool;
