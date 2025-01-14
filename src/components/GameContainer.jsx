const GameContainer = ({ children }) => {
  return (
    <div className="game-container">
      <div className="game-header">
        <h1>Game Title</h1>
      </div>
      <div className="game-content">{children}</div>
    </div>
  );
};

export default GameContainer;
