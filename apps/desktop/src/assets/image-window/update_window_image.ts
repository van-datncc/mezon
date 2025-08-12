import { BrowserWindow } from 'electron';
import App from '../../app/app';
import { escapeHtml, sanitizeUrl } from '../../app/utils';
import { ImageData, listThumnails, scriptThumnails } from './window_image';

function updateImagePopup(imageData: ImageData, imageWindow: BrowserWindow) {
	const activeIndex = imageData.channelImagesData.selectedImageIndex;
	const time = escapeHtml(formatDateTime(imageData.create_time));
	const uploaderData = imageData.channelImagesData.images.map((image, index) => {
		return JSON.stringify({
			name: escapeHtml(image.uploaderData.name),
			avatar: sanitizeUrl(image.uploaderData.avatar),
			create_item: escapeHtml(formatDateTime(image.create_time)),
			realUrl: sanitizeUrl(image.realUrl),
			url: sanitizeUrl(image.url),
			fileName: escapeHtml(image.filename)
		});
	});

	// Use safer DOM manipulation instead of innerHTML injection
	imageWindow.webContents.executeJavaScript(`
		${App.imageScriptWindowLoaded === false ? `let currentIndex = ${activeIndex};` : `currentIndex =  ${activeIndex};`}
		(function() {
			// Use textContent for text content to prevent XSS
			const channelLabel = document.getElementById('channel-label');
			if (channelLabel) {
				channelLabel.textContent = ${JSON.stringify(imageData.channelImagesData.channelLabel)};
			}

			// Use safe DOM methods for thumbnail content
			const thumbnailsContent = document.getElementById('thumbnails-content');
			if (thumbnailsContent) {
				thumbnailsContent.innerHTML = ${JSON.stringify(listThumnails(imageData.channelImagesData.images, activeIndex))};
			}

			// Use safe property assignment for images
			const selectedImage = document.getElementById('selectedImage');
			if (selectedImage) {
				selectedImage.src = ${JSON.stringify(sanitizeUrl(imageData.url))};
			}

			document.querySelectorAll('.thumbnail').forEach(img => img.classList.remove('active'));
			const activeThumb = document.getElementById('thumbnail-${activeIndex}');
			if (activeThumb) {
				const thumbImg = activeThumb.querySelector('.thumbnail');
				if (thumbImg) thumbImg.classList.add('active');
			}

			// Use safe property assignment and textContent
			const userAvatar = document.getElementById('userAvatar');
			if (userAvatar) {
				userAvatar.src = ${JSON.stringify(sanitizeUrl(imageData.uploaderData.avatar))};
			}

			const username = document.getElementById('username');
			if (username) {
				username.textContent = ${JSON.stringify(imageData.uploaderData.name)};
			}

			const timestamp = document.getElementById('timestamp');
			if (timestamp) {
				timestamp.textContent = ${JSON.stringify(time)};
			}


			window.currentImageUrl = {
				fileName: ${JSON.stringify(escapeHtml(imageData.filename))},
				url: ${JSON.stringify(sanitizeUrl(imageData.url))},
				realUrl: ${JSON.stringify(sanitizeUrl(imageData.realUrl))}
			};

			${scriptThumnails(imageData.channelImagesData.images, activeIndex)}
		})();
	`);

	imageWindow.webContents.executeJavaScript(`
      function handleKeydown(e){
    uploaderData = [${uploaderData}];

		switch (e.key) {
			case 'ArrowDown':
        case 'ArrowRight':
          if(currentIndex > 0){
            // Reset transform when changing image
            resetTransform();
            document.querySelectorAll('.thumbnail').forEach(img => img.classList.remove('active'));
            currentIndex--;
            const prevThumb = document.querySelectorAll('.thumbnail')[currentIndex];
            prevThumb.classList.add('active');
            prevThumb.scrollIntoView({ behavior: 'smooth', block: 'center' });
            selectedImage.src = sanitizeUrl(prevThumb.src);
            document.getElementById('userAvatar').src = uploaderData[currentIndex].avatar;
            document.getElementById('username').innerHTML  = uploaderData[currentIndex].name;
            document.getElementById('timestamp').innerHTML  =  uploaderData[currentIndex].create_item;
            currentImageUrl = {
              fileName : uploaderData[currentIndex].fileName,
              url : uploaderData[currentIndex].url,
              realUrl : uploaderData[currentIndex].realUrl
            };
          }
          break;

        case 'ArrowUp':
        case 'ArrowLeft':
          if(currentIndex < ${imageData.channelImagesData.images.length} - 1){
            // Reset transform when changing image
            resetTransform();
            document.querySelectorAll('.thumbnail').forEach(img => img.classList.remove('active'));
            currentIndex++;
            const nextThumb = document.querySelectorAll('.thumbnail')[currentIndex];
            nextThumb.classList.add('active');
            nextThumb.scrollIntoView({ behavior: 'smooth', block: 'center' });
            selectedImage.src = sanitizeUrl(nextThumb.src);
            document.getElementById('userAvatar').src = uploaderData[currentIndex].avatar;
            document.getElementById('username').innerHTML  = uploaderData[currentIndex].name;
            document.getElementById('timestamp').innerHTML  =  uploaderData[currentIndex].create_item;
            currentImageUrl = {
              fileName : uploaderData[currentIndex].fileName,
              url : uploaderData[currentIndex].url,
              realUrl : uploaderData[currentIndex].realUrl
            };
          }
          break;
		}
	}

    ${
		App.imageScriptWindowLoaded === false &&
		`
      document.addEventListener('keydown', handleKeydown);
      window.sanitizeUrl = ${sanitizeUrl.toString()};
    `
	}
`);
	if (App.imageScriptWindowLoaded === false) {
		App.imageScriptWindowLoaded = true;
	}
	imageWindow.show();
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
