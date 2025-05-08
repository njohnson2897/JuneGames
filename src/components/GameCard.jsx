import { Link } from "react-router-dom";

function GameCard({ title, image, link, category }) {
  return (
    <div className="game-card">
      <Link to={link} className="game-card-link">
        <div className="game-card-inner">
          <div className="game-card-front">
            <img src={image} alt={title} />
            <div className="game-card-overlay">
              <h3>{title}</h3>
              <span className="category-badge">{category}</span>
            </div>
          </div>
          <div className="game-card-back">
            <h3>{title}</h3>
            <p>Click to play!</p>
            <span className="category-badge">{category}</span>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default GameCard;
