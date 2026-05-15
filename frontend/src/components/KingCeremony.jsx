import { useState, useEffect, useRef } from "react";
import MeowButton from "./MeowButton";
import { pledgeFealty as apiPledge, checkPledgeLine } from "../utils/api";
import "./KingCeremony.css";

// The three pledge lines the king recites and the player must repeat
const PLEDGE = [
  {
    kingMeow:        "Mrrrrow......",
    kingSubtitle:    "\"I pledge my meow to the kingdom eternal.\"",
    userHint:        "Deep and sustained — hold your meow until it fills the hall.",
  },
  {
    kingMeow:        "Mew! Mew! MEW!",
    kingSubtitle:    "\"To serve with loyalty and thunderous purring.\"",
    userHint:        "Short and energetic — three sharp meows with conviction.",
  },
  {
    kingMeow:        "Mrrow... mew. Mew. Mew.",
    kingSubtitle:    "\"And to meow truly, from this day forth, forevermore.\"",
    userHint:        "Three distinct meows with a breath between each one.",
  },
];

const MAX_ATTEMPTS = 3;

// Every screen state the ceremony passes through in order.
// §NAME§ in `sub` is replaced at render time with the player's name.
const STEPS = [
  { type: "king",     meow: "......",                     sub: "The ancient halls of the Meow Kingdom fall silent.",                  dur: 2500 },
  { type: "king",     meow: "Mrrrrooow...",               sub: "A new soul approaches the throne. The Meow King stirs.",             dur: 3200 },
  { type: "name",     meow: "Mrrow mew mew?",             sub: "What is your name, wanderer? Speak it before the throne."                      },
  { type: "king",     meow: "Mrrrow! Mew mew mew.",       sub: "§NAME§... you must take the Ancient Pledge of Meow.",                dur: 3500 },
  { type: "king",     meow: "Mew mrow mew. Mrrrow.",      sub: "Repeat after me. Mean every meow. The kingdom is listening.",        dur: 3200 },
  // Pledge line 0
  { type: "king",     meow: PLEDGE[0].kingMeow,           sub: PLEDGE[0].kingSubtitle,  pledge: 0,                                  dur: 4000 },
  { type: "user",     sub: PLEDGE[0].userHint,            pledge: 0                                                                           },
  { type: "result",   pledge: 0,                                                                                                     dur: 2500 },
  // Pledge line 1
  { type: "king",     meow: PLEDGE[1].kingMeow,           sub: PLEDGE[1].kingSubtitle,  pledge: 1,                                  dur: 4000 },
  { type: "user",     sub: PLEDGE[1].userHint,            pledge: 1                                                                           },
  { type: "result",   pledge: 1,                                                                                                     dur: 2500 },
  // Pledge line 2
  { type: "king",     meow: PLEDGE[2].kingMeow,           sub: PLEDGE[2].kingSubtitle,  pledge: 2,                                  dur: 4000 },
  { type: "user",     sub: PLEDGE[2].userHint,            pledge: 2                                                                           },
  { type: "result",   pledge: 2,                                                                                                     dur: 2500 },
  // Ceremony complete
  { type: "complete", meow: "MRRROOOOW!!!! Mew mew mew!", sub: "§NAME§ has been acknowledged by the kingdom! RISE AND MEOW FOREVERMORE!", dur: 3800 },
];

