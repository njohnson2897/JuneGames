// import GameCard from '../components/GameCard';
// import sampleImage from '../assets/sample-game.jpg';

function Home() {
//   const games = [
//     { title: 'Memory Game', image: sampleImage, link: '/memory' },
//     { title: 'Trivia Game', image: sampleImage, link: '/trivia' },
//     { title: 'Ball Avoidance', image: sampleImage, link: '/ball-avoidance' },
//     // Add more games here
//   ];

  return (
    <div className="game-cards-container">
        Games will go here
      {/* {games.map((game, index) => (
        <GameCard key={index} title={game.title} image={game.image} link={game.link} />
      ))} */}
    </div>
  );
}

export default Home;
