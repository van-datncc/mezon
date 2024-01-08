import {Client} from "@heroiclabs/nakama-js";

export type CreateNakamaClientOptions = {
    useSSL: boolean;
    host: string;
    port: string;
    key: string;

}

export function createClient(options: CreateNakamaClientOptions) {
    const {useSSL, host, port, key} = options;
    const client = new Client(key, host, port, useSSL);

    return client;
    
}