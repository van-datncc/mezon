import React from 'react';
import type { PDFStatusBarProps } from './types';

export const PDFStatusBar: React.FC<PDFStatusBarProps> = ({ filename }) => (
	<div className="px-4 py-2 border-t border-gray-200 dark:border-[#202225] bg-gray-50 dark:bg-[#2f3136] text-xs text-gray-500 dark:text-[#b9bbbe]">
		<div className="flex justify-between items-center">
			<span>Use keyboard shortcuts: ← → for navigation, Ctrl+/- for zoom</span>
			<span>{filename}</span>
		</div>
	</div>
);