export default function KingCeremony({ onFealtyPledged }) {
  const [stepIdx, setStepIdx]           = useState(0);
  const [playerName, setPlayerName]     = useState("");
  const [isLoading, setIsLoading]       = useState(false);
  const [retryMsg, setRetryMsg]         = useState("");
  const [resultPassed, setResultPassed] = useState(false);
  const [resultMsg, setResultMsg]       = useState("");
  const [attemptsMap, setAttemptsMap]   = useState({ 0: 0, 1: 0, 2: 0 });

  // Keep a ref so async callbacks always read the latest name
  const nameRef = useRef(playerName);
  useEffect(() => { nameRef.current = playerName; }, [playerName]);

  const step     = STEPS[stepIdx];
  const subtitle = (step.sub ?? "").replace(/§NAME§/g, playerName);

  // Auto-advance king/result steps after their duration
  useEffect(() => {
    if (!step.dur || step.type === "user" || step.type === "name" || step.type === "complete") return;
    const t = setTimeout(() => setStepIdx(i => i + 1), step.dur);
    return () => clearTimeout(t);
  }, [stepIdx]);

  // Complete step: call backend pledge then hand off to App
  useEffect(() => {
    if (step.type !== "complete") return;
    const t = setTimeout(async () => {
      try { await apiPledge(nameRef.current); } catch { /* non-fatal */ }
      onFealtyPledged(nameRef.current);
    }, step.dur ?? 3800);
    return () => clearTimeout(t);
  }, [stepIdx]);

  // Clear retry message when step changes
  useEffect(() => { setRetryMsg(""); }, [stepIdx]);

  function handleNameSubmit(e) {
    e?.preventDefault();
    if (!playerName.trim()) return;
    setStepIdx(i => i + 1);
  }

  async function handlePledgeMeow(audioBlob) {
    if (step.type !== "user") return;
    const lineIdx = step.pledge;
    setIsLoading(true);
    setRetryMsg("");

    const newAttempts = attemptsMap[lineIdx] + 1;
    setAttemptsMap(a => ({ ...a, [lineIdx]: newAttempts }));

    try {
      let result;
      // Auto-pass on final attempt so players can't get permanently stuck
      if (newAttempts >= MAX_ATTEMPTS) {
        result = { passed: true, feedback: "The king sighs... but nods. Your pledge is accepted." };
      } else {
        result = await checkPledgeLine(audioBlob, lineIdx);
      }

      if (result.passed) {
        setResultPassed(true);
        setResultMsg(result.feedback);
        setStepIdx(i => i + 1);   // move to result step
      } else {
        setRetryMsg(result.feedback);
      }
    } catch {
      setRetryMsg("The kingdom's messenger pigeon got lost. Try again.");
    } finally {
      setIsLoading(false);
    }
  }

  // Pledge phase = steps 5–13
  const inPledgePhase  = stepIdx >= 5 && stepIdx <= 13;
  const pledgeProgress = inPledgePhase ? Math.floor((stepIdx - 5) / 3) : -1;

  // King emoji: crown for opening and finale, cat for conversation
  const kingEmoji = (stepIdx <= 1 || step.type === "complete") ? "👑" : "😺";

  return (
    <div className="ceremony">

      {/* Pledge progress dots */}
      {inPledgePhase && (
        <div className="ceremony__progress">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className={[
                "ceremony__dot",
                i < pledgeProgress  ? "ceremony__dot--done"   : "",
                i === pledgeProgress ? "ceremony__dot--active" : "",
              ].join(" ")}
            />
          ))}
        </div>
      )}

      {/* Main king / content area */}
      <div className="ceremony__stage">

        {/* King emoji */}
        <div
          key={`emoji-${stepIdx}`}
          className={`ceremony__emoji ${
            step.type === "king" || step.type === "complete"
              ? "ceremony__emoji--speaking"
              : ""
          }`}
        >
          {kingEmoji}
        </div>

        {/* King speech bubble */}
        {(step.type === "king" || step.type === "complete") && step.meow && (
          <div className="ceremony__speech" key={`speech-${stepIdx}`}>
            <span className="ceremony__meow-text">{step.meow}</span>
          </div>
        )}

        {/* Name input */}
        {step.type === "name" && (
          <form className="ceremony__name-form" onSubmit={handleNameSubmit}>
            <input
              className="ceremony__input"
              type="text"
              placeholder="Your name, stray..."
              value={playerName}
              onChange={e => setPlayerName(e.target.value)}
              autoFocus
            />
            <button
              type="submit"
              className="ceremony__submit-btn"
              disabled={!playerName.trim()}
            >
              Present yourself →
            </button>
          </form>
        )}

        {/* User pledge meow */}
        {step.type === "user" && (
          <div className="ceremony__pledge-user" key={`user-${stepIdx}`}>
            <div className="ceremony__pledge-echo">
              <span className="ceremony__pledge-king-meow">
                {PLEDGE[step.pledge].kingMeow}
              </span>
              <span className="ceremony__pledge-translation">
                {PLEDGE[step.pledge].kingSubtitle}
              </span>
            </div>

            {retryMsg && (
              <p className="ceremony__retry-msg">⚠ {retryMsg}</p>
            )}

            {attemptsMap[step.pledge] > 0 && (
              <p className="ceremony__attempts">
                Attempt {attemptsMap[step.pledge]} / {MAX_ATTEMPTS}
              </p>
            )}

            <MeowButton onMeowComplete={handlePledgeMeow} isLoading={isLoading} />
          </div>
        )}

        {/* Pledge line result */}
        {step.type === "result" && (
          <div
            key={`result-${stepIdx}`}
            className={`ceremony__result ${
              resultPassed ? "ceremony__result--pass" : "ceremony__result--fail"
            }`}
          >
            <span className="ceremony__result-icon">
              {resultPassed ? "✓" : "✗"}
            </span>
            <span className="ceremony__result-text">{resultMsg}</span>
          </div>
        )}
      </div>

      {/* Subtitle bar — film-style at the bottom */}
      <div className="ceremony__subtitle-bar">
        <p className="ceremony__subtitle-text" key={`sub-${stepIdx}`}>
          {subtitle}
        </p>
      </div>
    </div>
  );
}
