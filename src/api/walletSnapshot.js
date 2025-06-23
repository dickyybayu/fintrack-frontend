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

export const getWalletSnapshots = () => axios.get(`${API}/wallets/snapshots`, getAuthConfig());