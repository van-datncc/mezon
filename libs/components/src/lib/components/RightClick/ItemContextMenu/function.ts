const convertImageToBlobFile = async (urlData: string): Promise<Blob | null> => {
	try {
		const response = await fetch(urlData);
		const blob = await response.blob();
		return blob;
	} catch (error) {
		console.error('Error converting image to blob:', error);
		return null;
	}
};

const handleCopyImage = async (urlData: string) => {
	try {
		const blob = await convertImageToBlobFile(urlData);
		if (!blob) {
			console.error('Failed to fetch or convert image');
			return;
		}

		const file = new File([blob], 'image.png', { type: 'image/png' });
		if (navigator.clipboard && navigator.clipboard.write) {
			try {
				const clipboardItem = new ClipboardItem({ 'image/png': file });
				await navigator.clipboard.write([clipboardItem]);
			} catch (error) {
				console.error('Failed to write image to clipboard:', error);
			}
		} else {
			console.warn('Clipboard API not supported. Image data not copied.');
		}
	} catch (error) {
		console.error('Error fetching or converting image:', error);
	}
};

const handleSaveImage = (urlData: string) => {
	const a = document.createElement('a');
	a.href = urlData;
	a.download = 'image.png';
	a.click();
};

const handleCopyLink = (urlData: string) => {
	if (navigator.clipboard) {
		navigator.clipboard.writeText(urlData).catch((error) => {
			console.error('Failed to copy link:', error);
		});
	} else {
		console.warn('Clipboard API not supported. Link not copied.');
	}
};

const handleOpenLink = (urlData: string) => {
	window.open(urlData, '_blank');
};

export { convertImageToBlobFile, handleCopyImage, handleCopyLink, handleOpenLink, handleSaveImage };
