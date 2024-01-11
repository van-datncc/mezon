import {Client} from "@heroiclabs/nakama-js";

export type CreateNakamaClientOptions = {
    ssl: boolean;
    host: string;
    port: string;
    key: string;

}

export function createClient(options: CreateNakamaClientOptions) {
    const {ssl, host, port, key} = options;
    const client = new Client(key, host, port, ssl);

    return client;
    
}