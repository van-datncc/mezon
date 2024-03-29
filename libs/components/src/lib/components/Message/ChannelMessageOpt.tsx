import { Icons } from "@mezon/components";
import { useAuth } from "@mezon/core";
import { referencesActions, useAppDispatch } from "@mezon/store";
import { IMessageWithUser } from "@mezon/utils";
import { useCallback } from "react";

type ChannelMessageOptProps = {
	message: IMessageWithUser
};

export default function ChannelMessageOpt({ message }: ChannelMessageOptProps) {

    const { userId } = useAuth()
    const dispatch = useAppDispatch();

    const handleClickReact = useCallback(()=> {
    
    }, []);
    
    const handleClickEdit = useCallback(()=> {
    
    }, []);

    const handleClickReply = useCallback(()=> {
        dispatch(referencesActions.setReference(message));
    }, [message]);

    return (
        <div className="iconHover flex justify-between">
            <div onClick={handleClickReact} className="h-full p-1 cursor-pointer">
                <Icons.Smile defaultFill={`${true ? '#FFFFFF' : '#AEAEAE'}`} />
            </div>

            {userId === message.sender_id ? (
                <button onClick={handleClickEdit} className="h-full p-1 cursor-pointer">
                    <Icons.PenEdit defaultFill={true ? '#FFFFFF' : '#AEAEAE'} />
                </button>
            ) : (
                <button onClick={handleClickReply} className="h-full px-1 pb-[2px] rotate-180">
                    <Icons.Reply defaultFill={true ? '#FFFFFF' : '#AEAEAE'} />
                </button>
            )}
            <button className="h-full p-1 cursor-pointer">
                <Icons.ThreeDot />
            </button>
        </div>
    );
}
