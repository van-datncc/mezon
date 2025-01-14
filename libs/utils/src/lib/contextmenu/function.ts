export const convertImageToBlobFile = async (urlData: string): Promise<Blob | null> => {
	try {
		const response = await fetch(urlData);
		const blob = await response.blob();
		return blob;
	} catch (error) {
		console.error('Error converting image to blob:', error);
		return null;
	}
};

export const handleCopyImage = async (urlData: string) => {
	try {
		const blob = await convertImageToBlobFile(urlData);
		if (!blob) {
			console.error('Failed to fetch or convert image');
			return;
		}
		const fileName = urlData.split('/').pop() || 'image';
		const fileType = urlData.split('.').pop() || 'png';
		const file = new File([blob], fileName, { type: `image/${fileType}` });
		if (navigator.clipboard && navigator.clipboard.write) {
			try {
				const clipboardItem = new ClipboardItem({ [`image/${fileType}`]: file });
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

export const handleSaveImage = (urlData: string) => {
	fetch(urlData)
		.then((response) => response.blob())
		.then((blob) => {
			const fileName = urlData.split('/').pop() || 'image.png';
			const url = window.URL.createObjectURL(new Blob([blob]));
			const a = document.createElement('a');
			a.href = url;
			a.download = fileName;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			window.URL.revokeObjectURL(url);
		})
		.catch((error) => console.error('Error downloading image:', error));
};

export const handleCopyLink = (urlData: string) => {
	if (navigator.clipboard) {
		navigator.clipboard.writeText(urlData).catch((error) => {
			console.error('Failed to copy link:', error);
		});
	} else {
		console.warn('Clipboard API not supported. Link not copied.');
	}
};

export const handleOpenLink = (urlData: string) => {
	window.open(urlData, '_blank');
};
