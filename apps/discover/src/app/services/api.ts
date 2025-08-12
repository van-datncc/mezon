const API_BASE_URL = `https://${process.env.NX_CHAT_APP_API_GW_HOST}` || 'https://api.mezon.ai';

export interface Category {
	id: string;
	name: string;
	count: number;
	type: number;
	icon: string;
	gradient: string;
}

export interface ApiCategoryResponse {
	id: string;
	name: string;
	count: number;
	type: number; 
}

const handleResponse = async (response: Response) => {
	if (!response.ok) {
		const error = await response.json().catch(() => ({}));
		throw new Error(error.message || 'Something went wrong');
	}
	return response.json();
};

export const clanAPI = {
	getClans: async (params?: { category?: string; search?: string }) => {
		try {
			const queryParams = new URLSearchParams();
			if (params?.category) queryParams.append('category', params.category);
			if (params?.search) queryParams.append('search', params.search);

			const response = await fetch(`${API_BASE_URL}/clans?${queryParams.toString()}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			return handleResponse(response);
		} catch (error) {
			console.error('Error fetching clans:', error);
			throw error;
		}
	},

	getClanById: async (clanId: string) => {
		try {
			const response = await fetch(`${API_BASE_URL}/clans/${clanId}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			return handleResponse(response);
		} catch (error) {
			console.error(`Error fetching clan ${clanId}:`, error);
			throw error;
		}
	},

	getCategories: async (): Promise<ApiCategoryResponse[]> => {
		try {
			const response = await fetch(`${API_BASE_URL}/categories`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			const data = await handleResponse(response);
			
			return data;
		} catch (error) {
			console.error('Error fetching categories:', error);
			return [];
		}
	}
};
