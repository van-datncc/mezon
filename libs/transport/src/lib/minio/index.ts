import { DraftHandleValue } from "draft-js";
import { Session } from "vendors/mezon-js/packages/mezon-js/dist";
import { ApiMessageAttachment } from "vendors/mezon-js/packages/mezon-js/dist/api.gen";
import { Client } from "vendors/mezon-js/packages/mezon-js/dist/client";

const urlImageRegex = /^https?:\/\/.+\.(jpg|jpeg|png|webp|avif|gif|svg)$/g;

export function uploadImageToMinIO(url: string, stream: Buffer, size: number) {
	return fetch(url, { method: 'PUT', body: stream });
}

export function handleUploadFile(client: Client, session: Session, 
	fullfilename: string, file: File, 
	callback: (url: string, attachment: ApiMessageAttachment) => void) : DraftHandleValue {
	file?.arrayBuffer().then((buf) => {
		client.uploadAttachmentFile(session, {
			filename: fullfilename,
			filetype: file.type,
			size: file.size,
		}).then((data) => {
			if (!data || !data.url) {
				return 'not-handled';
			}
			// upload to minio
			uploadImageToMinIO(data.url, Buffer.from(buf), file.size).then((res) => {
				if (res.status !== 200) {
					return 'not-handled';
				}
				const url = 'https://cdn.mezon.vn/' + fullfilename;
				let fileTypeUpload = 'image';
					if (file.type.includes('pdf')) {
						fileTypeUpload = 'pdf';
					} else if (file.type.includes('text')) {
						fileTypeUpload = 'text';
					}
				callback(url, {
					filename: file.name,
					url: url,
					filetype: fileTypeUpload,
					size: file.size,
					width: 0,
					height: 0,
				});
								
				return 'handled';
			});
		});
	});

	return 'not-handled';
}

export function handleUrlInput(input: string, callback: (attachment: ApiMessageAttachment) => void) {
	// limit url within 128
	if (input.match(urlImageRegex) && input.length < 128) {
		try {
			fetch(input, {method: 'HEAD'}).then(response => {
				const contentSize = response.headers.get('content-length');
				const contentType = response.headers.get('content-type');
				if (contentType) {
					callback({
						filename: input,
						url: input,
						filetype: contentType,
						size: Number(contentSize),
						width: 0,
						height: 0,
					});
				}
			}).catch(e => {
				callback({});
			});
		} catch(e) {
			callback({});
		}
	}
}
