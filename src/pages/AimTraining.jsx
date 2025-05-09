import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

function AimTraining() {
  const [circles, setCircles] = useState([]);
  const [kills, setKills] = useState(0);
  const [currentWeapon, setCurrentWeapon] = useState("Pistol");
  const [ammo, setAmmo] = useState({ Pistol: 10, Shotgun: 3 });
  const [mags, setMags] = useState({ Pistol: 3, Shotgun: 3 });
  const [hoveredCircle, setHoveredCircle] = useState(null);
  const [canFire, setCanFire] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const gameAreaRef = useRef(null);

  const weapons = {
    Pistol: { fireRate: 300, magCapacity: 10 },
    Shotgun: { fireRate: 800, magCapacity: 3, burst: 5 },
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "r" || event.key === "R") {
        handleReload();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentWeapon, mags, ammo]);

  useEffect(() => {
    spawnCircles(5);

    const gameLoop = setInterval(() => {
      if (!gameOver) {
        updateCircles();
      }
    }, 30);

    const gameOverTimer = setTimeout(() => {
      setGameOver(true);
    }, 20000);

    return () => {
      clearInterval(gameLoop);
      clearTimeout(gameOverTimer);
    };
  }, [gameOver]);

  useEffect(() => {
    if (
      ammo.Pistol === 0 &&
      mags.Pistol === 0 &&
      ammo.Shotgun === 0 &&
      mags.Shotgun === 0
    ) {
      setGameOver(true);
    }
  }, [ammo, mags]);

  const spawnCircles = (num) => {
    const newCircles = [];
    for (let i = 0; i < num; i++) {
      newCircles.push(createCircle());
    }
    setCircles((prevCircles) => [...prevCircles, ...newCircles]);
  };

  const createCircle = () => {
    const gameArea = gameAreaRef.current.getBoundingClientRect();
    const size = 20;
    const x = Math.random() * (gameArea.width - size * 2) + size;
    const y = Math.random() * (gameArea.height - size * 2) + size;
    const dx = (Math.random() - 0.5) * 3;
    const dy = (Math.random() - 0.5) * 3;
    return { x, y, size, dx, dy };
  };

  const updateCircles = () => {
    setCircles((prevCircles) =>
      prevCircles
        .filter((circle) => circle !== null)
        .map((circle) => {
          if (!circle) return null;
          let newX = circle.x + circle.dx;
          let newY = circle.y + circle.dy;
          const gameArea = gameAreaRef.current.getBoundingClientRect();

          if (newX - circle.size < 0 || newX + circle.size > gameArea.width) {
            circle.dx = -circle.dx;
            newX = Math.max(
              circle.size,
              Math.min(newX, gameArea.width - circle.size)
            );
          }
          if (newY - circle.size < 0 || newY + circle.size > gameArea.height) {
            circle.dy = -circle.dy;
            newY = Math.max(
              circle.size,
              Math.min(newY, gameArea.height - circle.size)
            );
          }

          return { ...circle, x: newX, y: newY };
        })
        .filter((circle) => circle !== null)
    );
  };

  const handleFire = () => {
    if (!canFire || gameOver) return;

    if (ammo[currentWeapon] > 0) {
      setAmmo((prevAmmo) => ({
        ...prevAmmo,
        [currentWeapon]: prevAmmo[currentWeapon] - 1,
      }));

      if (hoveredCircle !== null) {
        setCircles((prevCircles) => {
          const updatedCircles = [...prevCircles];
          updatedCircles.splice(hoveredCircle, 1); // Remove the hit circle
          return updatedCircles;
        });
        setKills((prevKills) => prevKills + 1);
        spawnCircles(2); // Spawn two more circles
        setHoveredCircle(null);
      }

      const weapon = weapons[currentWeapon];
      setCanFire(false);
      setTimeout(() => setCanFire(true), weapon.fireRate);
    }
  };

  const handleReload = () => {
    if (gameOver) return;

    if (
      mags[currentWeapon] > 0 &&
      ammo[currentWeapon] < weapons[currentWeapon].magCapacity
    ) {
      setMags((prevMags) => ({
        ...prevMags,
        [currentWeapon]: prevMags[currentWeapon] - 1,
      }));
      setAmmo((prevAmmo) => ({
        ...prevAmmo,
        [currentWeapon]: weapons[currentWeapon].magCapacity,
      }));
    }
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <h1>Aim Training</h1>
      </div>
      <div className="game-content">
        <div className="gun-game">
          {gameOver ? (
            <div className="game-over">
              <h2>Good Game!</h2>
              <p>Total Score: {kills}</p>
              <Link to="/" className="back-button">
                Back to Home
              </Link>
            </div>
          ) : (
            <div>
              <div className="hud">
                <div className="weapon">
                  Current Weapon: {currentWeapon} ({ammo[currentWeapon]} /{" "}
                  {mags[currentWeapon]})
                </div>
                <div className="kills">Kills: {kills}</div>
              </div>
              <div className="game-area" ref={gameAreaRef} onClick={handleFire}>
                {circles.map(
                  (circle, index) =>
                    circle && (
                      <div
                        key={index}
                        className="circle"
                        onMouseOver={() => setHoveredCircle(index)}
                        style={{
                          left: circle.x - circle.size,
                          top: circle.y - circle.size,
                          width: circle.size * 2,
                          height: circle.size * 2,
                        }}
                      ></div>
                    )
                )}
              </div>
              <div className="controls">
                <button
                  onClick={handleReload}
                  disabled={mags[currentWeapon] === 0}
                >
                  Reload (R)
                </button>
                <div className="weapon-select">
                  {Object.keys(weapons).map((weapon) => (
                    <button
                      key={weapon}
                      onClick={() => setCurrentWeapon(weapon)}
                    >
                      {weapon}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AimTraining;
