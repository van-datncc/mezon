import { useMezonVoice } from "@mezon/transport";
import { useEffect } from "react";

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
