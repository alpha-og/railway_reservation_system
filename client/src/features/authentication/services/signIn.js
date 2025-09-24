import client from "../../../services/config/axiosClient.js";

export default async function signIn(data) {
  return (await client.post("/auth/signin", data)).data;
}
