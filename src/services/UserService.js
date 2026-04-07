import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Fix: no hardcoded Content-Type — axios sets multipart boundary automatically for FormData
export const register = async (payload) => {
  const res = await axios.post(`${API}/users/register`, payload);
  return res.data;
};

export const login = async (payload) => {
  const res = await axios.post(`${API}/users/login`, payload, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

export const getProfile = async (token) => {
  const res = await axios.get(`${API}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};