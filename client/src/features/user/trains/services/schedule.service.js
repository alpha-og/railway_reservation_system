import client from "../../../../services/config/axiosClient.js";

async function getSchedule(scheduleId) {
  return (await client.get(`/trains/${scheduleId}/schedule`)).data;
}

async function getScheduleByScheduleStopId(scheduleStopId) {
  return (await client.get(`/schedules/${scheduleStopId}`)).data;
}

// Get schedule summary data (train, schedule, availability) by schedule ID
async function getScheduleSummaryByScheduleId(scheduleId) {
  return (await client.get(`/schedules/${scheduleId}`)).data;
}

export default {
  getSchedule,
  getScheduleByScheduleStopId,
  getScheduleSummaryByScheduleId,
};
