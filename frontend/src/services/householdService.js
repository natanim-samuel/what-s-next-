import api from "./api.js";

export const listHouseholds = () => api.get("/households").then((r) => r.data.households);
export const createHousehold = (name) =>
  api.post("/households", { name }).then((r) => r.data.household);
export const joinHousehold = (inviteCode) =>
  api.post("/households/join", { inviteCode }).then((r) => r.data.household);
export const listMembers = (householdId) =>
  api.get(`/households/${householdId}/members`).then((r) => r.data.members);
export const updateMemberRole = (householdId, userId, role) =>
  api.put(`/households/${householdId}/members/${userId}`, { role }).then((r) => r.data.member);
export const removeMember = (householdId, userId) =>
  api.delete(`/households/${householdId}/members/${userId}`);