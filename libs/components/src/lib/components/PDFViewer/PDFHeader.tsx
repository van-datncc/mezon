import React from 'react';
import { CloseIcon } from './icons';
import type { PDFHeaderProps } from './types';

export const PDFHeader: React.FC<PDFHeaderProps> = ({ filename, onClose }) => (
	<div className="flex items-center justify-between px-4 border-b border-gray-200 dark:border-[#202225] bg-gray-50 dark:bg-[#2f3136] rounded-t-lg">
		<h3 className="text-lg font-semibold truncate text-gray-900 dark:text-[#dcddde]">{filename}</h3>
		<button
			onClick={onClose}
			className="p-2 rounded-full transition-colors duration-200 text-gray-600 dark:text-[#b9bbbe] hover:bg-gray-200 dark:hover:bg-[#40444b]"
			title="Close (Esc)"
		>
			<CloseIcon className="w-5 h-5" />
		</button>
	</div>
);
