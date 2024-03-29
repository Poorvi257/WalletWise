import axios from 'axios';

const API_URL = 'http://65.1.100.208:8000/'

export const initializeWallet = async (name, balance) => {
const res = await axios.post(`${API_URL}setup`, { name, balance });
    return res;
};

export const getWallet = async (id) => {
    const res = await axios.get(`${API_URL}wallet/${id}`);
    return res.data;
};

export const walletTransaction = async (id, transactionId, amount, description, type) => {
    const res = await axios.post(`${API_URL}transact/${id}`, { transactionId, amount, description, type });
    return res.data;
};

export const fetchTransaction = async (id) => {
    const res = await axios.get(`${API_URL}transactions`, { walletId: id });
    return res.data;
};