import GameContainer from "../components/GameContainer.jsx";
import { Link } from 'react-router-dom';

const AimTraining = () => {
  return (
    <GameContainer>
      <p>This is where your Aim Training game will go.</p>
      <p>
        Add your game elements (like grids, buttons, or instructions) inside the
        <code>GameContainer</code> component.
      </p>
      <Link to="/">Back to Games</Link>
    </GameContainer>
  );
};

export default AimTraining;