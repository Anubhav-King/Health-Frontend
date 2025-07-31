// src/utils/storageUtils.js

export const getToken = () => {
  const token = localStorage.getItem("token");
  console.log("Retrieved token from localStorage:", token);
  return token;
};


export const setToken = (token) => {
  localStorage.setItem("token", token);
};

export const removeToken = () => {
  localStorage.removeItem("token");
};

export const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const setUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const removeUser = () => {
  localStorage.removeItem("user");
};

export const getActiveRole = () => {
  return localStorage.getItem("activeRole");
};

export const setActiveRole = (role) => {
  localStorage.setItem("activeRole", role);
};

export const removeActiveRole = () => {
  localStorage.removeItem("activeRole");
};
