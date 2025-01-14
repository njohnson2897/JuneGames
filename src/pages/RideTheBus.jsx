import GameContainer from "../components/GameContainer.jsx";
import { Link } from 'react-router-dom';

const RideTheBus = () => {
  return (
    <GameContainer>
      <p>This is where your Ride The Bus game will go.</p>
      <p>
        Add your game elements (like grids, buttons, or instructions) inside the
        <code>GameContainer</code> component.
      </p>
      <Link to="/">Back to Games</Link>
    </GameContainer>
  );
};

export default RideTheBus;