import { JitsiMeeting } from '@mezon/mezon-voice-react-sdk';
import { useCallback, useState } from 'react';


export type ChannelVoiceProps = {
	clanName?: string;
	channelLabel: string;
    userName: string;
};

function ChannelVoice({ clanName, channelLabel, userName }: ChannelVoiceProps) {
    
    const handleReadyToClose = () => {
        console.log('Ready to close...');
    };

    const generateRoomName = () => {
        console.log("====channelLabel", clanName+"/"+channelLabel);
        return clanName+"/"+channelLabel;
    }

	const handleApiReady = (externalApi: any) => {
		console.log("externalApi", externalApi);
	}

    const handleIFrameRef = (iframeRef: any) => {
        iframeRef.style.height = "800px";
    }

    const renderSpinner = () => (
        <div style = {{
            fontFamily: 'sans-serif',
            textAlign: 'center'
        }}>
            Loading..
        </div>
    );


    return (
        <JitsiMeeting
            domain = { "meet.mezon.vn" }
            roomName = { generateRoomName() }
            spinner = { renderSpinner }
            lang = 'en'
            configOverwrite = {{
                startWithAudioMuted: true,
                disableModeratorIndicator: true,
                startScreenSharing: true,
                enableEmailInStats: false,
                prejoinPageEnabled: false
            }}
            interfaceConfigOverwrite = {{
                DISABLE_JOIN_LEAVE_NOTIFICATIONS: true
            }}
            userInfo = {{
                displayName: userName,
                email: ''
            }}                
            getIFrameRef = { handleIFrameRef }
            onApiReady = { (externalApi: any) => handleApiReady(externalApi) }
            onReadyToClose = { handleReadyToClose } />
    );
}

export default ChannelVoice;
