import client from "./config/axiosClient.js";

const getRoles = async () => {
  return (await client.get("/roles")).data;
};

const getRole = async (id) => {
  return (await client.get(`/roles/${id}`)).data;
};

export default {
  getRoles,
  getRole,
};
