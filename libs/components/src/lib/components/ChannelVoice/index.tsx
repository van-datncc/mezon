import { JitsiMeeting } from '@mezon/mezon-voice-react-sdk';


export type ChannelVoiceProps = {
	clanName?: string;
	channelLabel: string;
    userName: string;
};

function ChannelVoice({ clanName, channelLabel, userName }: ChannelVoiceProps) {	

    const handleReadyToClose = () => {
        console.log('Ready to close...');
    };

    const generateRoomName = () => clanName+"/"+channelLabel;

	const handleApiReady = (externalApi : any) => {
		console.log("externalApi", externalApi);
	}

	const handleJitsiIFrameRef1 = () => {
		console.log("handleJitsiIFrameRef1");
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
        <>
            <h1 style = {{
                fontFamily: 'sans-serif',
                textAlign: 'center'
            }}>
                Voice Channel App
            </h1>
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
                getIFrameRef = { (iframeRef) => { iframeRef.style.height = '400px'; } }
                onApiReady = { (externalApi: any) => handleApiReady(externalApi) }
                onReadyToClose = { handleReadyToClose } />
        </>
    );
}

export default ChannelVoice;
