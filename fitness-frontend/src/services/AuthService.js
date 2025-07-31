// src/services/AuthService.js
import axios from 'axios';

//const BASE_URL = import.meta.env.REACT_APP_API_URL || 'http://localhost:5000';
const BASE_URL = "https://ebceebf3-81cc-4ce6-979e-387a3876db2e-00-1wfg3jhgn8y75.sisko.replit.dev";
console.log("API Base URL:", process.env.BASE_URL);


export const login = async (mobile, password) => {
  const res = await axios.post(`${BASE_URL}/api/auth/login`, { mobile, password });
  return res.data;
};

export const register = async (name, mobile) => {
  const res = await axios.post(`${BASE_URL}/api/auth/register`, { name, mobile });
  return res.data;
};

export const changePassword = async (currentPassword, newPassword, token) => {
  const response = await axios.post(
    `${BASE_URL}/api/auth/change-password`,
    {
      currentPassword,
      newPassword,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

