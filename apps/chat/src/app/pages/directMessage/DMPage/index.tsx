import {
  ChannelList,
  ChannelTopbar,
  FooterProfile,
  MemberList,
  ServerHeader,
} from "@mezon/components";
import { useAppNavigation, useAppParams } from "@mezon/core";
import { RootState, selectDefaultChannelIdByClanId } from "@mezon/store";
import { useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import ChannelMessages from "../../channel/ChanneMessages";
import { ChannelMessageBox } from "../../channel/ChannelMessageBox";

export function DirectMessage() {
  const isSending = useSelector((state: RootState) => state.messages.isSending);

  const { serverId, directId } = useAppParams();
  const defaultChannelId = useSelector(
    selectDefaultChannelIdByClanId(serverId || ""),
  );
  const { navigate } = useAppNavigation();

  useEffect(() => {
    if (defaultChannelId) {
      navigate(`./${defaultChannelId}`);
    }
  }, [defaultChannelId, navigate]);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [isSending, []]);

  return (
    <>
      <div className="flex flex-col flex-1 shrink min-w-0 bg-bgSecondary h-[100%]">
        <ChannelTopbar channel={null} />
        <div className="flex h-heightWithoutTopBar flex-row ">
          <div className="flex flex-col flex-1 w-full h-full">
            <div
              className="overflow-y-auto bg-[#1E1E1E]  max-h-heightMessageViewChat h-heightMessageViewChat"
              ref={messagesContainerRef}
            >
              {<ChannelMessages channelId={directId ?? ""} />}
            </div>
            <div className="flex-shrink-0 flex flex-col bg-[#1E1E1E] h-auto">
              <ChannelMessageBox />
            </div>
          </div>
          <div className="w-[268px] bg-bgSurface  lg:flex hidden">
            <MemberList />
          </div>
        </div>
      </div>
    </>
  );
}
