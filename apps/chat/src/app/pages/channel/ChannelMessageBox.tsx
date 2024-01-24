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
    const sessionUser = useSelector((state: RootState) => state.auth.session);
    const handleSend = useCallback(
        (mess: IMessagePayload) => {
            if (sessionUser) {
                const messageToSend: IMessage = {
                    ...mess,
                };
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