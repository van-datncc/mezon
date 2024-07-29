import { useMemo } from 'react';

const useIsWithinBackticks = (text: string) => {
	const singleBacktickPattern = /`/g;
	const tripleBacktickPattern = /```/g;

	const backticksPositions = useMemo(() => {
		const positions = {
			single: [] as number[],
			triple: [] as number[],
		};

		let match: RegExpExecArray | null;
		while ((match = singleBacktickPattern.exec(text)) !== null) {
			positions.single.push(match.index);
		}
		while ((match = tripleBacktickPattern.exec(text)) !== null) {
			positions.triple.push(match.index);
		}

		return positions;
	}, [text]);

	const isWithinBackticks = (index: number): boolean => {
		const singleCountBefore = backticksPositions.single.filter((pos) => pos < index).length;
		const singleCountAfter = backticksPositions.single.filter((pos) => pos > index).length;
		const tripleCountBefore = backticksPositions.triple.filter((pos) => pos < index).length;
		const tripleCountAfter = backticksPositions.triple.filter((pos) => pos > index).length;

		return singleCountBefore % 2 !== 0 || singleCountAfter % 2 !== 0 || tripleCountBefore % 2 !== 0 || tripleCountAfter % 2 !== 0;
	};

	return isWithinBackticks;
};

export default useIsWithinBackticks;
