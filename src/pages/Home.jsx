import GameCard from "../components/GameCard";
import sampleImage from "../assets/placeholder.jpeg";

function Home() {
  const games = [
    {
      title: "Memory",
      image: sampleImage,
      link: "/memory",
      category: "Classic",
    },
    {
      title: "Morse Code",
      image: sampleImage,
      link: "/morse",
      category: "Educational",
    },
    {
      title: "Ball Avoidance",
      image: sampleImage,
      link: "/ballavoidance",
      category: "Arcade",
    },
    {
      title: "Breakout",
      image: sampleImage,
      link: "/breakout",
      category: "Classic",
    },
    {
      title: "Chatbot",
      image: sampleImage,
      link: "/chatbot",
      category: "Interactive",
    },
    {
      title: "Ride The Bus",
      image: sampleImage,
      link: "/ridethebus",
      category: "Card",
    },
    {
      title: "Touch Typing",
      image: sampleImage,
      link: "/touchtyping",
      category: "Educational",
    },
    {
      title: "Aim Training",
      image: sampleImage,
      link: "/aimtraining",
      category: "Arcade",
    },
    {
      title: "Magic 8 Ball",
      image: sampleImage,
      link: "/8ball",
      category: "Interactive",
    },
    {
      title: "Tetris",
      image: sampleImage,
      link: "/tetris",
      category: "Classic",
    },
    {
      title: "Canvas",
      image: sampleImage,
      link: "/canvas",
      category: "Creative",
    },
    { title: "Trivia", image: sampleImage, link: "/trivl", category: "Quiz" },
    {
      title: "Dice Roll",
      image: sampleImage,
      link: "/diceroll",
      category: "Random",
    },
    {
      title: "Blackjack",
      image: sampleImage,
      link: "/blackjack",
      category: "Card",
    },
    { title: "War", image: sampleImage, link: "/war", category: "Card" },
    { title: "2048", image: sampleImage, link: "/2048", category: "Puzzle" },
    { title: "Pool", image: sampleImage, link: "/pool", category: "Sports" },
  ];

  return (
    <div className="home-container">
      <div className="home-header">
        <h1>Retro Game Collection</h1>
        <p>Select a game to start playing!</p>
      </div>
      <div className="game-cards-container">
        {games.map((game, index) => (
          <GameCard
            key={index}
            title={game.title}
            image={game.image}
            link={game.link}
            category={game.category}
          />
        ))}
      </div>
    </div>
  );
}

export default Home;
