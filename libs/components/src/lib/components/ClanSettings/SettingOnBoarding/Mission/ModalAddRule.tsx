import { EGuideType, onboardingActions, useAppDispatch } from '@mezon/store';
import { ApiOnboardingItem } from 'mezon-js/api.gen';
import { ChangeEvent, useState } from 'react';
import ModalControlRule, { ControlInput } from '../ModalControlRule';

const ModalAddRules = ({ onClose, ruleEdit, tempId }: { onClose: () => void; ruleEdit?: ApiOnboardingItem; tempId?: number }) => {
	const [ruleTitle, setRuleTitle] = useState(ruleEdit?.title || '');
	const [ruleDescription, setRuleDescription] = useState(ruleEdit?.content || '');
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

	const handleRemoveRule = () => {
		if (!ruleEdit) {
			return;
		}
		if (tempId !== undefined) {
			dispatch(
				onboardingActions.removeTempTask({
					idTask: tempId,
					type: EGuideType.RULE
				})
			);
			return;
		}

		dispatch(
			onboardingActions.removeOnboardingTask({
				clan_id: ruleEdit.clan_id as string,
				idTask: ruleEdit.id as string,
				type: EGuideType.RULE
			})
		);
	};
	return (
		<ModalControlRule
			onClose={onClose}
			onSave={handleAddRules}
			bottomLeftBtn={ruleEdit ? 'Remove' : undefined}
			bottomLeftBtnFunction={handleRemoveRule}
		>
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
