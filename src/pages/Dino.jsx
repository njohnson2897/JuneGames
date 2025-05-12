import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const Dino = () => {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const gameStateRef = useRef({
    dino: {
      x: 50,
      y: 150,
      width: 40,
      height: 60,
      yVelocity: 0,
      jumping: false,
      spriteIndex: 0,
      sprites: [],
    },
    ground: {
      y: 180,
      height: 20,
    },
    obstacles: [],
    obstacleInterval: null,
    scoreInterval: null,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const gameState = gameStateRef.current;

    // Load images
    const dinoImg1 = new Image();
    dinoImg1.src = "/dino1.png";
    const dinoImg2 = new Image();
    dinoImg2.src = "/dino2.png";
    const obstacleImg = new Image();
    obstacleImg.src = "/obstacle.png";

    // Add sprites to dino
    gameState.dino.sprites = [
      { src: dinoImg1, width: 40, height: 60 },
      { src: dinoImg2, width: 40, height: 60 },
    ];

    const drawDino = () => {
      const sprite = gameState.dino.sprites[gameState.dino.spriteIndex];
      ctx.drawImage(
        sprite.src,
        gameState.dino.x,
        gameState.dino.y,
        gameState.dino.width,
        gameState.dino.height
      );
    };

    const drawGround = () => {
      ctx.fillStyle = "#888";
      ctx.fillRect(
        0,
        gameState.ground.y,
        canvas.width,
        gameState.ground.height
      );
    };

    const createObstacle = () => {
      const obstacle = {
        x: canvas.width,
        y: gameState.ground.y - 30,
        width: 30,
        height: 30,
        img: obstacleImg,
      };
      gameState.obstacles.push(obstacle);
    };

    const drawObstacles = () => {
      gameState.obstacles.forEach((obstacle) => {
        ctx.drawImage(
          obstacle.img,
          obstacle.x,
          obstacle.y,
          obstacle.width,
          obstacle.height
        );
      });
    };

    const moveObstacles = () => {
      const speed = 3 + Math.floor(score / 100);
      gameState.obstacles.forEach((obstacle) => {
        obstacle.x -= speed;
      });
      gameState.obstacles = gameState.obstacles.filter(
        (obstacle) => obstacle.x > -obstacle.width
      );
    };

    const checkCollision = () => {
      for (const obstacle of gameState.obstacles) {
        if (
          gameState.dino.x < obstacle.x + obstacle.width &&
          gameState.dino.x + gameState.dino.width > obstacle.x &&
          gameState.dino.y < obstacle.y + obstacle.height &&
          gameState.dino.y + gameState.dino.height > obstacle.y
        ) {
          setGameOver(true);
          clearInterval(gameState.obstacleInterval);
          clearInterval(gameState.scoreInterval);
          return;
        }
      }
    };

    const gameLoop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!gameOver) {
        // Dino jump physics
        if (gameState.dino.jumping) {
          gameState.dino.y += gameState.dino.yVelocity;
          gameState.dino.yVelocity += 0.5;
          if (gameState.dino.y > 150) {
            gameState.dino.y = 150;
            gameState.dino.jumping = false;
          }
        }

        // Animate dino sprite
        gameState.dino.spriteIndex =
          (gameState.dino.spriteIndex + 1) % gameState.dino.sprites.length;
        drawDino();
        drawGround();
        moveObstacles();
        drawObstacles();
        checkCollision();
      }

      requestAnimationFrame(gameLoop);
    };

    const handleKeyDown = (event) => {
      if (event.code === "Space" && !gameState.dino.jumping && !gameOver) {
        gameState.dino.jumping = true;
        gameState.dino.yVelocity = -10;
      }
    };

    // Initialize game
    gameState.obstacleInterval = setInterval(createObstacle, 2000);
    gameState.scoreInterval = setInterval(
      () => setScore((prev) => prev + 1),
      100
    );
    gameLoop();

    // Add event listeners
    window.addEventListener("keydown", handleKeyDown);

    // Cleanup
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearInterval(gameState.obstacleInterval);
      clearInterval(gameState.scoreInterval);
    };
  }, [score, gameOver]);

  const restartGame = () => {
    setScore(0);
    setGameOver(false);
    gameStateRef.current = {
      ...gameStateRef.current,
      dino: {
        ...gameStateRef.current.dino,
        y: 150,
        yVelocity: 0,
        jumping: false,
      },
      obstacles: [],
    };
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <h1>Dino Game</h1>
      </div>
      <div className="game-content">
        <div className="dino-game">
          <div className="game-stats">
            <div className="stat">
              <span>Score:</span>
              <span>{score}</span>
            </div>
          </div>

          <canvas
            ref={canvasRef}
            width={800}
            height={200}
            className="game-canvas"
          />

          {gameOver && (
            <div className="game-over">
              <h2>Game Over!</h2>
              <p>Final Score: {score}</p>
              <button onClick={restartGame} className="restart-button">
                Play Again
              </button>
            </div>
          )}

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

export default Dino;
