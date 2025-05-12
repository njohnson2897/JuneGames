import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./App.jsx";
import Home from "./pages/Home.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";
import "./index.css";
import AimTraining from "./pages/AimTraining.jsx";
import BallAvoidance from "./pages/BallAvoidance.jsx";
import Blackjack from "./pages/Blackjack.jsx";
import Breakout from "./pages/Breakout.jsx";
import Canvas from "./pages/Canvas.jsx";
import DiceRoll from "./pages/DiceRoll.jsx";
import Dino from "./pages/Dino.jsx";
import EightBall from "./pages/EightBall.jsx";
import Memory from "./pages/Memory.jsx";
import Morse from "./pages/Morse.jsx";
import Pong from "./pages/Pong.jsx";
import RideTheBus from "./pages/RideTheBus.jsx";
import Tetris from "./pages/Tetris.jsx";
import TouchTyping from "./pages/TouchTyping.jsx";
import Trivia from "./pages/Trivia.jsx";
import War from "./pages/War.jsx";
import TwentyFortyEight from "./pages/2048.jsx";
import Pool from "./pages/Pool.jsx";

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
      { path: "/diceroll", element: <DiceRoll /> },
      { path: "/dino", element: <Dino /> },
      { path: "/eightball", element: <EightBall /> },
      { path: "/memory", element: <Memory /> },
      { path: "/morse", element: <Morse /> },
      { path: "/pong", element: <Pong /> },
      { path: "/ridethebus", element: <RideTheBus /> },
      { path: "/tetris", element: <Tetris /> },
      { path: "/touchtyping", element: <TouchTyping /> },
      { path: "/trivia", element: <Trivia /> },
      { path: "/war", element: <War /> },
      { path: "/2048", element: <TwentyFortyEight /> },
      { path: "/pool", element: <Pool /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
