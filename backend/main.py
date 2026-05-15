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


@app.get("/health")
async def health():
    return {"status": "meowing"}
