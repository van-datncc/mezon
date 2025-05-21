import { useMemo } from 'react';

interface UsePaginationProps {
	currentPage: number;
	totalPages: number;
	maxPageNumbers?: number;
}

export function usePagination({ currentPage, totalPages, maxPageNumbers = 5 }: UsePaginationProps) {
	const pageNumbers = useMemo(() => {
		const numbers: (number | 'ellipsis')[] = [];

		if (totalPages <= maxPageNumbers) {
			for (let i = 1; i <= totalPages; i++) {
				numbers.push(i);
			}
		} else {
			if (currentPage <= 3) {
				for (let i = 1; i <= 4; i++) {
					numbers.push(i);
				}
				numbers.push('ellipsis');
				numbers.push(totalPages);
			} else if (currentPage >= totalPages - 2) {
				numbers.push(1);
				numbers.push('ellipsis');
				for (let i = totalPages - 3; i <= totalPages; i++) {
					numbers.push(i);
				}
			} else {
				numbers.push(1);
				numbers.push('ellipsis');
				numbers.push(currentPage - 1);
				numbers.push(currentPage);
				numbers.push(currentPage + 1);
				numbers.push('ellipsis');
				numbers.push(totalPages);
			}
		}

		return numbers;
	}, [currentPage, totalPages, maxPageNumbers]);

	return {
		pageNumbers,
		isFirstPage: currentPage === 1,
		isLastPage: currentPage === totalPages
	};
}
