export const customTheme = (hiddenNextPage: boolean) => {
	if (hiddenNextPage) {
		return {
			pages: {
				base: '[&_li:is(:first-child,:last-child)]:hidden px-4 flex gap-2 justify-end',
				selector: {
					base: 'w-5 h-5 rounded-full overflow-hidden text-[12px] flex items-center justify-center bg-gray-700',
					active: '!bg-white !text-black',
					disabled: 'cursor-not-allowed opacity-50 bg-cyan-50 hover:bg-cyan-100'
				},
				previous: {
					base: '!h-5 !w-5 overflow-hidden flex items-center  justify-center text-white',
					icon: 'h-5 w-5'
				},
				next: {
					base: '!h-5 !w-5 overflow-hidden flex items-center  justify-center text-white',
					icon: 'h-5 w-5'
				}
			}
		};
	}
	return {
		pages: {
			base: ' flex gap-2 px-4 justify-end',
			selector: {
				base: 'w-5 h-5 rounded-full overflow-hidden text-[12px] flex items-center justify-center bg-gray-700',
				active: '!bg-white !text-black',
				disabled: 'cursor-not-allowed opacity-50 bg-cyan-50 hover:bg-cyan-100'
			},
			previous: {
				base: '!h-5 !w-5 overflow-hidden flex items-center  justify-center text-white',
				icon: 'h-5 w-5'
			},
			next: {
				base: '!h-5 !w-5 overflow-hidden flex items-center  justify-center text-white',
				icon: 'h-5 w-5'
			}
		}
	};
};
