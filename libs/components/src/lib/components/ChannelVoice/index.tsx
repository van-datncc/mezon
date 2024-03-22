import { useMezonVoice } from "@mezon/transport";
import { useCallback, useEffect } from "react";
import JitsiLocalTrack from "vendors/lib-jitsi-meet/dist/esm/modules/RTC/JitsiLocalTrack";
import JitsiRemoteTrack from "vendors/lib-jitsi-meet/dist/esm/modules/RTC/JitsiRemoteTrack";

export type ChannelVoiceProps = {
    clanName?: string;
    channelLabel: string;
    userName: string;
    jwt: string;
};

function ChannelVoice({ clanName, channelLabel, userName, jwt }: ChannelVoiceProps) {
    const voice = useMezonVoice();

    const roomName = clanName?.replace(" ", "-")+"-"+channelLabel.replace(" ", "-")
    if (roomName === "") {
        throw new Error("room must not empty");
    }

    const onLocalTrackFunc = useCallback(
        (tracks: JitsiLocalTrack[]) => {
            console.log("local track", tracks);
            const targetNode = document.querySelector("#meet");          
            tracks.forEach((localTrack) => {
                if (localTrack.getType() === 'video') {
                    const localVideoElem = document.createElement("video");
                    localVideoElem.autoplay = true;
                    console.log(localTrack);
                    localTrack.attach(localVideoElem);
                    targetNode?.appendChild(localVideoElem);
                } else {
                    const localVideoElem = document.createElement("audio");
                    localVideoElem.autoplay = true;
                    console.log(localTrack);
                    localTrack.attach(localVideoElem);
                    targetNode?.appendChild(localVideoElem);
                }
                //if (isJoined) room.addTrack(localTrack);
            });
        }, []);

    const onRemoteTrackFunc = useCallback(
        (track: JitsiRemoteTrack) => {
            if (track.getType() === 'video') {
                const targetNode = document.querySelector("#meet");
                console.log("remote track", track);
                const remoteVideo = document.createElement("video");
                remoteVideo.autoplay = true;
                remoteVideo.id = "video_234324234_1";
                track.attach(remoteVideo);
                targetNode?.appendChild(remoteVideo);
            }
        }, []);    

    useEffect(()=> {
        voice.setCurrentVoiceRoomName(roomName.toLowerCase());
        voice.setUserDisplayName(userName);
        const targetNode = document.querySelector("#meet");
        voice.setTrackTargetNode(targetNode);
        voice.setRenderLocalVideoTrack(() => onLocalTrackFunc);
        voice.setRenderRemoteVideoTrack(() => onRemoteTrackFunc);

        voice.createVoiceConnection(roomName.toLowerCase(), jwt);
    }, [roomName, userName, voice]);

    const handleClick = useCallback((event: any) => {
        //voice.createVoiceConnection(roomName.toLowerCase(), jwt);
    }, [jwt, roomName, voice]);
    
    return (
        <div className="space-y-2 px-4 mb-4 mt-[250px]" >            
            <button onClick={handleClick}>JOIN ROOM</button>
            <div id="meet"></div>
        </div>
    ); 
}

export default ChannelVoice;
