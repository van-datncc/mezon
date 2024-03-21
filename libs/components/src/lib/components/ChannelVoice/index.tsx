import { VoiceContext } from "@mezon/core";
import { useMezon } from "@mezon/transport";
import { useContext } from "react";

export type ChannelVoiceProps = {
    clanName?: string;
    channelLabel: string;
    userName: string;
    jwt: string;
};

function ChannelVoice({ clanName, channelLabel, userName, jwt }: ChannelVoiceProps) { 
    const mezon = useMezon();
    //const { createVoiceRoom } = useContext(VoiceContext);

    const roomName = clanName?.replace(" ", "-")+"-"+channelLabel.replace(" ", "-")
    if (roomName === "") {
        throw new Error("room must not empty");
    }

    mezon.createVoiceRoom(roomName.toLowerCase());

    return (
        <div className="space-y-2 px-4 mb-4 mt-[250px]" >            
          
        </div>
    ); 
}

export default ChannelVoice;
