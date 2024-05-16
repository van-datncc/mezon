import { useAuth, useCategory, useClans, useOnClickOutside } from '@mezon/core';
import { categoriesActions, selectCurrentClanId, useAppDispatch } from '@mezon/store';
import { InputField } from '@mezon/ui';
import { Modal } from 'flowbite-react';
import { ApiCreateCategoryDescRequest } from 'mezon-js/api.gen';
import { useRef, useState } from 'react';
import { useModal } from 'react-modal-hook';
import { useSelector } from 'react-redux';
import ClanSetting from '../ClanSettings/clanSettings';
import * as Icons from '../Icons';
import ModalInvite from '../ListMemberInvite/modalInvite';
import SearchModal from '../SearchModal';
import ItemModal from './ItemModal';

export type ClanHeaderProps = {
	name?: string;
	type: string;
	bannerImage?: string;
};

function ClanHeader({ name, type, bannerImage }: ClanHeaderProps) {
	const inputRef = useRef<HTMLInputElement | null>(null);
	const modalRef = useRef<HTMLDivElement | null>(null);
	const dispatch = useAppDispatch();
	const { userProfile } = useAuth();
	const currentClanId = useSelector(selectCurrentClanId);
	const { currentClan } = useClans();
	const { categorizedChannels } = useCategory();
	const [openInviteClanModal, closeInviteClanModal] = useModal(() => (
		<ModalInvite onClose={closeInviteClanModal} open={true} channelID={channelId || ''} />
	));
	const [openSearchModal, closeSearchModal] = useModal(() => <SearchModal onClose={closeSearchModal} open={true} />);

	const [openCreateCate, setOpenCreateCate] = useState(false);
	const [openServerSettings, setOpenServerSettings] = useState(false);
	const [isShowModalPannelClan, setIsShowModalPannelClan] = useState<boolean>(false);

	const channelId = categorizedChannels.at(0)?.channels.at(0)?.channel_id;

	const onClose = () => {
		setOpenCreateCate(false);
	};
	const [nameCate, setNameCate] = useState('');

	const handleCreateCate = async () => {
		const body: ApiCreateCategoryDescRequest = {
			clan_id: currentClanId?.toString(),
			category_name: nameCate,
		};
		await dispatch(categoriesActions.createNewCategory(body));
		setNameCate('');
		onClose();
	};
	const handleInputFocus = () => {
		openSearchModal();
		inputRef.current?.blur();
	};
	const [checkvalidate, setCheckValidate] = useState(true);
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setNameCate(value);
		if (/^[A-Za-z0-9_-]{0,64}$/.test(value) && value !== '') {
			setCheckValidate(false);
		} else {
			setCheckValidate(true);
		}
	};

	const handleShowModalClan = () => {
		setIsShowModalPannelClan(!isShowModalPannelClan);
	};

	const handleShowCreateCategory = () => {
		setOpenCreateCate(true);
		setIsShowModalPannelClan(false);
	};

	const handleShowInviteClanModal = () => {
		openInviteClanModal();
		setIsShowModalPannelClan(false);
	};

	const handleShowServerSettings = () => {
		setOpenServerSettings(true);
		setIsShowModalPannelClan(false);
	};

	useOnClickOutside(modalRef, () => setIsShowModalPannelClan(false));

	return (
		<>
			{type === 'direct' ? (
				<div className="px-3 font-semibold text-white h-heightHeader flex items-center shadow border-b-[1px] dark:border-bgTertiary border-gray-200">
					<input
						ref={inputRef}
						placeholder="Find or start a conversation"
						className={`font-[400] px-[16px] rounded dark:text-white text-black outline-none text-[14px] w-full dark:bg-bgTertiary bg-[#E1E1E1] dark:border-borderDefault h-[36px]`}
						type="text"
						onFocus={handleInputFocus}
					/>
				</div>
			) : (
				<div className={`${bannerImage ? 'h-[136px]' : 'h-[60px]'} relative bg-gray-950`}>
					{bannerImage && <img src={bannerImage} alt="imageCover" className="h-full w-full" />}
					<div ref={modalRef} className="relative h-[60px]" onClick={handleShowModalClan}>
						<div className="cursor-pointer w-[272px] p-3 left-0 top-0 absolute flex h-heightHeader justify-between items-center gap-2 dark:bg-bgSecondary bg-bgLightMode dark:hover:bg-[#35373C] hover:bg-[#E2E7F6] shadow border-b-[1px] dark:border-bgTertiary border-white">
							<p className="dark:text-white text-black text-base font-semibold select-none">{name?.toLocaleUpperCase()}</p>
							<button className="w-6 h-8 flex flex-col justify-center iconHover">
								<Icons.ArrowDown />
							</button>
						</div>
						{isShowModalPannelClan && (
							<div
								onClick={(e) => e.stopPropagation()}
								className="dark:bg-bgProfileBody bg-white p-2 rounded w-[250px] absolute left-1/2 top-[68px] z-[9999] transform translate-x-[-50%]"
							>
								<div className="flex flex-col pb-1 mb-1 border-b-[0.08px] border-b-[#6A6A6A] last:border-b-0 last:mb-0 last:pb-0">
									<ItemModal onClick={handleShowCreateCategory} children="Create Category" endIcon={<Icons.CreateCategoryIcon />} />
									<ItemModal onClick={handleShowInviteClanModal} children="Invite People" endIcon={<Icons.AddPerson className='dark:text-[#AEAEAE] text-colorTextLightMode group-hover:text-white'/>} />
									<ItemModal onClick={handleShowServerSettings} children="Clan Settings" endIcon={<Icons.SettingProfile className='dark:text-[#AEAEAE] text-colorTextLightMode group-hover:text-white'/>} />
								</div>
							</div>
						)}
					</div>
				</div>
			)}
			<ClanSetting
				// open={openServerSettings}
				open={openServerSettings}
				onClose={() => {
					setOpenServerSettings(false);
				}}
			/>

			<Modal show={openCreateCate} dismissible={true} onClose={onClose} className="bg-[#111111] text-contentPrimary bg-opacity-80" size="lg">
				<div className="bg-[#1E1E1E] flex items-center justify-between px-6 pt-4 border-solid border-borderDefault rounded-tl-[5px] rounded-tr-[5px]">
					<div className="text-[19px] font-bold uppercase">Create Category</div>
					<button className="flex items-center justify-center opacity-50" onClick={onClose}>
						<span className="text-4xl hover:text-white">×</span>
					</button>
				</div>
				<Modal.Body className="bg-[#1E1E1E] px-6 py-4">
					<div className="flex flex-col">
						<span className="font-[600] text-sm ">What is category's name?</span>
						<InputField
							type="text"
							onChange={handleInputChange}
							placeholder="Enter the category's name"
							className="py-[8px] bg-black text-[14px] mt-2 mb-0 border-blue-600 border"
							value={nameCate}
						/>
					</div>
					{checkvalidate && (
						<p className="text-[#e44141] text-xs italic font-thin">
							Please enter a valid channel name (max 64 characters, only words, numbers, _ or -).
						</p>
					)}
				</Modal.Body>
				<div className=" text-white font-semibold text-sm flex bg-bgTertiary justify-end flex-row items-center gap-4 py-4 px-6 bg-bgDisable rounded-bl-[5px] rounded-br-[5px]">
					<button onClick={onClose}>Cancel</button>
					<button
						className={`px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 bg-primary ${checkvalidate ? 'opacity-50 cursor-not-allowed' : ''}`}
						onClick={handleCreateCate}
						disabled={checkvalidate}
					>
						Create Category
					</button>
				</div>
			</Modal>
		</>
	);
}

export default ClanHeader;
