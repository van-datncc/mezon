import { useMezonVoice } from "@mezon/transport";

export type ChannelVoiceProps = {
    clanName?: string;
    channelLabel: string;
    userName: string;
    jwt: string;
};

function ChannelVoice({ clanName, channelLabel, userName, jwt }: ChannelVoiceProps) {
    const voicemezon = useMezonVoice();

    const roomName = clanName?.replace(" ", "-")+"-"+channelLabel.replace(" ", "-")
    if (roomName === "") {
        throw new Error("room must not empty");
    }

    voicemezon.createVoiceRoom(roomName.toLowerCase());

    return (
        <div className="space-y-2 px-4 mb-4 mt-[250px]" >            
          
        </div>
    ); 
}

export default ChannelVoice;
