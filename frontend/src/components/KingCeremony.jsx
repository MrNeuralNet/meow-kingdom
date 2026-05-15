import { useState } from "react";
import MeowButton from "./MeowButton";
import { pledgeFealty as apiFedge } from "../utils/api";
import "./KingCeremony.css";

export default function KingCeremony({ onFealtyPledged }) {
  const [playerName, setPlayerName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleMeow(audioBlob) {
    if (!playerName.trim()) {
      setError("You must enter your name before pledging fealty.");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      await apiFedge(playerName.trim());
      onFealtyPledged(playerName.trim());
    } catch {
      setError("The kingdom's messenger pigeon got lost. Try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="ceremony">
      <div className="ceremony__content">
        <div className="ceremony__crown">👑</div>
        <h1 className="ceremony__title">The Meow Kingdom</h1>
        <p className="ceremony__subtitle">You stand before the Meow King.</p>

        <input
          className="ceremony__input"
          type="text"
          placeholder="Enter your name, stray"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          disabled={isLoading}
        />

        <p className="ceremony__instruction">
          When you are ready — meow once to pledge your fealty
        </p>

        {error && <p className="ceremony__error">{error}</p>}

        <MeowButton onMeowComplete={handleMeow} isLoading={isLoading} />
      </div>
    </div>
  );
}
