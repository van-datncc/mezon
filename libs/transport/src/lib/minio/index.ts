import * as minio from "minio";
import { UploadedObjectInfo } from "minio";
import { ResultCallback } from "minio/dist/main/internal/type";

let clientInstance: minio.Client;

export function getMinIoClient() {
	return clientInstance;
}

export function createMinIoClient() {
	const options = {
		endPoint: 'play.min.io',
		port: 9000,
		useSSL: true,
		accessKey: 'Q3AM3UQ867SPQQA43P2F',
		secretKey: 'zuf+tfteSlswRu7BJ86wekitnifILbZam1KYY3TG'
	}
	const client = new minio.Client(options);
	clientInstance = client;

	return client;
}

export function uploadImageToMinIO(bucket: string, name: string, 
		stream: Buffer,
		callback: ResultCallback<UploadedObjectInfo>) {
	if (!clientInstance) {
		createMinIoClient();
	}

	clientInstance.putObject(bucket, name, stream, callback);
}
