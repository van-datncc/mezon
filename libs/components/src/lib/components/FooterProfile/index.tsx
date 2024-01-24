import { Chevron, HeadPhoneICon, MicIcon, SettingProfile } from '@mezon/components'
import IconLogoUser from "../../../../../../apps/chat/src/assets/Images/logoTest.png"
export type FooterProfileProps = {
    name: string
    status?: boolean;
    avatar: string;
}

function FooterProfile({ name, status, avatar }: FooterProfileProps) {
    return (
        <button className="text-contentTertiary flex items-center justify-between border-t-2 border-borderDefault px-4 py-3 font-title text-[15px] font-[500] text-white hover:bg-gray-550/[0.16] shadow-sm transition">
            <div className="relative gap-[5px] flex items-center ">
                <a
                    className="mr-[2px] relative inline-flex items-center justify-start w-10 h-10 text-lg text-white rounded-full"
                >
                    {avatar ? (
                        <img src={avatar} style={{ width: '38px', height: '38px', borderRadius: '50%' }} />
                    ) : (
                        <div className='w-[38px] h-[38px] bg-bgDisable rounded-full flex justify-center items-center text-contentSecondary text-[16px]'>
                            {name.charAt(0).toUpperCase()}
                        </div>
                    )}

                    <span className={`absolute bottom-[-0px] right-[-1px] inline-flex items-center justify-center gap-1 p-1 text-sm text-white border-[4px] border-bgSurface rounded-full ${status ? 'bg-colorNeutral' : 'bg-colorSuccess'}`}>
                        <span className="sr-only"> </span>
                    </span>
                </a>
                <div className='flex flex-col items-start'>
                    <span className='text-[13px]'>
                        {name}
                    </span>
                    <span className='text-[11px] text-contentSecondary'>
                        {status ? 'Offline' : 'Online'}
                    </span>
                </div>
            </div>

            <div className='flex items-center gap-2'>
                <MicIcon className="ml-auto w-[18px] h-[18px] opacity-80" />
                <HeadPhoneICon className="ml-auto w-[18px] h-[18px] opacity-80" />
                <SettingProfile className="ml-auto w-[18px] h-[18px] opacity-80" />
            </div>
        </button>
    )
}

export default FooterProfile
