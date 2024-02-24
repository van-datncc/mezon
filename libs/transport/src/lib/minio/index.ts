import * as minio from "minio";
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

export function uploadImageToMinIO(bucket: string, name: string, callback: ResultCallback<string>) {
	if (!clientInstance) {
		createMinIoClient();
	}
	clientInstance.presignedPutObject(bucket, name, callback)
}
