import axios from 'axios';

const API_URL = 'http://localhost:8080'; // Lien vers ton serveur Spring Boot

export const login = async (email, password) => {
  return await axios.post(`${API_URL}/login`, { email, password });
};

export const register = async (user) => {
  return await axios.post(`${API_URL}/register`, user);
};

//