import { BrowserWindow } from 'electron';
import { ImageData, listThumnails, scriptThumnails } from './window_image';

function updateImagePopup(imageData: ImageData, imageWindow: BrowserWindow) {
	const activeIndex = imageData.channelImagesData.selectedImageIndex;
	const time = formatDateTime(imageData.create_time);
	imageWindow.webContents.executeJavaScript(`
      document.getElementById('channel-label').innerHTML = '${imageData.channelImagesData.channelLabel}';
    	document.getElementById('thumbnails-content').innerHTML = '${listThumnails(imageData.channelImagesData.images, activeIndex)}';
      selectedImage.src = '${imageData.url}';
        document.querySelectorAll('.thumbnail').forEach(img => img.classList.remove('active'));
        document.getElementById('thumbnail-${activeIndex}').querySelector('.thumbnail').classList.add('active');
        document.getElementById('userAvatar').src = "${imageData.uploaderData.avatar}"
        document.getElementById('username').innerHTML  = "${imageData.uploaderData.name}"
        document.getElementById('timestamp').innerHTML  = "${time}"
      ${scriptThumnails(imageData.channelImagesData.images, activeIndex)}
  `);
}

function formatDateTime(dateString) {
	const options = {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		hour12: false
	};
	return new Date(dateString).toLocaleString('vi-VN');
}
export default updateImagePopup;
