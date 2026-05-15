import "./NPCDialogue.css";

export default function NPCDialogue({ npc_text, npc_emotion, npc_name, emoji_map }) {
  const emoji = emoji_map?.[npc_emotion] ?? "😺";

  return (
    <div className="npc-dialogue">
      <div className="npc-dialogue__avatar">{emoji}</div>
      <div className="npc-dialogue__bubble">
        <span className="npc-dialogue__name">{npc_name}</span>
        <p className="npc-dialogue__text">{npc_text}</p>
      </div>
    </div>
  );
}
