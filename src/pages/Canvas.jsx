import GameContainer from "../components/GameContainer.jsx";
import { Link } from 'react-router-dom';

const Canvas = () => {
  return (
    <GameContainer>
      <p>This is where your Canvas game will go.</p>
      <p>
        Add your game elements (like grids, buttons, or instructions) inside the
        GameContainer component.
      </p>
      <Link to="/">Back to Games</Link>
    </GameContainer>
  );
};

export default Canvas;