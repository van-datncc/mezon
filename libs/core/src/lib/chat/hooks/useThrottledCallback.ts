import { AnyToVoidFunction, Scheduler, throttle, throttleWith } from '@mezon/utils';
import { useCallback, useMemo } from 'react';

export default function useThrottledCallback<T extends AnyToVoidFunction>(fn: T, deps: any[], msOrSchedulerFn: number | Scheduler, noFirst = false) {
	const fnMemo = useCallback(fn, deps);

	return useMemo(() => {
		if (typeof msOrSchedulerFn === 'number') {
			return throttle(fnMemo, msOrSchedulerFn, !noFirst);
		} else {
			return throttleWith(msOrSchedulerFn, fnMemo);
		}
	}, [fnMemo, msOrSchedulerFn, noFirst]);
}
