import {Client} from "@mezon/mezon-js";

export type CreateNakamaClientOptions = {
    ssl: boolean;
    host: string;
    port: string;
    key: string;

}

let clientInstance: Client;

export function getClient() {
    return clientInstance;
}

export function createClient(options: CreateNakamaClientOptions) {
    const {ssl, host, port, key} = options;
    const client = new Client(key, host, port, ssl);

    clientInstance = client;
    
    return client;
    
}