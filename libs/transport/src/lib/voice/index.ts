import JitsiConference from "@mezon/lib-jitsi-meet/dist/esm/JitsiConference";
import JitsiConnection from "@mezon/lib-jitsi-meet/dist/esm/JitsiConnection";
import JitsiMeetJS from "@mezon/lib-jitsi-meet/dist/esm/JitsiMeetJS";
import options from './options/config';
import { JitsiConferenceErrors } from "@mezon/lib-jitsi-meet/dist/esm/JitsiConferenceErrors";
import JitsiLocalTrack from "@mezon/lib-jitsi-meet/dist/esm/modules/RTC/JitsiLocalTrack";

export function createTracksAndAddToRoom(room: JitsiConference) {
    JitsiMeetJS.createLocalTracks({
        devices: ['video', 'audio']
    }).then((tracks) => {
        if (typeof(tracks) === typeof(JitsiConferenceErrors)) {
            console.log('err', tracks);
            return;
        }
        
        (tracks as JitsiLocalTrack[]).forEach((track: JitsiLocalTrack) => {
            room.addTrack(track);
        });
    }).catch(error => {
        console.error('There was an error creating the local tracks:', error);
        }
    );
}
  
export function createAndJoinRoom(connection: JitsiConnection, roomName: string) : Promise<JitsiConference> {
    return new Promise<JitsiConference>((resolve) => {
        const room = connection.initJitsiConference(roomName, {});
        room.on(JitsiMeetJS.events.conference.CONFERENCE_JOINED, () => {
            resolve(room);
        });
        room.join("password");
    });
}
  
export function connectToMeetServer(roomName: string) {
    return new Promise(((resolve, reject) => {
        const optionsWithRoom = { ...options };

        const connection = new JitsiMeetJS.JitsiConnection("mezon", null, optionsWithRoom);

        connection.addEventListener(JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED, () => {
            resolve(connection);
        });
        connection.addEventListener(JitsiMeetJS.events.connection.CONNECTION_FAILED, () => {
            reject('The connection failed.');
        });
        connection.addEventListener(JitsiMeetJS.events.connection.CONNECTION_DISCONNECTED, () => {
            console.log("Connection disconnected");
        });

        connection.connect(options);
    }))
}