import { ChannelTopbar, DirectMessageList, FooterProfile, ServerHeader } from '@mezon/components'
import ChannelMessages from '../channel/ChanneMessages'
import { ChannelMessageBox } from '../channel/ChannelMessageBox'

export default function Direct() {

    const currentDirectMess = null //get form store
    return (
        <>
            <div className="hidden flex-col w-60 bg-bgSurface md:flex">
                <ServerHeader type={'direct'} />
                <DirectMessageList />
                <FooterProfile name='nhan.nguyen' status='Online' />
            </div>
            <div className="flex flex-col flex-1 shrink min-w-0 bg-bgSecondary">
                <ChannelTopbar channel={undefined} />
                {currentDirectMess ? (
                    <>
                        <div className="overflow-y-scroll flex-1">
                            <ChannelMessages />
                        </div>
                        <div className="flex-shrink-0 bg-bgSecondary">
                            <ChannelMessageBox />
                        </div>
                    </>
                ) : <>
                </>
                }
            </div>
        </>
    )
}
