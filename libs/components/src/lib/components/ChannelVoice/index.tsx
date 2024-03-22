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

            for (let i = 0; i < tracks.length; i++) {
                if (tracks[i].getType() === 'video') {
                    console.log(`<video autoplay='1' id='localVideo${i}' />`);	
                    const pelement = document.getElementById("localvideo");
                    const celement = document.createElement("video");
                    celement.setAttribute("autoplay", "1");
                    celement.setAttribute("id", "localvideo"+i);
                    pelement?.appendChild(celement);	
                    if (pelement) {
                        console.log("set element");
                        tracks[i].attach(pelement);
                    }
                } else {
                    console.log(`<audio autoplay='1' muted='true' id='localAudio${i}' />`);
                    //localtrack.attach(attachLocalTrackElement);
                }
            }
        }, []);

    const onRemoteTrackFunc = useCallback(
        (tracks: Map<string, JitsiRemoteTrack[]>) => {
            console.log("remote track", tracks);
        }, []);    

    useEffect(()=> {
        voice.setCurrentVoiceRoomName(roomName.toLowerCase());
        voice.setUserDisplayName(userName);
        voice.setRenderLocalVideoTrack(() => onLocalTrackFunc);
        voice.setRenderRemoteVideoTrack(() => onRemoteTrackFunc);

        //voice.createVoiceConnection(roomName.toLowerCase(), jwt);
    }, [roomName, userName, voice]);

    const handleClick = useCallback((event: any) => {
        voice.createVoiceConnection(roomName.toLowerCase(), jwt);
    },[jwt, roomName, voice]);
    
    return (
        <div className="space-y-2 px-4 mb-4 mt-[250px]" >            
        <button id="localvideo" onClick={handleClick}>JOIN ROOM</button>
        <div id="
        
        " />
        </div>
    ); 
}

export default ChannelVoice;
