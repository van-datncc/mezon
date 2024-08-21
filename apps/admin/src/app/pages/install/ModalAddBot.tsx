import { clansActions, selectAllAccount, selectClanByUserId, useAppDispatch } from "@mezon/store";
import { Icons } from "@mezon/ui";
import { memo, useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ModalSuccess from "./ModalSuccess";

type ModalAddBotProps = {
    nameApp?: string
    handleOpenModal: () => void
}

const ModalAddBot = (props: ModalAddBotProps) => {
    const {nameApp="", handleOpenModal} = props;
    const account = useSelector(selectAllAccount);
    const [openModalSuccess, setOpenModalSuccess] = useState(false);

    const handleModalSuccess = useCallback(() => {
        setOpenModalSuccess(!openModalSuccess)
    },[openModalSuccess]);
    
    return (
        !openModalSuccess ? 
            <div className="rounded bg-bgProfileBody max-w-[440px] w-full pt-4 flex flex-col text-center gap-y-2">
                <HeaderModal name={nameApp} userName={account?.user?.username}/>
                <SelectClan userId={account?.user?.id}/>
                <FooterModal name={nameApp}/>
                <ModalAsk handelBack={handleOpenModal} handleOpenModal={handleModalSuccess}/>
            </div>:
            <ModalSuccess name={nameApp} handleModal={handleModalSuccess}/>
        
    )
}

export default ModalAddBot;

type HeaderModalProps = {
    name?: string,
    userName?: string,
    isModalTry?: boolean,
}

export const HeaderModal = memo((props: HeaderModalProps) => {
    const {name, userName, isModalTry} = props;
    
    return(
        <div className="px-4">
            <p className="text-base text-contentTertiary font-medium">An external application</p>
            <h3 className="font-bold text-xl">{name}</h3>
            <p className="text-base text-contentTertiary">wants to access your Discord account</p>
            <p className="text-sm font-extralight text-contentTertiary">
                Signed in as 
                <span className="text-white">&nbsp;{userName}</span>
                <a href="#" className="text-primary">&nbsp;Not you?</a>
            </p>
            <hr className="h-[0.08px] w-full border-borderDivider my-4"></hr>
            <div className="space-y-3">
                <p className="text-xs font-bold dark:text-textSecondary text-textSecondary800 uppercase mb-2 text-left">This will allow the developer of test2 to:</p>
                <div className="flex gap-x-2">
                    <div className="bg-colorSuccess rounded-full w-fit p-1">
                        <Icons.IconTick defaultSize="size-4" />
                    </div>
                    <p className="font-medium text-colorWhiteSecond">Create commands</p>
                </div>
                {!isModalTry ?
                    <div className="flex gap-x-2">
                        <div className="bg-borderDividerLight rounded-full w-fit p-1">
                            <Icons.Close defaultSize="size-4" />
                        </div>
                        <p className="font-medium text-colorWhiteSecond">Paint a happy little tree</p>
                    </div>:
                    <>
                        <div className="flex gap-x-2">
                            <div className="bg-colorSuccess rounded-full w-fit p-1">
                                <Icons.IconTick defaultSize="size-4" />
                            </div>
                            <p className="font-medium text-colorWhiteSecond">Send you direct messages</p>
                        </div>
                        <div className="flex gap-x-2">
                            <div className="bg-borderDividerLight rounded-full w-fit p-1">
                                <Icons.Close defaultSize="size-4" />
                            </div>
                            <p className="font-medium text-colorWhiteSecond">Bake a cake</p>
                        </div>
                    </>
                }
            </div>
        </div>
    )
})

type SelectClanProps = {
    userId?: string,
}

export const SelectClan = memo((props: SelectClanProps) => {
    const {userId} = props;
    const dispatch = useAppDispatch();
    const clans = useSelector(selectClanByUserId(userId || ''));
    useEffect(() => {
        dispatch(clansActions.fetchClans());
    },[])

    return (
        <div className="space-y-3 px-4">
            <hr className="h-[0.08px] w-full border-borderDivider my-4"/>
            <p className="text-xs font-bold dark:text-textSecondary text-textSecondary800 uppercase mb-2 text-left">Add to server:</p>
            <select 
                name="clan" 
                defaultValue=""
                className="block w-full mt-1 dark:bg-black bg-bgLightTertiary rounded p-2 font-normal text-base tracking-wide outline-none"
            >
                <option value="" disabled hidden>Select a serve</option>
                {clans.map(clan => <option key={clan.clan_id} value={clan.clan_id}>{clan.clan_name}</option>)}
            </select>
            <p className="text-xs text-contentTertiary text-left">This requires you to have <strong>Manage Server</strong> permission in the server.</p>
        </div>
    )
})

type FooterModalProps = {
    name?: string,
}

export const FooterModal = memo((props: FooterModalProps) => {
    const {name} = props;
    return (
        <div className="text-left !text-contentTertiary space-y-2 px-4 pb-4">
            <hr className="h-[0.08px] w-full border-borderDivider my-5"/>
            <div className="flex gap-x-2">
                <Icons.IconLock defaultSize="size-4 text-contentTertiary"/>
                <p className="text-xs">The Privacy Policy and Terms of Service of {name}'s developer apply to this application.</p>
            </div>
            <div className="flex gap-x-2">
                <Icons.IconClock defaultSize="size-4 text-contentTertiary"/>
                <p className="text-xs">Active since 20 Aug 2024</p>
            </div>
            <div className="flex gap-x-2">
                <Icons.IconProtected defaultSize="size-4 text-contentTertiary"/>
                <p className="text-xs">This application <strong>cannot</strong> read your messages or send messages as you.</p>
            </div>
        </div>
    )
})

type ModalAskProps = {
    handelBack?: () => void,
    handleOpenModal?: () => void,
}

export const ModalAsk = memo((props: ModalAskProps) => {
    const {handelBack=()=>{}, handleOpenModal=()=>{}} = props;
    return (
        <div className="bg-bgSecondary flex justify-between items-center p-4">
            <button 
                onClick={handelBack}
                className="hover:underline text-sm ml-4 font-medium text-colorWhiteSecond"
            >
                Back
            </button>
            <div className="flex items-center gap-x-2">
                <p className="text-xs text-contentTertiary">Click to authorize this app</p>
                <button
                    onClick={handleOpenModal}
                    className="text-sm px-4 py-2 bg-primary rounded text-white font-medium hover:bg-opacity-80"
                >
                    Authorise
                </button>
            </div>
        </div>
    )
})