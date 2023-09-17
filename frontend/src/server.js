import axios from 'axios';

const API_URL = 'http://localhost:8000/'

export const initializeWallet = async (name, balance) => {
  const res = await axios.post(`${API_URL}setup`, { name, balance });
  return res.data;
};

