import client from "./config/axiosClient.js";

const getProfile = async () => {
  return (await client.get("/profile")).data;
};

export default {
  getProfile,
};
