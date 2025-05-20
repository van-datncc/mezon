import axios from 'axios';

const API_BASE_URL = process.env.NX_API_URL || 'https://api.mezon.app';

const apiClient = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		'Content-Type': 'application/json'
	}
});

export const clanAPI = {
	getClans: async (params?: { category?: string; search?: string }) => {
		try {
			const response = await apiClient.get('/clans', { params });
			return response.data;
		} catch (error) {
			console.error('Error fetching clans:', error);
			throw error;
		}
	},

	getClanById: async (clanId: string) => {
		try {
			const response = await apiClient.get(`/clans/${clanId}`);
			return response.data;
		} catch (error) {
			console.error(`Error fetching clan ${clanId}:`, error);
			throw error;
		}
	}
};
