import React, { useCallback } from 'react';
import { CreateNakamaClientOptions, createClient as createNakamaClient } from '../nakama';
import { Client, Session, Socket } from '@heroiclabs/nakama-js';
import { DeviceUUID } from "device-uuid";

type MezonContextProviderProps = {
    children: React.ReactNode
    nakama: CreateNakamaClientOptions
    connect?: boolean
}

type Sessionlike = {
    token: string;
    refresh_token: string;
    created: boolean;
}

export type MezonContextValue = {
    clientRef: React.MutableRefObject<Client | null>
    sessionRef: React.MutableRefObject<Session | null>
    createClient: () => Promise<Client>
    authenticateEmail: (email: string, password: string) => Promise<Session>
    authenticateDevice: (username: string) => Promise<Session>
    authenticateGoogle: (token: string) => Promise<Session>
    refreshSession: (session: Sessionlike) => Promise<Session>
}

const MezonContext = React.createContext<MezonContextValue>({} as MezonContextValue);

const MezonContextProvider: React.FC<MezonContextProviderProps> = ({ children, nakama, connect }) => {

    const clientRef = React.useRef<Client | null>(null);
    const sessionRef = React.useRef<Session | null>(null);
    const socketRef = React.useRef<Socket | null>(null);

    const createClient = useCallback(async () => {
        const client = await createNakamaClient(nakama);
        clientRef.current = client;
        return client;
    }, [nakama]);

    const authenticateEmail = useCallback(async (email: string, password: string) => {
        if (!clientRef.current) {
            throw new Error('Nakama client not initialized');
        }
        const session = await clientRef.current.authenticateEmail(email, password, false);
        sessionRef.current = session;
        return session;
    }, [clientRef]);

    const authenticateGoogle = useCallback(async (token: string) => {
        if (!clientRef.current) {
            throw new Error('Nakama client not initialized');
        }
        const session = await clientRef.current.authenticateGoogle(token);
        sessionRef.current = session;
        return session;
    }, [clientRef]);

    const authenticateDevice = useCallback(async (username: string) => {

        if (!clientRef.current) {
            throw new Error('Nakama client not initialized');
        }

        const deviceId = new DeviceUUID().get();

        const session = await clientRef.current
            .authenticateDevice(deviceId, true, username)
        sessionRef.current = session;
        return session;
    }, [clientRef]);

    const refreshSession = useCallback(async (session: Sessionlike) => {
        if (!clientRef.current) {
            throw new Error('Nakama client not initialized');
        }
        const newSession = await clientRef.current.sessionRefresh(new Session(session.token, session.refresh_token, session.created));
        sessionRef.current = newSession;
        return newSession;
    }, [clientRef]);

    const createSocket = useCallback(async () => {
        if (!clientRef.current) {
            throw new Error('Nakama client not initialized');
        }
        const socket = clientRef.current.createSocket();
        socketRef.current = socket;
        return socket;
    }, [clientRef, socketRef]);

    const value = React.useMemo<MezonContextValue>(() => ({
        clientRef,
        sessionRef,
        createClient,
        authenticateDevice,
        authenticateEmail,
        authenticateGoogle,
        refreshSession,
        createSocket
    }), [
        clientRef,
        sessionRef,
        createClient,
        authenticateDevice,
        authenticateEmail,
        authenticateGoogle,
        refreshSession,
        createSocket
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

const MezonContextConsumer = MezonContext.Consumer;

export type MezonSuspenseProps = {
    children: React.ReactNode

}

const MezonSuspense: React.FC<MezonSuspenseProps> = ({ children }: MezonSuspenseProps) => {
    const { clientRef, sessionRef } = React.useContext(MezonContext);
    if (!clientRef.current || !sessionRef.current) {
        return <>Loading...</>;
    }
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <>{children}</>;
}

export { MezonContext, MezonContextProvider, MezonContextConsumer, MezonSuspense };