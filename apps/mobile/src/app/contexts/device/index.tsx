import React, { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, NativeModules, Platform } from 'react-native';
import { DeviceContextType } from './types';

export const DeviceContext = createContext<DeviceContextType | null>(null);

export const DeviceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [isTabletLandscape, setIsTabletLandscape] = useState<boolean>(false);
	const isTabletRef = useRef<boolean | null>(null);
	const orientationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	const checkTablet = async (): Promise<boolean> => {
		// Cache tablet check result since device type doesn't change
		if (isTabletRef.current !== null) {
			return isTabletRef.current;
		}

		try {
			const isTablet = Platform.OS === 'ios' ? await NativeModules.DeviceUtilsIOS.isTablet() : await NativeModules.DeviceUtils.isTablet();
			isTabletRef.current = isTablet;
			return isTablet;
		} catch (error) {
			console.error('Error checking if device is a tablet:', error);
			isTabletRef.current = false;
			return false;
		}
	};

	const checkOrientation = useCallback(async () => {
		// Clear any pending orientation check
		if (orientationTimeoutRef.current) {
			clearTimeout(orientationTimeoutRef.current);
		}

		// Add small delay to allow dimensions to stabilize after rotation
		orientationTimeoutRef.current = setTimeout(async () => {
			try {
				const { width, height } = Dimensions.get('screen');
				const isLandscape = width > height;
				const isTablet = await checkTablet();

				const shouldBeTabletLandscape = isTablet && isLandscape;

				// Only update state if it actually changed to prevent unnecessary re-renders
				setIsTabletLandscape((prev) => {
					if (prev !== shouldBeTabletLandscape) {
						return shouldBeTabletLandscape;
					}
					return prev;
				});
			} catch (error) {
				console.error('Error in checkOrientation:', error);
			}
		}, 100); // 100ms delay to allow dimensions to stabilize
	}, []);

	useEffect(() => {
		checkOrientation();

		const subscription = Dimensions.addEventListener('change', checkOrientation);

		return () => {
			subscription?.remove();
			// Cleanup timeout on unmount
			if (orientationTimeoutRef.current) {
				clearTimeout(orientationTimeoutRef.current);
			}
		};
	}, [checkOrientation]);

	const value = useMemo(() => {
		return {
			isTabletLandscape
		};
	}, [isTabletLandscape]);

	return <DeviceContext.Provider value={value}>{children}</DeviceContext.Provider>;
};
