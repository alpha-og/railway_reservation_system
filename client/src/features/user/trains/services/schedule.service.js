import client from "../../../../services/config/axiosClient.js";

async function getSchedule(scheduleId) {
  return (await client.get(`/trains/${scheduleId}/schedule`)).data;
}

async function getScheduleByScheduleStopId(scheduleStopId) {
  return (await client.get(`/schedules/${scheduleStopId}`)).data;
}

export default {
  getSchedule,
  getScheduleByScheduleStopId,
};
