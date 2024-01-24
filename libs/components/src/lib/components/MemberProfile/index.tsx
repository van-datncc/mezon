export type MemberProfileProps = {
    avatar: string
    name: string
    status: string
}

function MemberProfile({ avatar, name, status }: MemberProfileProps) {
    return (
        <button className="h-[51px] p-[6px] md:p-[8px] gap-[12px] text-contentTertiary flex items-center justify-between font-title text-[15px] font-[500] text-white hover:bg-gray-550/[0.16] shadow-sm transition">
            <div className="relative mr-1 flex items-center ">
                <a className="relative inline-flex items-center justify-start w-10 h-10 text-lg text-white">
                    <img src={avatar} alt="avatar" className="rounded-full w-[36px] h-[36px]" />
                    <span className="absolute top-[24px] left-[24px] h-[12px] w-[12px] inline-flex items-center justify-center p-1 text-sm text-white bg-colorSuccess border-[3.5px] border-bgSurface rounded-full">
                        <span className="sr-only"> </span>
                    </span>
                </a>
                <div className="ml-[4px] flex flex-col items-start">
                    <span className="text-[14px] font-['Manrope'] text-[#84ADFF]">
                        {name}
                    </span>
                    <span className="text-[12px] font-['Manrope'] text-[#AEAEAE]">
                        {status}
                    </span>
                </div>
            </div>
        </button>
    )
}

export default MemberProfile
