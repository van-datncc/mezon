import { EGuideType, onboardingActions, useAppDispatch } from '@mezon/store';
import { ChangeEvent, useState } from 'react';
import ModalControlRule, { ControlInput } from '../ModalControlRule';

const ModalAddRules = ({ onClose }: { onClose: () => void }) => {
	const [ruleTitle, setRuleTitle] = useState('');
	const [ruleDescription, setRuleDescription] = useState('');
	const dispatch = useAppDispatch();

	const handleChangeRuleTitle = (e: ChangeEvent<HTMLInputElement>) => {
		setRuleTitle(e.target.value);
	};
	const handleChangeRuleDescription = (e: ChangeEvent<HTMLInputElement>) => {
		setRuleDescription(e.target.value);
	};
	const handleAddRules = () => {
		dispatch(
			onboardingActions.addRules({
				title: ruleTitle,
				content: ruleDescription,
				guide_type: EGuideType.RULE
			})
		);
		onClose();
	};

	return (
		<ModalControlRule onClose={onClose} onSave={handleAddRules}>
			<div className="flex flex-col pb-6">
				<div className="text-base font-semibold absolute top-3 left-5 text-white">Edit Resources</div>
				<ControlInput
					placeholder="#rules might be Rules"
					title="Give this resource a name"
					onChange={handleChangeRuleTitle}
					value={ruleTitle}
					required
				/>

				<div className="w-full h-[1px] my-6 bg-channelTextLabel"></div>

				<ControlInput
					placeholder="Ex.Rule for the clan"
					title="Give this resource a description"
					onChange={handleChangeRuleDescription}
					value={ruleDescription}
					required
				/>
			</div>
		</ModalControlRule>
	);
};
export default ModalAddRules;
