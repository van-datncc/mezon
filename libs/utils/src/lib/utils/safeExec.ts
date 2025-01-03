import { AnyFunction, NoneToVoidFunction } from '../types';
import { handleError } from './handleError';

const SAFE_EXEC_ENABLED = true;

export default function safeExec<F extends AnyFunction>(
	cb: F,
	rescue?: (err: Error) => void,
	always?: NoneToVoidFunction
): ReturnType<F> | undefined {
	if (!SAFE_EXEC_ENABLED) {
		return cb();
	}

	try {
		return cb();
	} catch (err: any) {
		rescue?.(err);
		handleError(err);
		return undefined;
	} finally {
		always?.();
	}
}
