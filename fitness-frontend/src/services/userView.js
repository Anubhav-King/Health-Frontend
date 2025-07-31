// services/userView.js
import axios from 'axios';

export const fetchUserUploads = async (userId, period, page = 1, refDate) => {
  const token = localStorage.getItem('token');
  const BASE_URL = process.env.REACT_APP_API_URL;

  const params = { period, page };
  if (refDate) {
    params.refDate = refDate;
  }

  const { data } = await axios.get(
    `${BASE_URL}/api/meals/user-uploads/${userId}`,
    {
      params,
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  const progressByDate = {
    ...(data.progressByDate || {})
  };

  if (data.progress) {
    const d = new Date(data.progress.date).toISOString().slice(0, 10);
    progressByDate[d] = data.progress;
  }

  return {
    ...data,
    progressByDate,
  };
};
