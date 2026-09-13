import api from "./api.js";

export const listChores = (householdId) =>
  api.get(`/households/${householdId}/chores`).then((r) => r.data.chores);
export const createChore = (householdId, payload) =>
  api.post(`/households/${householdId}/chores`, payload).then((r) => r.data.chore);
export const updateChore = (choreId, payload) =>
  api.put(`/chores/${choreId}`, payload).then((r) => r.data.chore);
export const deleteChore = (choreId) => api.delete(`/chores/${choreId}`);

export const listAssignments = (householdId, params = {}) =>
  api.get(`/households/${householdId}/assignments`, { params }).then((r) => r.data.assignments);
export const updateAssignment = (assignmentId, payload) =>
  api.put(`/assignments/${assignmentId}`, payload).then((r) => r.data.assignment);

export const runDistribution = (householdId, choreIds) =>
  api.post(`/households/${householdId}/distribute`, { choreIds }).then((r) => r.data);
export const confirmDistribution = (householdId, assignments, roundLabel) =>
  api
    .post(`/households/${householdId}/distribute/confirm`, { assignments, roundLabel })
    .then((r) => r.data.assignments);

export const householdStatistics = (householdId) =>
  api.get(`/households/${householdId}/statistics`).then((r) => r.data);