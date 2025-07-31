import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL;


export const getDashboardData = async () => {
  const token = localStorage.getItem("token");
  //console.log("API Base URL:", BASE_URL);
  const res = await axios.get(`${BASE_URL}/api/dashboard`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  //console.log("DASHBOARD DATA:", res.data);

  return res.data;
};

export const getLeaderboard = async (period) => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${BASE_URL}/api/leaderboard`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { period }, // ✅ Sends: /api/leaderboard?period=daily
  });
  return res.data;
};




