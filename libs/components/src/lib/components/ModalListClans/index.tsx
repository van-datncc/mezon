import { IClan } from "@mezon/utils";
import { Check, Tick } from "../Icons";

export type ModalListClansProps = {
    showModal: boolean;
    options: IClan[];
    idSelectedClan?: string | null;
    onChangeClan: (clanId: string) => void
};

const ModalListClans = (props: ModalListClansProps) => {
    const { showModal, options, idSelectedClan, onChangeClan } = props
    return (
        <>
            {showModal ? (
                <div
                    className="flex w-60 flex-col text-[16px] px-3 py-2 gap-2 z-50 border-[1px] border-bg-bgSecondary
                     border-borderDefault bg-bgSecondary rounded-lg"
                >
                    {options.map((option: IClan, index) => (
                        <div className={`w-auto flex py-1 px-2 items-center justify-between rounded-md ${idSelectedClan === option.id ? 'bg-[#151C2B]' : ''}`} key={index} onClick={() => onChangeClan(option.id)}>
                            <div className="flex items-center gap-2 w-10/12" >
                                <img src={option.image} width={32} height={32} className="rounded-full" />
                                <span className="text-[16px]">{option.name}</span>
                            </div>
                            {idSelectedClan === option.id && (
                                <Tick />
                            )}
                        </div>
                    ))}
                </div>
            ) : null}
        </>
    );
}

export default ModalListClans