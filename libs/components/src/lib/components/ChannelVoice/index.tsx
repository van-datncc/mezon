import { connectToMeetServer, createAndJoinRoom, createTracksAndAddToRoom } from "@mezon/transport";
import JitsiConnection from "@mezon/lib-jitsi-meet/dist/esm/JitsiConnection";
import JitsiMeetJS from "@mezon/lib-jitsi-meet/dist/esm/JitsiMeetJS";
import JitsiLocalTrack from "@mezon/lib-jitsi-meet/dist/esm/modules/RTC/JitsiLocalTrack";

export type ChannelVoiceProps = {
  clanName?: string;
  channelLabel: string;
  userName: string;
  jwt: string;
};

function ChannelVoice({ clanName, channelLabel, userName, jwt }: ChannelVoiceProps) { 
    let videoTracks: JitsiLocalTrack[];
    let audioTracks: JitsiLocalTrack[];
    function connect() {
        const roomName = clanName+"/"+channelLabel;
        connectToMeetServer(roomName).then((connection) => {
            return createAndJoinRoom(connection as JitsiConnection, roomName);
        })
        .then(room => {
            room.on(JitsiMeetJS.events.conference.TRACK_ADDED, track => addTrack(track));
            createTracksAndAddToRoom(room);
        })
        .catch(error => console.error(error));
    }

    function addTrack(track: JitsiLocalTrack) {
        if (track.getType() === 'video') {
            videoTracks.push(track);
        } else if (track.getType() === 'audio') {
            audioTracks.push(track);
        } 
    }

    connect();

    return (
        <div className="space-y-2 px-4 mb-4 mt-[250px]" >            
          
        </div>
    ); 
}

export default ChannelVoice;
