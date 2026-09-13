import api from "./api.js";

export async function registerUser(data) {
  const { data: res } = await api.post("/auth/register", data);
  return res;
}

export async function loginUser(data) {
  const { data: res } = await api.post("/auth/login", data);
  return res;
}

export async function fetchMe() {
  const { data: res } = await api.get("/auth/me");
  return res.user;
}