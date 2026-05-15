from pydantic import BaseModel


class MeowRequest(BaseModel):
    audio_base64: str
    npc_id: str
    player_stature: int


class MeowResponse(BaseModel):
    intent: str
    npc_text: str
    npc_emotion: str
    relationship_delta: int
    stature_delta: int
    intent_label: str
