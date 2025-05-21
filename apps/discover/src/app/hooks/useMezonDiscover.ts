import { useEffect, useState } from 'react';

export const useMezonDiscover = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const initializeMezon = async () => {
			try {
				setIsLoading(false);
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Failed to initialize Mezon');
				setIsLoading(false);
			}
		};

		initializeMezon();
	}, []);

	return {
		isLoading,
		error
	};
};
