import isElectron from 'is-electron';
import { FC, useCallback, useEffect, useState } from 'react';
import { pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { PDFContent } from './PDFContent';
import { PDFControls } from './PDFControls';
import { PDFHeader } from './PDFHeader';
import { PDFStatusBar } from './PDFStatusBar';
import type { PDFDocumentProxy, PDFViewerModalProps } from './types';

let pdfjsPath = '';
if (isElectron()) {
	const pathParts = window.location.pathname.split('/');
	const chatIndex = pathParts.findIndex((part) => part === 'chat');
	if (chatIndex !== -1) {
		const appPath = pathParts.slice(0, chatIndex + 1).join('/');
		pdfjsPath = `file://${appPath}/pdf.worker.min.mjs`;
	} else {
		pdfjsPath = 'file://' + window.location.pathname.replace(/\/index\.html.*$/, '/pdf.worker.min.mjs');
	}
} else {
	pdfjsPath = '/pdf.worker.min.mjs';
}

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsPath;

console.log(pdfjsPath, 'pdfjsPath');

export const PDFViewerModal: FC<PDFViewerModalProps> = ({ isOpen, onClose, pdfUrl, filename = 'Document.pdf' }) => {
	const [numPages, setNumPages] = useState<number>();
	const [pageNumber, setPageNumber] = useState<number>(1);
	const [scale, setScale] = useState<number>(1.0);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [containerRef, setContainerRef] = useState<HTMLElement | null>(null);
	const [containerWidth, setContainerWidth] = useState<number>();

	useEffect(() => {
		if (!containerRef) return;

		const resizeObserver = new ResizeObserver((entries) => {
			const [entry] = entries;
			if (entry) {
				setContainerWidth(entry.contentRect.width);
			}
		});

		resizeObserver.observe(containerRef);

		return () => {
			resizeObserver.disconnect();
		};
	}, [containerRef]);

	const onDocumentLoadSuccess = useCallback(({ numPages: nextNumPages }: PDFDocumentProxy) => {
		setNumPages(nextNumPages);
		setLoading(false);
		setError(null);
	}, []);

	const onDocumentLoadError = useCallback((error: Error) => {
		setError('Failed to load PDF document');
		setLoading(false);
		console.error('PDF Load Error:', error);
	}, []);

	const goToPrevPage = (): void => {
		setPageNumber((prev) => Math.max(prev - 1, 1));
	};

	const goToNextPage = (): void => {
		setPageNumber((prev) => Math.min(prev + 1, numPages || 1));
	};

	const zoomIn = (): void => {
		setScale((prev) => Math.min(prev + 0.2, 3.0));
	};

	const zoomOut = (): void => {
		setScale((prev) => Math.max(prev - 0.2, 0.5));
	};

	const resetZoom = (): void => {
		setScale(1.0);
	};

	const handleKeyDown = useCallback(
		(event: KeyboardEvent) => {
			if (!isOpen) return;

			switch (event.key) {
				case 'Escape':
					onClose();
					break;
				case 'ArrowLeft':
					setPageNumber((prev) => Math.max(prev - 1, 1));
					break;
				case 'ArrowRight':
					setPageNumber((prev) => Math.min(prev + 1, numPages || 1));
					break;
				case '=':
				case '+':
					if (event.ctrlKey || event.metaKey) {
						event.preventDefault();
						setScale((prev) => Math.min(prev + 0.2, 3.0));
					}
					break;
				case '-':
					if (event.ctrlKey || event.metaKey) {
						event.preventDefault();
						setScale((prev) => Math.max(prev - 0.2, 0.5));
					}
					break;
				case '0':
					if (event.ctrlKey || event.metaKey) {
						event.preventDefault();
						setScale(1.0);
					}
					break;
			}
		},
		[isOpen, onClose, numPages]
	);

	useEffect(() => {
		document.addEventListener('keydown', handleKeyDown);
		return () => document.removeEventListener('keydown', handleKeyDown);
	}, [handleKeyDown]);

	useEffect(() => {
		if (isOpen) {
			setPageNumber(1);
			setScale(1.0);
			setError(null);
		}
	}, [isOpen]);

	if (!isOpen) return null;

	return (
		<div
			className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50"
			onClick={(e) => e.target === e.currentTarget && onClose()}
		>
			<div className="relative w-[95vw] h-[95vh] max-w-6xl bg-white dark:bg-[#36393f] rounded-lg shadow-xl flex flex-col">
				<PDFHeader filename={filename} onClose={onClose} />

				<PDFControls
					pageNumber={pageNumber}
					numPages={numPages}
					scale={scale}
					onPrevPage={goToPrevPage}
					onNextPage={goToNextPage}
					onZoomIn={zoomIn}
					onZoomOut={zoomOut}
					onResetZoom={resetZoom}
				/>

				<PDFContent
					pdfUrl={pdfUrl}
					pageNumber={pageNumber}
					scale={scale}
					loading={loading}
					error={error}
					containerWidth={containerWidth}
					onDocumentLoadSuccess={onDocumentLoadSuccess}
					onDocumentLoadError={onDocumentLoadError}
					onContainerRef={setContainerRef}
				/>

				{!loading && !error && <PDFStatusBar filename={filename} />}
			</div>
		</div>
	);
};
