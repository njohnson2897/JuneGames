import { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";

const Breakout = () => {
  const canvasRef = useRef(null);
  const [showLetter, setShowLetter] = useState(false);
  const [gameSize, setGameSize] = useState({ width: 0, height: 0 });

  const updateGameSize = useCallback(() => {
    const aspectRatio = 4 / 3;
    let width = Math.min(window.innerWidth - 40, 480);
    let height = width / aspectRatio;
    if (height > window.innerHeight - 100) {
      height = window.innerHeight - 100;
      width = height * aspectRatio;
    }
    setGameSize({ width, height });
  }, []);

  useEffect(() => {
    updateGameSize();
    window.addEventListener("resize", updateGameSize);
    return () => window.removeEventListener("resize", updateGameSize);
  }, [updateGameSize]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height } = gameSize;
    canvas.width = width;
    canvas.height = height;

    let x = width / 2;
    let y = height - 30;
    let dx = 2;
    let dy = -2;
    const ballRadius = 10;
    const paddleHeight = 10;
    const paddleWidth = 75;
    let paddleX = (width - paddleWidth) / 2;
    let rightPressed = false;
    let leftPressed = false;

    const brickRowCount = 3;
    const brickColumnCount = 5;
    const brickWidth = 75;
    const brickHeight = 20;
    const brickPadding = 10;
    const brickOffsetTop = 30;
    const brickOffsetLeft = 30;

    const bricks = [];
    for (let c = 0; c < brickColumnCount; c++) {
      bricks[c] = [];
      for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
      }
    }

    function drawBall() {
      ctx.beginPath();
      ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
      ctx.fillStyle = "#00ff00";
      ctx.fill();
      ctx.closePath();
    }

    function drawPaddle() {
      ctx.beginPath();
      ctx.rect(paddleX, height - paddleHeight, paddleWidth, paddleHeight);
      ctx.fillStyle = "#00ff00";
      ctx.fill();
      ctx.closePath();
    }

    function drawBricks() {
      for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
          if (bricks[c][r].status === 1) {
            const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
            const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
            bricks[c][r].x = brickX;
            bricks[c][r].y = brickY;
            ctx.beginPath();
            ctx.rect(brickX, brickY, brickWidth, brickHeight);
            ctx.fillStyle = "#00ff00";
            ctx.fill();
            ctx.closePath();
          }
        }
      }
    }

    function collisionDetection() {
      for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
          const b = bricks[c][r];
          if (b.status === 1) {
            if (
              x > b.x &&
              x < b.x + brickWidth &&
              y > b.y &&
              y < b.y + brickHeight
            ) {
              dy = -dy;
              b.status = 0;
              if (
                bricks.every((col) => col.every((brick) => brick.status === 0))
              ) {
                setShowLetter(true);
              }
            }
          }
        }
      }
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);
      drawBricks();
      drawBall();
      drawPaddle();
      collisionDetection();

      if (x + dx > width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
      }
      if (y + dy < ballRadius) {
        dy = -dy;
      } else if (y + dy > height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
          dy = -dy;
        } else {
          x = width / 2;
          y = height - 30;
          dx = 2;
          dy = -2;
          paddleX = (width - paddleWidth) / 2;
        }
      }

      if (rightPressed && paddleX < width - paddleWidth) {
        paddleX += 7;
      } else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
      }

      x += dx;
      y += dy;
      requestAnimationFrame(draw);
    }

    function keyDownHandler(e) {
      if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = true;
      } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = true;
      }
    }

    function keyUpHandler(e) {
      if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = false;
      } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = false;
      }
    }

    function mouseMoveHandler(e) {
      const relativeX = e.clientX - canvas.offsetLeft;
      if (relativeX > 0 && relativeX < width) {
        paddleX = relativeX - paddleWidth / 2;
      }
    }

    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
    document.addEventListener("mousemove", mouseMoveHandler, false);

    draw();

    return () => {
      document.removeEventListener("keydown", keyDownHandler);
      document.removeEventListener("keyup", keyUpHandler);
      document.removeEventListener("mousemove", mouseMoveHandler);
    };
  }, [gameSize]);

  const encodedLetter = `RGVhciBEb3VnLAoKQXMgSSByZWZsZWN0IG9uIG91ciBmcmllbmRzaGlwLCB3aGljaCBiZWdhbiB3aGVuIHdlIHdlcmUganVzdCB0d28gNS15ZWFyLW9sZCBraWRzIGJhY2sgaW4gMTk4MCwgSSdtIHN0cnVjayBieSB0aGUgZGVwdGggb2Ygb3VyIHNoYXJlZCBleHBlcmllbmNlcy4gT3VyIGpvdXJuZXkgdG9nZXRoZXIgc3BhbnMgYW4gaW1wcmVzc2l2ZSA0NCB5ZWFycywgYSB0ZXN0YW1lbnQgdG8gdGhlIGVuZHVyaW5nIG5hdHVyZSBvZiBvdXIgYm9uZC4KCkkgYW0gcHJlY2lzZWx5IDExNSBkYXlzIG9sZGVyIHRoYW4geW91LiBUaGlzIG1lYW5zIEkgaGF2ZSBiZWVuLCBhbmQgYWx3YXlzIHdpbGwgYmUsIHlvdXIgc2VuaW9yIGJ5IDIsNzYwIGhvdXJzIG9yIDE2NSw2MDAgbWludXRlc=`;

  const decodeLetter = useCallback((encodedStr) => {
    try {
      return atob(encodedStr);
    } catch (error) {
      console.error("Error decoding letter:", error);
      return "Sorry, there was an error decoding the letter. Please try again or contact support.";
    }
  }, []);

  return (
    <div className="game-container">
      <div className="game-header">
        <h1>Breakout</h1>
      </div>
      <div className="game-content">
        <div className="breakout-game">
          {!showLetter ? (
            <canvas
              ref={canvasRef}
              style={{
                width: `${gameSize.width}px`,
                height: `${gameSize.height}px`,
              }}
            />
          ) : (
            <div className="letter-container">
              <h2>Congratulations! Here's your letter:</h2>
              <pre className="letter-content">
                {decodeLetter(encodedLetter)}
              </pre>
            </div>
          )}
          <Link to="/" className="back-button">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Breakout;
