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

    useEffect(()=> {
        voice.setCurrentVoiceRoomName(roomName.toLowerCase());
        voice.setUserDisplayName(userName);
        const targetNode = document.querySelector("#meet");
        voice.setTargetTrackNode(targetNode as HTMLMediaElement);
        voice.createVoiceConnection(roomName.toLowerCase(), jwt);
    }, [voice]);
    
    return (
        <div className="space-y-2 px-4 mb-4 mt-[250px]" >
            <div id="meet"></div>
        </div>
    ); 
}

export default ChannelVoice;
