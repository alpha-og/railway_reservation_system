import client from "../../../../services/config/axiosClient.js";

// Schedules
export async function getSchedules(filters = {}) {
  return (await client.get("/admin/schedules", { params: filters })).data;
}
export async function getScheduleById(scheduleId) {
  return (await client.get(`/admin/schedules/${scheduleId}`)).data;
}
export async function createSchedule(scheduleData) {
  return (await client.post("/admin/schedules", scheduleData)).data;
}
export async function updateSchedule(scheduleId, scheduleData) {
  return (await client.patch(`/admin/schedules/${scheduleId}`, scheduleData))
    .data;
}
export async function deleteSchedule(scheduleId) {
  return (await client.delete(`/admin/schedules/${scheduleId}`)).data;
}

// Schedule stops
export async function getScheduleStops(filters = {}) {
  return (await client.get("/admin/schedule-stops", { params: filters })).data;
}
export async function createScheduleStop(scheduleStopData) {
  return (await client.post("/admin/schedule-stops", scheduleStopData)).data;
}
export async function updateScheduleStop(id, scheduleStopData) {
  return (await client.patch(`/admin/schedule-stops/${id}`, scheduleStopData))
    .data;
}
export async function deleteScheduleStop(id) {
  return (await client.delete(`/admin/schedule-stops/${id}`)).data;
}
