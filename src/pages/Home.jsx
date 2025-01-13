import GameCard from '../components/GameCard';
import sampleImage from '../assets/placeholder.jpeg';

function Home() {
  const games = [
    { title: 'Memory', image: sampleImage, link: '/memory' },
    { title: 'Morse Code', image: sampleImage, link: '/morse' },
    { title: 'Ball Avoidance', image: sampleImage, link: '/ball-avoidance' },
    { title: 'Breakout', image: sampleImage, link: '/breakout' },
    { title: 'Chatbot', image: sampleImage, link: '/chatbot' },
    { title: 'Ride The Bus', image: sampleImage, link: '/ridethebus' },
    { title: 'Touch Typing', image: sampleImage, link: '/touchtyping' },
    { title: 'Aim Training', image: sampleImage, link: '/aimtraining' },
    { title: 'Magic 8 Ball', image: sampleImage, link: '/8ball' },
    { title: 'Tetris', image: sampleImage, link: '/tetris' },
    { title: 'Canvas', image: sampleImage, link: '/canvas' },
    { title: 'Trivia', image: sampleImage, link: '/trivl' },
    { title: 'Dice Roll', image: sampleImage, link: '/diceroll' },
    { title: 'Blackjack', image: sampleImage, link: '/blackjack' },
    { title: 'War', image: sampleImage, link: '/war' },
  ];

  return (
    <div className="game-cards-container">
      {games.map((game, index) => (
        <GameCard key={index} title={game.title} image={game.image} link={game.link} />
      ))}
    </div>
  );
}

export default Home;
