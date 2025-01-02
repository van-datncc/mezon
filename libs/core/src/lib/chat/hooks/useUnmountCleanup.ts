import { NoneToVoidFunction } from '@mezon/utils';
import { useEffect } from 'react';

export function useUnmountCleanup(cleanup: NoneToVoidFunction) {
	useEffect(() => {
		return () => {
			cleanup();
		};
	}, []);
}
