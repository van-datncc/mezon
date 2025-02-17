export const generateCodeVerifier = () => {
	const array = new Uint8Array(64);
	window.crypto.getRandomValues(array);
	return btoa(String.fromCharCode.apply(null, [...array]))
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
		.replace(/=/g, '');
};

export const generateCodeChallenge = async (verifier: string) => {
	const encoder = new TextEncoder();
	const data = encoder.encode(verifier);
	const digest = await window.crypto.subtle.digest('SHA-256', data);
	return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
		.replace(/=/g, '');
};
