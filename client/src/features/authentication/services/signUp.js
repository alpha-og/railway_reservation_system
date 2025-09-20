import client from "../../../services/config/axiosClient.js";

export default async function signUp(data) {
  // For simplicity, mock fallback can be added similarly
  const res = await client.post("/auth/signup", data);
  return res.data;
}
