import axios from "axios";
import { usersUrl } from "../App";

export const register = async (payload) => {
  const res = await axios.post(`${usersUrl}register`, payload);
  return res.data;
};

export const login = async (payload) => {
  const res = await axios.post(`${usersUrl}login`, payload, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

export const getProfile = async (token) => {
  const res = await axios.get(`${usersUrl}me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};