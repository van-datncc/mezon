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
        document.getElementById('thumbnail-${activeIndex}')?.querySelector('.thumbnail').classList.add('active');
        document.getElementById('userAvatar').src = "${imageData.uploaderData.avatar}"
        document.getElementById('username').innerHTML  = "${imageData.uploaderData.name}"
        document.getElementById('timestamp').innerHTML  = "${time}"
      ${scriptThumnails(imageData.channelImagesData.images, activeIndex)}
  `);

	imageWindow.webContents.executeJavaScript(`
      document.addEventListener('keydown', (e) => {
		switch (e.key) {
			case 'ArrowUp':
        if(currentIndex > 0){
          document.querySelectorAll('.thumbnail').forEach(img => img.classList.remove('active'));
        currentIndex--;
        document.querySelectorAll('.thumbnail')[currentIndex].classList.add('active');
        document.querySelectorAll('.thumbnail')[currentIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
        selectedImage.src = document.querySelectorAll('.thumbnail')[currentIndex].src;
      
      }
				break;
			case 'ArrowLeft':
        if(currentIndex > 0){
          document.querySelectorAll('.thumbnail').forEach(img => img.classList.remove('active'));
        currentIndex--;
        document.querySelectorAll('.thumbnail')[currentIndex].classList.add('active');
        document.querySelectorAll('.thumbnail')[currentIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
        selectedImage.src = document.querySelectorAll('.thumbnail')[currentIndex].src;

      }
				break;
			case 'ArrowDown':
        if(currentIndex < ${imageData.channelImagesData.images.length} - 1){
          document.querySelectorAll('.thumbnail').forEach(img => img.classList.remove('active'));
        currentIndex++;
        document.querySelectorAll('.thumbnail')[currentIndex].classList.add('active');
        document.querySelectorAll('.thumbnail')[currentIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
        selectedImage.src = document.querySelectorAll('.thumbnail')[currentIndex].src;
        
      }
				break;
			case 'ArrowRight':
        if(currentIndex < ${imageData.channelImagesData.images.length} - 1){
          currentIndex++;
          document.querySelectorAll('.thumbnail').forEach(img => img.classList.remove('active'));
        document.querySelectorAll('.thumbnail')[currentIndex].classList.add('active');
        document.querySelectorAll('.thumbnail')[currentIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
        selectedImage.src = document.querySelectorAll('.thumbnail')[currentIndex].src;

      }
				break;
		}
	});
`);

	imageWindow.focus();
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
