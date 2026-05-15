import { useAudioRecorder } from "../hooks/useAudioRecorder";
import "./MeowButton.css";

export default function MeowButton({ onMeowComplete, isLoading }) {
  const { isRecording, startRecording, stopRecording } = useAudioRecorder();

  async function handleStart(e) {
    e.preventDefault();
    if (isLoading || isRecording) return;
    try {
      await startRecording();
    } catch {
      alert("The kingdom cannot hear you. Please allow microphone access.");
    }
  }

  async function handleStop(e) {
    e.preventDefault();
    if (!isRecording) return;
    const blob = await stopRecording();
    if (blob && onMeowComplete) {
      onMeowComplete(blob);
    }
  }

  let label = "🎙️ Hold to Meow";
  let stateClass = "idle";
  if (isRecording) { label = "🔴 Meowing..."; stateClass = "recording"; }
  if (isLoading)   { label = "⏳ The kingdom listens..."; stateClass = "processing"; }

  return (
    <button
      className={`meow-btn meow-btn--${stateClass}`}
      onMouseDown={handleStart}
      onMouseUp={handleStop}
      onTouchStart={handleStart}
      onTouchEnd={handleStop}
      disabled={isLoading}
    >
      {label}
    </button>
  );
}
