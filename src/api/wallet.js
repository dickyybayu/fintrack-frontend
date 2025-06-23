import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const getAuthConfig = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getWallets = () => axios.get(`${API}/wallets`, getAuthConfig());
export const addWallet = (data) => axios.post(`${API}/wallets`, data, getAuthConfig());
export const deleteWallet = (id) => axios.delete(`${API}/wallets/${id}`, getAuthConfig());
export const updateWallet = (id, data) => axios.put(`${API}/wallets/${id}`, data, getAuthConfig());