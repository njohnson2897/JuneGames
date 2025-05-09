import { useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";

const Morse = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const audioCtxRef = useRef(null);

  const MORSE_CODE = {
    A: ".-",
    B: "-...",
    C: "-.-.",
    D: "-..",
    E: ".",
    F: "..-.",
    G: "--.",
    H: "....",
    I: "..",
    J: ".---",
    K: "-.-",
    L: ".-..",
    M: "--",
    N: "-.",
    O: "---",
    P: ".--.",
    Q: "--.-",
    R: ".-.",
    S: "...",
    T: "-",
    U: "..-",
    V: "...-",
    W: ".--",
    X: "-..-",
    Y: "-.--",
    Z: "--..",
    " ": "/",
  };

  const playSound = useCallback((frequency, duration) => {
    return new Promise((resolve) => {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContext();
      }

      const oscillator = audioCtxRef.current.createOscillator();
      const gainNode = audioCtxRef.current.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtxRef.current.destination);

      oscillator.type = "sine";
      oscillator.frequency.value = frequency;
      gainNode.gain.setValueAtTime(0.2, audioCtxRef.current.currentTime);
      oscillator.start();

      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        audioCtxRef.current.currentTime + duration
      );

      setTimeout(() => {
        oscillator.stop();
        resolve();
      }, duration + 20);
    });
  }, []);

  const encode = useCallback(async () => {
    if (!inputText) return;

    let output = "";
    for (let i = 0; i < inputText.length; i++) {
      let char = inputText[i].toUpperCase();
      if (MORSE_CODE[char]) {
        output += MORSE_CODE[char] + " ";
      }
    }
    setOutputText(output.trim());
  }, [inputText]);

  const decode = useCallback(() => {
    if (!inputText) return;

    let words = inputText.split("/");
    let output = "";
    for (let i = 0; i < words.length; i++) {
      let letters = words[i].split(" ");
      for (let j = 0; j < letters.length; j++) {
        let morse = letters[j];
        for (let char in MORSE_CODE) {
          if (MORSE_CODE[char] === morse) {
            output += char;
            break;
          }
        }
      }
      output += " ";
    }
    setOutputText(output.trim());
  }, [inputText]);

  const playMorse = useCallback(async () => {
    if (!outputText || isPlaying) return;

    setIsPlaying(true);
    const baseDelay = 100 / playbackSpeed;
    const letterDelay = 300 / playbackSpeed;

    try {
      for (let morse of outputText.split(" ")) {
        for (let signal of morse) {
          if (signal === ".") {
            await playSound(800, 100);
          } else if (signal === "-") {
            await playSound(600, 300);
          }
          await new Promise((resolve) => setTimeout(resolve, baseDelay));
        }
        await new Promise((resolve) => setTimeout(resolve, letterDelay));
      }
    } finally {
      setIsPlaying(false);
    }
  }, [outputText, isPlaying, playbackSpeed, playSound]);

  const handleSpeedChange = (e) => {
    setPlaybackSpeed(parseFloat(e.target.value));
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
    setOutputText("");
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <h1>Morse Code</h1>
      </div>
      <div className="game-content">
        <div className="morse-game">
          <div className="morse-controls">
            <div className="input-group">
              <label htmlFor="inputText">Input Text:</label>
              <textarea
                id="inputText"
                value={inputText}
                onChange={handleInputChange}
                placeholder="Enter text to encode/decode..."
                rows={4}
              />
            </div>
            <div className="button-group">
              <button onClick={encode} disabled={isPlaying}>
                Encode
              </button>
              <button onClick={decode} disabled={isPlaying}>
                Decode
              </button>
              <button
                onClick={playMorse}
                disabled={!outputText || isPlaying}
                className={isPlaying ? "playing" : ""}
              >
                {isPlaying ? "Playing..." : "Play Morse"}
              </button>
            </div>
            <div className="speed-control">
              <label htmlFor="speed">Playback Speed:</label>
              <input
                type="range"
                id="speed"
                min="0.5"
                max="2"
                step="0.1"
                value={playbackSpeed}
                onChange={handleSpeedChange}
                disabled={isPlaying}
              />
              <span>{playbackSpeed}x</span>
            </div>
          </div>
          <div className="output-group">
            <label htmlFor="outputText">Output:</label>
            <textarea
              id="outputText"
              value={outputText}
              readOnly
              placeholder="Morse code or decoded text will appear here..."
              rows={4}
            />
          </div>
          <div className="morse-guide">
            <h3>Morse Code Guide</h3>
            <div className="guide-grid">
              {Object.entries(MORSE_CODE).map(([char, code]) => (
                <div key={char} className="guide-item">
                  <span className="char">{char}</span>
                  <span className="code">{code}</span>
                </div>
              ))}
            </div>
          </div>
          <Link to="/" className="back-button">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Morse;
