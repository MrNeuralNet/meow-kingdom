import axios from "axios";

const BASE_URL = "http://localhost:8000";

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export async function sendMeow(audioBlob, npc_id, player_stature) {
  const audio_base64 = await blobToBase64(audioBlob);
  const response = await axios.post(`${BASE_URL}/meow`, {
    audio_base64,
    npc_id,
    player_stature,
  });
  return response.data;
}

export async function pledgeFealty(player_name) {
  const response = await axios.post(`${BASE_URL}/pledge`, { player_name });
  return response.data;
}
