import client from "../../../../services/config/axiosClient.js";

async function getCoachTypes() {
  return (await client.get("/coach-types")).data;
}

async function getCoachTypeById(id) {
  return (await client.get(`/coach-types/${id}`)).data;
}

export default {
  getCoachTypes,
  getCoachTypeById,
};
