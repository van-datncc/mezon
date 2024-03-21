export type ChannelVoiceProps = {
  clanName?: string;
  channelLabel: string;
  userName: string;
  jwt: string;
};

function ChannelVoice({ clanName, channelLabel, userName, jwt }: ChannelVoiceProps) { 
    

    return (
        <div className="space-y-2 px-4 mb-4 mt-[250px]" >            
          
        </div>
    ); 
}

export default ChannelVoice;
