import * as minio from "minio";
import { UploadedObjectInfo } from "minio";
import { ItemBucketMetadata, ResultCallback } from "minio/dist/main/internal/type";

let clientInstance: minio.Client;

export function getMinIoClient() {
	return clientInstance;
}

export function createMinIoClient() {
	const options : minio.ClientOptions = {
		endPoint: process.env.NX_MINIO_CLIENT_HOST || '',
		port: parseInt(process.env.NX_MINIO_CLIENT_PORT || ''),
		useSSL: process.env.NX_MINIO_CLIENT_USESSL === 'true',
		accessKey: process.env.NX_MINIO_CLIENT_ACCESS_KEY || '',
		secretKey: process.env.NX_MINIO_CLIENT_SECRET_KEY || ''
	}
	const client = new minio.Client(options);
	clientInstance = client;

	return client;
}

export function uploadImageToMinIO(bucket: string, name: string, 
		stream: Buffer,
		size: number, 
		metaData: ItemBucketMetadata,
		callback: ResultCallback<UploadedObjectInfo>) {
	if (!clientInstance) {
		createMinIoClient();
	}

	clientInstance.putObject(bucket, name, stream, size, metaData, callback);
}
