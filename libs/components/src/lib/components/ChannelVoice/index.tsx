
import JitsiMeetJS from '@mezon/lib-jitsi-meet/dist/esm/JitsiMeetJS'

export type ChannelVoiceProps = {
	clanName?: string;
	channelLabel: string;
    userName: string;
    jwt: string;
};

function ChannelVoice({ clanName, channelLabel, userName, jwt }: ChannelVoiceProps) {    

    const options = {
        hosts: {
          domain: 'meet.mezon.vn',
          muc: 'conference.meet.mezon.vn', // MUC domain
        },
        serviceUrl: 'https://meet.mezon.vn/http-bind', // BOSH server
      };

    const initJitsi = () => {
        const connection = new JitsiMeetJS.JitsiConnection("mezon", "token", options);
      
        connection.addEventListener(
          JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED,
          onConnectionSuccess
        );
        connection.addEventListener(
          JitsiMeetJS.events.connection.CONNECTION_FAILED,
          onConnectionFailed
        );
        connection.addEventListener(
          JitsiMeetJS.events.connection.CONNECTION_DISCONNECTED,
          disconnect
        );
      
        connection.connect(options);
    };
    
    const onConnectionSuccess = () => {
        console.log('Connection Established Successfully!');
    };
    
    const onConnectionFailed = () => {
        console.error('Connection Failed!');
    };
    
    const disconnect = () => {
        console.log('Disconnected!');
    };

    initJitsi()

    return (
        <div className="space-y-2 px-4 mb-4 mt-[250px]" >            
            
        </div>
    ); 
}

export default ChannelVoice;
