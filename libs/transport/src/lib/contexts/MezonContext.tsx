import React, { useCallback } from 'react';
import { CreateNakamaClientOptions, createClient as createNakamaClient } from '../nakama';
import { Client, Session } from '@heroiclabs/nakama-js';
import { DeviceUUID } from "device-uuid";

type MezonContextProviderProps = {
    children: React.ReactNode
    nakama: CreateNakamaClientOptions
    connect?: boolean
}

export type MezonContextValue = {
    client?: Client | null
    session?: Session | null
    createClient: () => Promise<Client>
    authenticateEmail: (email: string, password: string) => Promise<Session>
    authenticateDevice: (username: string) => Promise<Session>
}

const MezonContext = React.createContext<MezonContextValue>({} as MezonContextValue);

const MezonContextProvider: React.FC<MezonContextProviderProps> = ({ children, nakama, connect }) => {
    const [client, setClient] = React.useState<Client|null>(null);
    const [session, setSession] = React.useState<Session|null>(null);

    const createClient = useCallback(async () => {
        const client = await createNakamaClient(nakama);
        setClient(client);
        return client;
    }, [nakama]);

    const authenticateEmail = useCallback(async (email: string, password: string) => {
        if (!client) {
            throw new Error('Nakama client not initialized');
        }

        const session = await client.authenticateEmail(email, password);
        setSession(session);

        return session;
    }, [client]);

    const authenticateDevice = useCallback(async (username: string) => {

        if (!client) {
            throw new Error('Nakama client not initialized');
        }

        const deviceId = new DeviceUUID().get();

        const session = await client
          .authenticateDevice(deviceId, true, username)
          setSession(session);
            return session;
    }, [client]);

    const value = React.useMemo<MezonContextValue>(() => ({
        client,
        session,
        createClient,
        authenticateDevice,
        authenticateEmail,
    }), [
        client,
        session,
        createClient,
        authenticateDevice,
        authenticateEmail,
    ]);

    React.useEffect(() => {
        if (connect) {
            createClient();
        }
    }, [connect, createClient]);

    return (
        <MezonContext.Provider value={value}>
            {children}
        </MezonContext.Provider>
    );
}

export { MezonContext, MezonContextProvider };