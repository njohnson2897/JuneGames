import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

function BallAvoidance() {
  const [balls, setBalls] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: -9999, y: -9999 }); // Initialize off-screen to prevent false collisions
  
  // Use ref to always have current mouse position (avoids stale state in updateGame)
  const mousePositionRef = useRef({ x: -9999, y: -9999 });
  // Use ref to track current balls state for collision checking
  const ballsRef = useRef([]);

  const gameAreaRef = useRef(null);
  const ballCreationIntervalRef = useRef(3000);
  const ballSpeedMultiplierRef = useRef(1);
  const ballSize = 20;
  const ballRadius = ballSize / 2; // 10px
  const avoidRadius = 50; // For spawning balls away from mouse
  const collisionRadius = ballRadius + 8; // Ball radius (10) + buffer (8) = 18px total collision radius

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
        ballSpeedMultiplierRef.current *= 1.1; // Increased from 1.05 to 1.1 (10% speed increase every 5 seconds)
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
    const newMousePos = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    // Update both state and ref
    setMousePosition(newMousePos);
    mousePositionRef.current = newMousePos;
  };

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setStartTime(Date.now());
    setElapsedTime(0);
    setBalls([]);
    ballsRef.current = []; // Reset balls ref
    mousePositionRef.current = { x: -9999, y: -9999 }; // Reset mouse position ref
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

    // Give balls random initial velocity with slight bias toward cursor
    const baseSpeed = 4 + Math.random() * 4; // Random speed between 4-8 (much faster)
    const randomAngle = Math.random() * Math.PI * 2; // Completely random direction
    
    // Only add slight cursor attraction if mouse has moved
    let angle = randomAngle;
    if (mousePosition.x > 0 && mousePosition.y > 0) {
      const dx = mousePosition.x - (x + ballSize / 2);
      const dy = mousePosition.y - (y + ballSize / 2);
      const angleToCursor = Math.atan2(dy, dx);
      // Blend random angle (70%) with cursor direction (30%)
      angle = randomAngle * 0.7 + angleToCursor * 0.3;
    }
    
    const newBall = {
      x,
      y,
      dx: Math.cos(angle) * baseSpeed * ballSpeedMultiplierRef.current,
      dy: Math.sin(angle) * baseSpeed * ballSpeedMultiplierRef.current,
      state: "stationary",
      id: Date.now() + Math.random(),
    };

    setBalls((prev) => {
      const updated = [...prev, newBall];
      ballsRef.current = updated;
      return updated;
    });

    setTimeout(() => {
      setBalls((prev) => {
        const updated = prev.map((ball) =>
          ball.id === newBall.id ? { ...ball, state: "moving" } : ball
        );
        ballsRef.current = updated;
        return updated;
      });
    }, 1000);
  };

  const updateGame = () => {
    if (!gameStarted || gameOver || !gameAreaRef.current) return;
    const rect = gameAreaRef.current.getBoundingClientRect();

    // Get current mouse position and balls from refs (always up-to-date)
    const currentMousePos = mousePositionRef.current;
    const currentBalls = ballsRef.current;

    // FIRST: Check collisions with current ball positions
    for (const ball of currentBalls) {
      if (ball.state === "moving" && checkCollisionWithMouse(ball, currentMousePos)) {
        // Collision detected - end game immediately and stop
        endGame();
        return;
      }
    }

    // SECOND: Update ball positions (no collision detected with current positions)
    setBalls((prev) => {
      const updatedBalls = prev.map((ball) => {
        if (ball.state !== "moving") return ball;

        // Mostly random movement with slight bias toward cursor
        const randomForce = 0.5 * ballSpeedMultiplierRef.current; // Increased randomness
        let newDx = ball.dx * 0.97 + (Math.random() - 0.5) * randomForce;
        let newDy = ball.dy * 0.97 + (Math.random() - 0.5) * randomForce;
        
        // Only add slight cursor attraction if mouse has moved
        if (currentMousePos.x > 0 && currentMousePos.y > 0) {
          const ballCenterX = ball.x + ballSize / 2;
          const ballCenterY = ball.y + ballSize / 2;
          const dxToCursor = currentMousePos.x - ballCenterX;
          const dyToCursor = currentMousePos.y - ballCenterY;
          const distanceToCursor = Math.sqrt(dxToCursor * dxToCursor + dyToCursor * dyToCursor);
          
          // Light attraction toward cursor (30% of movement force)
          const attractionStrength = 0.15 * ballSpeedMultiplierRef.current; // Increased attraction
          newDx += (dxToCursor / Math.max(distanceToCursor, 1)) * attractionStrength * 0.3;
          newDy += (dyToCursor / Math.max(distanceToCursor, 1)) * attractionStrength * 0.3;
        }

        // Limit max speed (increases with difficulty)
        const maxSpeed = 10 * ballSpeedMultiplierRef.current; // Increased from 5 to 10
        const currentSpeed = Math.sqrt(newDx * newDx + newDy * newDy);
        if (currentSpeed > maxSpeed) {
          newDx = (newDx / currentSpeed) * maxSpeed;
          newDy = (newDy / currentSpeed) * maxSpeed;
        }

        // Apply velocity
        let newX = ball.x + newDx;
        let newY = ball.y + newDy;

        // Boundary collision with bounce
        if (newX < 0 || newX > rect.width - ballSize) {
          newDx = -newDx * 0.8; // Bounce and lose some energy
          newX = Math.max(0, Math.min(rect.width - ballSize, newX));
        }
        if (newY < 0 || newY > rect.height - ballSize) {
          newDy = -newDy * 0.8; // Bounce and lose some energy
          newY = Math.max(0, Math.min(rect.height - ballSize, newY));
        }

        return { ...ball, x: newX, y: newY, dx: newDx, dy: newDy };
      });

      // Check collisions with NEW positions BEFORE updating state
      for (const newBall of updatedBalls) {
        if (newBall.state === "moving" && checkCollisionWithMouse(newBall, currentMousePos)) {
          // Collision detected with new position - end game immediately
          endGame();
          // Return previous state to avoid visual update
          return prev;
        }
      }

      // Update balls ref
      ballsRef.current = updatedBalls;
      return updatedBalls;
    });
  };

  const isTooCloseToMouse = (x, y) => {
    const dx = x - mousePosition.x;
    const dy = y - mousePosition.y;
    return Math.sqrt(dx * dx + dy * dy) < avoidRadius;
  };

  // Separate function that uses explicit mouse position parameter (avoids stale state)
  const checkCollisionWithMouse = (ball, mousePos) => {
    // Don't check collision if mouse hasn't moved (still at initial position)
    if (!mousePos || mousePos.x < 0 || mousePos.y < 0) return false;
    
    // Check distance from ball center to mouse position
    const ballCenterX = ball.x + ballSize / 2;
    const ballCenterY = ball.y + ballSize / 2;
    const dx = ballCenterX - mousePos.x;
    const dy = ballCenterY - mousePos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < collisionRadius;
  };

  // Legacy function for backwards compatibility (uses ref)
  const checkCollision = (ball) => {
    return checkCollisionWithMouse(ball, mousePositionRef.current);
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
          <div
            className="game-area"
            ref={gameAreaRef}
            onMouseMove={handleMouseMove}
          >
            {gameStarted && !gameOver && (
              <div className="timer">Time: {elapsedTime}s</div>
            )}
            {gameStarted && !gameOver && balls.map((ball) => (
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
            
            {!gameStarted && !gameOver && (
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
            )}
            
            {gameOver && (
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
            )}
          </div>
          
          {gameStarted && !gameOver && (
            <Link to="/" className="back-button">
              Back to Home
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default BallAvoidance;
