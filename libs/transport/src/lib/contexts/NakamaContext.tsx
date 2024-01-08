import React, { useCallback } from 'react';
import { CreateNakamaClientOptions, createClient as createNakamaClient } from '../nakama';
import { Client, Session } from '@heroiclabs/nakama-js';

type NakamaContextProviderProps = {
    children: React.ReactNode
    nakama: CreateNakamaClientOptions
}

export type NakamaContextValue = {
    client?: Client | null
    session?: Session | null
    createClient: () => Promise<Client>
    authenticateEmail: (email: string, password: string) => Promise<Session>
}

const NakamaContext = React.createContext<NakamaContextValue>({} as NakamaContextValue);

const NakamaContextProvider: React.FC<NakamaContextProviderProps> = ({ children, nakama }) => {
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

    const value = React.useMemo<NakamaContextValue>(() => ({
        client,
        session,
        createClient,
        authenticateEmail,
    }), [
        client,
        session,
        createClient,
        authenticateEmail,
    ]);

    return (
        <NakamaContext.Provider value={value}>
            {children}
        </NakamaContext.Provider>
    );
}

export { NakamaContext, NakamaContextProvider };