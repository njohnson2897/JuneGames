import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const SkyBird = () => {
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState("Start");
  const [message, setMessage] = useState("Press Enter to Start");
  const birdRef = useRef(null);
  const backgroundRef = useRef(null);
  const gameLoopRef = useRef(null);
  const gravityRef = useRef(0.5);
  const moveSpeedRef = useRef(3);
  const birdDyRef = useRef(0);
  const pipeSeparationRef = useRef(0);
  const pipeGapRef = useRef(35);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "Enter" && gameState !== "Play") {
        // Remove existing pipes
        document
          .querySelectorAll(".pipe_sprite")
          .forEach((pipe) => pipe.remove());

        // Reset game state
        if (birdRef.current) {
          birdRef.current.style.top = "40vh";
        }
        setGameState("Play");
        setMessage("");
        setScore(0);
        startGame();
      } else if (e.key === " " && gameState === "Play") {
        // Jump when space is pressed
        birdDyRef.current = -8;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState]);

  const startGame = () => {
    const move = () => {
      if (gameState !== "Play") return;

      const pipes = document.querySelectorAll(".pipe_sprite");
      pipes.forEach((pipe) => {
        const pipeRect = pipe.getBoundingClientRect();
        const birdRect = birdRef.current.getBoundingClientRect();

        if (pipeRect.right <= 0) {
          pipe.remove();
        } else {
          // Collision detection
          if (
            birdRect.left < pipeRect.right &&
            birdRect.right > pipeRect.left &&
            birdRect.top < pipeRect.bottom &&
            birdRect.bottom > pipeRect.top
          ) {
            setGameState("End");
            setMessage("Press Enter to Restart");
            return;
          } else {
            // Score increment
            if (
              pipeRect.right < birdRect.left &&
              pipe.dataset.scored !== "true"
            ) {
              setScore((prev) => prev + 1);
              pipe.dataset.scored = "true";
            }
            pipe.style.left = pipeRect.left - moveSpeedRef.current + "px";
          }
        }
      });

      gameLoopRef.current = requestAnimationFrame(move);
    };

    const applyGravity = () => {
      if (gameState !== "Play") return;

      birdDyRef.current += gravityRef.current;
      if (birdRef.current) {
        const currentTop = parseFloat(birdRef.current.style.top || "40vh");
        birdRef.current.style.top = currentTop + birdDyRef.current + "px";

        const birdRect = birdRef.current.getBoundingClientRect();
        const backgroundRect = backgroundRef.current.getBoundingClientRect();

        if (birdRect.top <= 0 || birdRect.bottom >= backgroundRect.bottom) {
          setGameState("End");
          setMessage("Press Enter to Restart");
          return;
        }
      }

      gameLoopRef.current = requestAnimationFrame(applyGravity);
    };

    const createPipe = () => {
      if (gameState !== "Play") return;

      if (pipeSeparationRef.current > 115) {
        pipeSeparationRef.current = 0;

        const pipePosition = Math.floor(Math.random() * 43) + 8;

        // Create top pipe
        const topPipe = document.createElement("div");
        topPipe.className = "pipe_sprite";
        topPipe.style.top = pipePosition - 70 + "vh";
        topPipe.style.left = "100vw";
        document.body.appendChild(topPipe);

        // Create bottom pipe
        const bottomPipe = document.createElement("div");
        bottomPipe.className = "pipe_sprite";
        bottomPipe.style.top = pipePosition + pipeGapRef.current + "vh";
        bottomPipe.style.left = "100vw";
        bottomPipe.dataset.scored = "false";
        document.body.appendChild(bottomPipe);
      }

      pipeSeparationRef.current++;
      gameLoopRef.current = requestAnimationFrame(createPipe);
    };

    gameLoopRef.current = requestAnimationFrame(move);
    gameLoopRef.current = requestAnimationFrame(applyGravity);
    gameLoopRef.current = requestAnimationFrame(createPipe);
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <h1>Sky Bird</h1>
      </div>
      <div className="game-content">
        <div className="sky-bird-game">
          <div className="background" ref={backgroundRef}>
            <div className="bird" ref={birdRef}></div>
            <div className="score-display">
              <span className="score-title">Score: </span>
              <span className="score-value">{score}</span>
            </div>
            {message && <div className="message">{message}</div>}
          </div>

          <div className="controls-info">
            <p>Controls:</p>
            <p>Space - Jump</p>
            <p>Enter - Start/Restart</p>
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

export default SkyBird;
