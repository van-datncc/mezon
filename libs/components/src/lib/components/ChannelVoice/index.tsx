import { JitsiMeeting } from '@mezon/mezon-voice-react-sdk';


export type ChannelVoiceProps = {
	clanId?: string;
	channelId: string;
};

function ChannelVoice({ clanId, channelId }: ChannelVoiceProps) {	

    const handleReadyToClose = () => {
        /* eslint-disable-next-line no-alert */
        alert('Ready to close...');
    };

    const generateRoomName = () => `JitsiMeetRoomNo${Math.random() * 100}-${Date.now()}`;

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
                JitsiMeeting Demo App
            </h1>
            <JitsiMeeting
                domain = { "meet.mezon.vn" }
                roomName = { generateRoomName() }
                spinner = { renderSpinner }
                configOverwrite = {{
                    subject: 'lalalala',
                    hideConferenceSubject: false
                }}
                lang = 'en'
                onApiReady = { (externalApi: any) => handleApiReady(externalApi) }
                onReadyToClose = { handleReadyToClose }
                getIFrameRef = { handleJitsiIFrameRef1 } />
        </>
    );
}

export default ChannelVoice;
