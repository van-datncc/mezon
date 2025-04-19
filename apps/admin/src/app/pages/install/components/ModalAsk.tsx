import { useAppearance } from '../../../context/AppearanceContext';

type ModalAskProps = {
	handelBack: () => void;
	handleAddBotOrApp: () => void;
};

const ModalAsk = ({ handelBack, handleAddBotOrApp }: ModalAskProps) => {
	const { isDarkMode } = useAppearance();

	return (
		<div className={`flex justify-between items-center p-4 rounded-b ${isDarkMode ? 'bg-[#1e1f22]' : 'bg-[#f9fafb]'}`}>
			<button onClick={handelBack} className={`text-sm font-medium hover:underline ${isDarkMode ? 'text-[#d1d5db]' : 'text-[#111827]'}`}>
				Back
			</button>
			<div className="flex items-center gap-x-2">
				<p className={`text-xs ${isDarkMode ? 'text-[#9ca3af]' : 'text-[#4b5563]'}`}>Click to authorize this app</p>
				<button
					onClick={handleAddBotOrApp}
					className="text-sm px-4 py-2 bg-[#5865F2] rounded-lg text-white font-semibold hover:bg-[#4752c4] transition"
				>
					Authorize
				</button>
			</div>
		</div>
	);
};

export default ModalAsk;
