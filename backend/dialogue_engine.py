import random

NPC_RESPONSES = {
    "biscuit": {
        "greeting":     {"responses": ["Mew mew! *spins in circle*", "MEW! You came back!! *bounces off walls*", "mewmewmew hi hi HI!!"], "emotion": "happy", "relationship_delta": 5},
        "question":     {"responses": ["Mew?? *tilts head so hard he falls over*", "mew??? *ears rotate like satellites*", "Mew mew?? Biscuit also wonders!!"], "emotion": "confused", "relationship_delta": 2},
        "agreement":    {"responses": ["MEW MEW MEW! Yes yes yes!!", "mew mew!! *nodding so fast*", "YES MEW!! Biscuit agrees completely!!"], "emotion": "happy", "relationship_delta": 6},
        "disagreement": {"responses": ["*ears droop* ...mew", "*sits down sadly* ...mew mew", "*little sniffle* mew..."], "emotion": "sad", "relationship_delta": -3},
        "demand":       {"responses": ["Mrrp?? Biscuit is confusion", "mew?? *doesn't understand but tries to help*", "Mrp! Biscuit will... do something!!"], "emotion": "confused", "relationship_delta": -2},
        "affection":    {"responses": ["mew mew mew... *head bumps you*", "*purring intensifies* mew mew mew~", "mewww *kneads paws happily*"], "emotion": "happy", "relationship_delta": 10},
        "confusion":    {"responses": ["*also confused* mew?", "mew?? *sits in confusion together*", "mew mew? Biscuit doesn't know either!"], "emotion": "confused", "relationship_delta": 1},
        "excitement":   {"responses": ["MREOW!! *zoomies commence*", "MEW MEW MEW!! *ricochets off every wall*", "MREEEOW!! *vibrating at maximum frequency*"], "emotion": "happy", "relationship_delta": 7},
        "sadness":      {"responses": ["*gently puts paw on you* ...mew", "*curls up next to you* mew...", "*soft purr* mew mew..."], "emotion": "sad", "relationship_delta": 3},
        "anger":        {"responses": ["*hides behind rock* mrrow...", "*peeks nervously from behind paw* mew?", "*ears flat* ...mrrow..."], "emotion": "sad", "relationship_delta": -8},
        "unknown":      {"responses": ["*stares blankly* ....mew?", "...mew?", "*tilts head very slowly* mew??"], "emotion": "confused", "relationship_delta": 0},
    },
    "mittens": {
        "greeting":     {"responses": ["Mrrrow. The young one returns.", "Mew. I sensed your approach.", "...Mrrrow. You have come back to the elder's corner."], "emotion": "neutral", "relationship_delta": 3},
        "question":     {"responses": ["Mew... the answer lies within the meow itself.", "Mrrrow. Ask the silence. It knows.", "Mew mew. Even questions are answers in disguise."], "emotion": "neutral", "relationship_delta": 5},
        "agreement":    {"responses": ["Mrrp. Wisdom recognises wisdom.", "Mew. You see clearly today.", "...Mrrrow. We are aligned."], "emotion": "happy", "relationship_delta": 4},
        "disagreement": {"responses": ["Mew. Even discord has its place.", "Mrrrow. Your doubt is noted. And valid.", "Mew mew. The river disagrees with the stone. Both persist."], "emotion": "neutral", "relationship_delta": 2},
        "demand":       {"responses": ["Mrrow. Patience, young stray. Patience.", "Mew. The wind does not demand. It simply moves.", "...Mrrrow. Urgency is the enemy of wisdom."], "emotion": "angry", "relationship_delta": -5},
        "affection":    {"responses": ["*slow blink* Mrrrow. You are learning.", "Mew... *slow blink* You have grown.", "Mrrrow. *slow blink* The kingdom sees you."], "emotion": "happy", "relationship_delta": 8},
        "confusion":    {"responses": ["Mew mew. Confusion is the beginning of knowing.", "Mrrrow. The lost path often leads somewhere better.", "Mew. Good. A clear mind admits when it is murky."], "emotion": "neutral", "relationship_delta": 3},
        "excitement":   {"responses": ["Mrrow... Settle. The kingdom is calm.", "Mew. Breathe. The sun rises regardless of your speed.", "...Mrrrow. Still your tail, young one."], "emotion": "neutral", "relationship_delta": -2},
        "sadness":      {"responses": ["Mrrr. Even the moon has its dark side, young one.", "Mew mew. Grief is a form of remembering. Let it pass.", "...Mrrrow. I have sat with sorrow longer than you have lived."], "emotion": "happy", "relationship_delta": 6},
        "anger":        {"responses": ["Mrow. Control yourself. This is not the way.", "Mew. Fire burns the one who holds it.", "...Mrrrow. I will not meet your storm with my own."], "emotion": "angry", "relationship_delta": -6},
        "unknown":      {"responses": ["...Mew. Speak again, with intention.", "Mrrrow. I did not hear a meow. I heard noise.", "Mew. Come back when your meow has meaning."], "emotion": "neutral", "relationship_delta": 0},
    },
    "grimshaw": {
        "greeting":     {"responses": ["Mrrf. You again.", "Mrow. Still alive, I see.", "...Mrrf. What do you want."], "emotion": "neutral", "relationship_delta": 1},
        "question":     {"responses": ["Mrow. I ask the questions here.", "Mrrf. Don't interrogate the guard.", "Mrow. That's classified."], "emotion": "angry", "relationship_delta": -2},
        "agreement":    {"responses": ["...Mrf. Fine.", "Mrow. Don't make it weird.", "Mrrf. Acceptable."], "emotion": "neutral", "relationship_delta": 3},
        "disagreement": {"responses": ["Mrow. Good. At least you have a spine.", "Mrrf. FINALLY. Someone who pushes back.", "Mrow. I respect that. Barely."], "emotion": "happy", "relationship_delta": 4},
        "demand":       {"responses": ["MROW. You dare make demands of Grimshaw?!", "Mrrf. DEMANDS?! I am the GUARD.", "MROW. Get. Out. Of. My. Post."], "emotion": "angry", "relationship_delta": -8},
        "affection":    {"responses": ["Mrf. Do NOT get sentimental with me.", "Mrow. Stop that. Right now.", "Mrrf. I am a professional. Behave."], "emotion": "angry", "relationship_delta": -4},
        "confusion":    {"responses": ["Mrrf. Hmph. At least you're honest.", "Mrow. Confused is better than wrong.", "Mrrf. I've seen worse. Not much worse, but worse."], "emotion": "neutral", "relationship_delta": 1},
        "excitement":   {"responses": ["MROW. KEEP. IT. DOWN.", "Mrrf. This is a POST, not a PARTY.", "MROW. One more outburst and you're on the list."], "emotion": "angry", "relationship_delta": -5},
        "sadness":      {"responses": ["...Mrrf. *looks away* I've seen worse days too.", "Mrow. *clears throat* ...tough patrol lately.", "Mrrf. ...Don't tell anyone I said this. It gets better."], "emotion": "neutral", "relationship_delta": 5},
        "anger":        {"responses": ["Mrow! NOW you speak my language.", "Mrrf. YES. THAT is the correct emotional state.", "MROW! Finally, some proper aggression!"], "emotion": "happy", "relationship_delta": 6},
        "unknown":      {"responses": ["Mrf. Speak clearly or don't speak at all.", "Mrow. Was that a meow or a malfunction.", "Mrrf. Try again. With words. Meow words."], "emotion": "angry", "relationship_delta": -2},
    },
    "zara": {
        "greeting":     {"responses": ["Mew mew mew! Perfect timing, I have DEALS!", "MEW! A customer! I mean, a friend! Possibly both!", "Mew mew! You arrived just as I restocked!"], "emotion": "happy", "relationship_delta": 4},
        "question":     {"responses": ["Ooh a curious one! Mew — let me tell you everything.", "Mew mew! Questions mean INTEREST! I love interest!", "Mrrrow! Ask away, Zara knows all prices!"], "emotion": "happy", "relationship_delta": 3},
        "agreement":    {"responses": ["MEW! Yes! Smart customer, very smart!", "Mew mew! You have excellent taste and judgement!", "MEW! We are in business! Metaphorically! Or literally!"], "emotion": "happy", "relationship_delta": 5},
        "disagreement": {"responses": ["Mew? No no no, you misunderstand the value here.", "Mrrrow... Perhaps Zara explained it poorly. Let me try again.", "Mew mew. The deal is still good. Trust Zara."], "emotion": "confused", "relationship_delta": -2},
        "demand":       {"responses": ["Mrrrow! A cat who knows what they want! Respect!", "MEW! Directness! My favourite quality in a buyer!", "Mew mew mew! Zara appreciates the boldness!"], "emotion": "happy", "relationship_delta": 2},
        "affection":    {"responses": ["Mew mew! You're my favourite customer, I mean friend!", "*delighted mew* Zara is touched. Also still has deals.", "Mew!! Best friend discount! (it is 2%)"], "emotion": "happy", "relationship_delta": 7},
        "confusion":    {"responses": ["Mew? That's okay, Zara will explain everything.", "Mrrrow! No shame in confusion! Zara was once confused about prices. Once.", "Mew mew. Let Zara walk you through it."], "emotion": "confused", "relationship_delta": 1},
        "excitement":   {"responses": ["MREOW! Yes! The energy! Buy something to celebrate!", "MEW MEW MEW! This is why Zara loves the marketplace!", "MREOW!! Excellent! Channel this into purchasing decisions!"], "emotion": "happy", "relationship_delta": 8},
        "sadness":      {"responses": ["Mew... even Zara has slow days. Mew mew.", "Mrrrow... *pats your paw* Discount on comfort goods today.", "Mew. The market will be better tomorrow. Probably."], "emotion": "sad", "relationship_delta": 3},
        "anger":        {"responses": ["Mrow?! There is no need for that in the market!", "Mew mew! Anger is bad for business! And fur!", "Mrrrow. Deep breaths. Then browse the wares."], "emotion": "confused", "relationship_delta": -3},
        "unknown":      {"responses": ["Mew? Mew mew? ...Zara is also confused.", "Mrrrow... was that a meow or an offer?", "Mew. Interesting pitch. Zara will... consider it."], "emotion": "confused", "relationship_delta": 0},
    },
}


def get_response(npc_id: str, intent: str) -> dict:
    npc = NPC_RESPONSES.get(npc_id, NPC_RESPONSES["biscuit"])
    entry = npc.get(intent, npc["unknown"])
    return {
        "npc_text": random.choice(entry["responses"]),
        "npc_emotion": entry["emotion"],
        "relationship_delta": entry["relationship_delta"],
    }
