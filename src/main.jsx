import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";


import App from './App.jsx';
import Home from './pages/Home.jsx';
import ErrorPage from './pages/ErrorPage.jsx';
import './index.css'
import AimTraining from './pages/AimTraining.jsx';
import BallAvoidance from './pages/BallAvoidance.jsx';
import Blackjack from './pages/Blackjack.jsx';
import Breakout from './pages/Breakout.jsx';
import Canvas from './pages/Canvas.jsx';
import Chatbot from './pages/Chatbot.jsx';
import DiceRoll from './pages/DiceRoll.jsx';
import EightBall from './pages/EightBall.jsx';
import Memory from './pages/Memory.jsx';
import Morse from './pages/Morse.jsx';
import RideTheBus from './pages/RideTheBus.jsx';
import Tetris from './pages/Tetris.jsx';
import TouchTyping from './pages/TouchTyping.jsx';
import Trivia from './pages/Trivia.jsx';
import War from './pages/War.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "/aimtraining", element: <AimTraining /> },
      { path: "/ballavoidance", element: <BallAvoidance /> },
      { path: "/blackjack", element: <Blackjack /> },
      { path: "/breakout", element: <Breakout /> },
      { path: "/canvas", element: <Canvas /> },
      { path: "/chatbot", element: <Chatbot /> },
      { path: "/diceroll", element: <DiceRoll /> },
      { path: "/eightball", element: <EightBall /> },
      { path: "/memory", element: <Memory /> },
      { path: "/morse", element: <Morse /> },
      { path: "/ridethebus", element: <RideTheBus /> },
      { path: "/tetris", element: <Tetris /> },
      { path: "/touchtyping", element: <TouchTyping /> },
      { path: "/trivia", element: <Trivia /> },
      { path: "/war", element: <War /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
