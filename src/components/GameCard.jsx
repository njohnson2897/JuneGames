import { Link } from 'react-router-dom';

function GameCard({ title, image, link }) {
  return (
    <div className="game-card">
      <Link to={link}>
        <img src={image} alt={title} />
        <div className="title">{title}</div>
      </Link>
    </div>
  );
}

export default GameCard;
