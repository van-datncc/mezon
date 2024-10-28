export const useIsDevelopmentMode = () => {
	try {
		return process.env.NODE_ENV === 'development';
	} catch (error) {
		return false;
	}
};
