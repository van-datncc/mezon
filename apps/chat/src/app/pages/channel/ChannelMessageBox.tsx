import { MessageBox, IMessagePayload } from '@mezon/components';
import { useChat } from '@mezon/core';
import { RootState } from '@mezon/store';
import { IMessage } from '@mezon/utils';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Client, Session } from '@heroiclabs/nakama-js';
import { useParams } from 'react-router-dom';
import { DeviceUUID } from "device-uuid";

export function ChannelMessageBox() {
    const { sendMessage } = useChat();
    // const { channelId: channelIdParam } = useParams();
    // const { serverId: serverIdParams } = useParams();
    const sessionUser = useSelector((state: RootState) => state.auth.session);
    // const [mess, setMess] = useState("")

    // const randomUserId = new DeviceUUID().get();

    // useEffect(() => {
    //     var useSSL = false; // Enable if server is run with an SSL certificate.
    //     var client = new Client(
    //         'defaultkey',
    //         '172.16.11.90',
    //         '7350',
    //         useSSL,
    //     );
    //     client.authenticateDevice(
    //         randomUserId,
    //         true,
    //         "mycustomusername",
    //     )
    //         .then((session) => {
    //             console.info("Successfully authenticated:", session);
    //             const socket = client.createSocket(useSSL, false);
    //             socket.connect(session, true).then((session) => {
    //                 socket.onchannelmessage = (message) => {
    //                 }
    //                 console.log('connected');
    //                 socket
    //                     .joinChat(
    //                         channelIdParam ?? '',
    //                         'general',
    //                         1,
    //                         true,
    //                         false,
    //                     )
    //                     .then((response) => {
    //                         console.log('You can now send message to channel id ', response);
    //                     });
    //                 // socket
    //                 //     .writeChatMessage(serverIdParams ?? '', "14042e37-a425-4384-b38c-3f8995983b80", {
    //                 //         data: mess,
    //                 //     })
    //                 //     .then((response) => {
    //                 //         console.log('send message', response);
    //                 //     });
    //             });
    //         })
    //         .catch((error) => {
    //             console.log("error : ", error);
    //         });

    //     // const newSession = new Session(
    //     //     session?.token ?? '',
    //     //     session?.refresh_token ?? '',
    //     //     true,
    //     // );

    // }, []);

    const handleSend = useCallback(
        (mess: IMessagePayload) => {
            if (sessionUser) {
                const messageToSend: IMessage = {
                    ...mess,
                };
                // setMess(mess?.content?.content ?? "")
                sendMessage(messageToSend);
            } else {
                console.error('Session is not available');
            }
        },
        [sendMessage, sessionUser],
    );

    return (
        <div>
            <MessageBox onSend={handleSend} />
        </div>
    );
}