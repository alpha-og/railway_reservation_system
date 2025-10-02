import client from "../../../../services/config/axiosClient.js";

async function getTrainAvailability(trainId, date) {
  return (
    await client.get(`/trains/${trainId}/availability`, {
      params: { date },
    })
  ).data;
}

// Get schedule details including availability with coach details
async function getScheduleAvailability(scheduleId) {
  return (await client.get(`/schedules/${scheduleId}/availability`)).data;
}

export default {
  getTrainAvailability,
  getScheduleAvailability,
};
