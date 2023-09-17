import axios from 'axios';

const API_URL = 'http://localhost:8000/'

export const initializeWallet = async (name, balance) => {
    const res = await axios.post(`${API_URL}setup`, { name, balance });
    return res.data;
};

export const getWallet = async (id) => {
    const res = await axios.get(`${API_URL}wallet/${id}`);
    return res.data;
};

export const walletTransaction = async (id, amount, description, type) => {
    const res = await axios.post(`${API_URL}transact/${id}`, { amount, description, type });
    return res.data;
};

export const fetchTransaction = async (id) => {
    const res = await axios.get(`${API_URL}transactions`, { walletId: id });
    return res.data;
};