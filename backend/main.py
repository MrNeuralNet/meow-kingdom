import base64
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from models import MeowRequest, MeowResponse
from audio_analyzer import extract_features
from intent_classifier import classify_intent
from dialogue_engine import get_response
from game_state import compute_stature_delta

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

NPC_INFO = {
    "biscuit":  {"name": "Biscuit",  "description": "A chaotic little kitten.", "unlock_stature": 0},
    "mittens":  {"name": "Mittens",  "description": "The village elder.",        "unlock_stature": 50},
    "zara":     {"name": "Zara",     "description": "The merchant cat.",         "unlock_stature": 150},
    "grimshaw": {"name": "Grimshaw", "description": "The grumpy guard.",         "unlock_stature": 300},
}


@app.post("/meow", response_model=MeowResponse)
async def handle_meow(request: MeowRequest):
    audio_bytes = base64.b64decode(request.audio_base64)

    features = extract_features(audio_bytes)
    intent = classify_intent(features)

    print(f"[/meow] features={features}  intent={intent}")

    response = get_response(request.npc_id, intent)
    stature_delta = compute_stature_delta(response["relationship_delta"])
    intent_label = f"The kingdom heard: {intent}"

    return MeowResponse(
        intent=intent,
        npc_text=response["npc_text"],
        npc_emotion=response["npc_emotion"],
        relationship_delta=response["relationship_delta"],
        stature_delta=stature_delta,
        intent_label=intent_label,
    )


@app.get("/npc/{npc_id}")
async def get_npc(npc_id: str):
    return NPC_INFO.get(npc_id, {"error": "NPC not found"})


@app.post("/pledge")
async def pledge(body: dict):
    player_name = body.get("player_name", "stray")
    return {"success": True, "message": f"The Meow King acknowledges you, {player_name}."}


@app.post("/check-pledge/{line_index}")
async def check_pledge_line(line_index: int, body: dict):
    audio_bytes = base64.b64decode(body["audio_base64"])
    features = extract_features(audio_bytes)
    print(f"[/check-pledge/{line_index}] features={features}")
    passed, feedback = _evaluate_pledge_line(line_index, features)
    return {"passed": passed, "feedback": feedback, "features": features}


def _evaluate_pledge_line(line_index: int, features: dict):
    duration  = features["duration"]
    intensity = features["intensity"]
    count     = features["meow_count"]

    if line_index == 0:
        # "I pledge my meow to the kingdom eternal." — deep and sustained
        passed = duration in ["medium", "long"]
        feedback = (
            "Hold your meow longer — let it ring through the halls of the kingdom."
            if not passed else
            "The kingdom feels the weight of your dedication."
        )
    elif line_index == 1:
        # "To serve with loyalty and thunderous purring." — energetic, loud
        passed = intensity in ["medium", "loud"] or count >= 2
        feedback = (
            "Put more heart into it! Louder! The walls must shake!"
            if not passed else
            "The halls echo with the sound of your loyalty."
        )
    elif line_index == 2:
        # "And to meow truly, from this day forth, forevermore." — three distinct meows
        passed = count >= 2
        feedback = (
            "Three meows! Mew, mew, mew — let each one be distinct!"
            if not passed else
            "Three true meows. The ancient words have been spoken."
        )
    else:
        passed = True
        feedback = "The kingdom accepts your pledge."

    return passed, feedback


@app.get("/health")
async def health():
    return {"status": "meowing"}
