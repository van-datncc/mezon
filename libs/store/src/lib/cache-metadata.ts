export interface CacheMetadata {
	lastFetched: number;
	expiresAt: number;
	isFirstLoad?: boolean;
	sessionId?: string;
}

export const DEFAULT_CACHE_TIME = 1000 * 60 * 60;

const apiCallTracker = new Map<string, boolean>();

export const isCacheValid = (cache?: CacheMetadata): boolean => {
	if (!cache) return false;
	return Date.now() < cache.expiresAt;
};

export const createCacheMetadata = (maxAge: number = DEFAULT_CACHE_TIME, isFirstLoad = false): CacheMetadata => {
	const now = Date.now();
	return {
		lastFetched: now,
		expiresAt: now + maxAge,
		isFirstLoad
	};
};

export const shouldRefreshCache = (cache?: CacheMetadata, bufferTime = 5000): boolean => {
	if (!cache) return true;
	return Date.now() + bufferTime >= cache.expiresAt;
};

export const getCacheAge = (cache?: CacheMetadata): number => {
	if (!cache) return Infinity;
	return Date.now() - cache.lastFetched;
};

export const getTimeUntilExpiry = (cache?: CacheMetadata): number => {
	if (!cache) return 0;
	return Math.max(0, cache.expiresAt - Date.now());
};

export const markApiFirstCalled = (key: string): void => {
	const fullKey = `${'cache'}_${key}`;
	apiCallTracker.set(fullKey, true);
};

export const isApiFirstCall = (key: string): boolean => {
	const fullKey = `${'cache'}_${key}`;
	if (apiCallTracker.has(fullKey)) {
		return false;
	}
	return true;
};

export const clearApiCallTracker = (key?: string): void => {
	if (key) {
		const fullKey = `${'cache'}_${key}`;
		apiCallTracker.delete(fullKey);
	} else {
		apiCallTracker.clear();
	}
};

export const shouldForceApiCall = (key: string, cache?: CacheMetadata, noCache = false): boolean => {
	if (noCache) return true;

	if (isApiFirstCall(key)) return true;

	return !isCacheValid(cache);
};

export const createApiKey = (apiName: string, ...params: (string | number)[]): string => {
	return `${apiName}_${params.join('_')}`;
};
