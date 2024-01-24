import { IClan } from "@mezon/utils";
import { Check, Tick } from "../Icons";
import IconCreateClan from '../../../../../../apps/chat/src/assets/Images/IconCreateClan.svg'

export type ModalListClansProps = {
    showModal: boolean;
    options: IClan[];
    idSelectedClan?: string | null;
    onChangeClan: (clanId: string) => void;
    createClan: () => void
};

const ModalListClans = (props: ModalListClansProps) => {
    const { showModal, options, idSelectedClan, onChangeClan, createClan } = props;

    return (
        <>
            {showModal ? (
                <div
                    className="flex w-64 flex-col text-[16px] px-3 py-2 gap-2 z-50 border-[1px] border-bg-bgSecondary
                     border-borderDefault bg-bgSecondary rounded-lg"
                >
                    <div className="overflow-y-auto max-h-36">
                        {options.map((option: IClan, index) => (
                            <div className={`w-auto flex py-1 px-2 items-center justify-between rounded-md ${idSelectedClan === option.id ? 'bg-[#151C2B] text-contentPrimary font-bold' : 'text-contentSecondary'}`} key={index} onClick={() => onChangeClan(option.id)}>
                                <div className="flex items-center gap-4 w-10/12" >
                                    {option.logo ? (
                                        <img src={option.logo} width={40} height={40} className="rounded-full" />
                                    ) : (
                                        <>
                                            {option?.clan_name && (
                                                <div className='w-[40px] h-[40px] bg-bgSurface rounded-full flex justify-center items-center text-contentSecondary text-[20px]'>
                                                    {option.clan_name.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                        </>
                                    )}
                                    <span className="text-[16px]">{option.clan_name}</span>
                                </div>
                                {idSelectedClan === option.clan_id && (
                                    <Tick />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className='w-auto flex py-1 px-2 items-center justify-between text-contentSecondary rounded-md'>
                        <div className="flex items-center gap-4 w-10/12" onClick={createClan}>
                            <img src={IconCreateClan} alt={'logoMezon'} width={40} height={40} />
                            <span className="text-[16px]">Add Clan</span>
                        </div>
                    </div>
                </div >
            ) : null}
        </>
    );
}

export default ModalListClans