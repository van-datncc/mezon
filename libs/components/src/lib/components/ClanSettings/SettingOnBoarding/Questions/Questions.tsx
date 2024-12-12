import {
	EGuideType,
	onboardingActions,
	selectCurrentClanId,
	selectFormOnboarding,
	selectOnboardingByClan,
	useAppDispatch,
	useAppSelector
} from '@mezon/store';
import { Icons } from '@mezon/ui';
import { ApiOnboardingItem, OnboardingAnswer } from 'mezon-js/api.gen';
import { ChangeEvent, useEffect, useState } from 'react';
import { useModal } from 'react-modal-hook';
import { useSelector } from 'react-redux';
import { EOnboardingStep } from '..';
import GuideItemLayout from '../GuideItemLayout';
import ModalControlRule, { ControlInput } from '../ModalControlRule';

interface IQuestionsProps {
	handleGoToPage: (page: EOnboardingStep) => void;
}

const Questions = ({ handleGoToPage }: IQuestionsProps) => {
	const [showChannelNotAssigned, setShowChannelNotAssigned] = useState(false);

	const toggleChannelNotAssigned = () => {
		setShowChannelNotAssigned(!showChannelNotAssigned);
	};

	const formOnboarding = useSelector(selectFormOnboarding);

	const dispatch = useAppDispatch();
	const handleAddPreJoinQuestion = () => {
		dispatch(
			onboardingActions.addQuestion({
				data: {
					answers: [],
					title: '',
					guide_type: EGuideType.QUESTION
				}
			})
		);
	};

	const currentClanId = useSelector(selectCurrentClanId);
	const onboardingByClan = useAppSelector((state) => selectOnboardingByClan(state, currentClanId as string));

	return (
		<div className="flex flex-col gap-8">
			<div onClick={() => handleGoToPage(EOnboardingStep.MAIN)} className="flex gap-3 cursor-pointer">
				<Icons.LongArrowRight className="rotate-180 w-3" />
				<div className="font-semibold">BACK</div>
			</div>
			<div className="flex flex-col gap-6">
				<div className="flex flex-col gap-2">
					<div className="text-[20px] text-white font-semibold">Questions</div>
					<div className="font-medium">
						Create questions to help members pick additional channels and roles. Their channel list will be customised based on their
						answers.
					</div>
					<div className="flex gap-2 items-center">
						<div className="cursor-pointer text-blue-500 hover:underline">See examples</div>
						<div className="w-1 h-1 rounded-full bg-gray-600" />
						<div className="cursor-pointer text-blue-500 hover:underline">Preview</div>
						<div className="w-1 h-1 rounded-full bg-gray-600" />
						<div className="cursor-pointer text-blue-500 hover:underline">Switch to Advanced Mode</div>
					</div>
				</div>
				<div>
					<div
						className={`flex items-center justify-between gap-2 bg-bgTertiary py-3 px-4 ${showChannelNotAssigned ? 'rounded-t-xl' : 'rounded-xl'}`}
					>
						<div className="text-[12px] font-semibold">No public channels are missing from Questions and Default Channels.</div>
						<div className="flex items-center gap-3">
							<div className="w-[120px] h-[6px] bg-[#3b3d44] rounded-lg flex justify-start">
								<div className="w-[70%] h-full rounded-lg bg-green-600" />
							</div>
							<div onClick={toggleChannelNotAssigned}>
								<Icons.ArrowRight defaultSize={`${showChannelNotAssigned ? 'rotate-90' : '-rotate-90'} w-6 duration-200`} />
							</div>
						</div>
					</div>
					{showChannelNotAssigned && (
						<div className="bg-bgSecondary px-4 py-3 rounded-b-xl flex flex-col gap-5 duration-200">
							<div className="uppercase font-semibold">Channel not assigned</div>
							<div className="tex-[12px] font-medium">No channels here</div>
						</div>
					)}
				</div>
				<div className="flex flex-col gap-5">
					<div className="flex flex-col gap-2 cursor-pointer">
						<div className="text-[16px] text-white font-bold">Pre-join Questions</div>
						<div>
							Members will be asked these questions before they join your server. Use them to assign channels and important roles.
							Pre-join Questions will also be available on the Channels & Roles page.
						</div>
						{onboardingByClan.question.map((question, index) => (
							<QuestionItem key={question.id} question={question} index={index} />
						))}
						{formOnboarding.questions.map((question, index) => (
							<QuestionItem key={index} question={question} index={index + onboardingByClan.question.length} tempId={index} />
						))}
						<div
							onClick={handleAddPreJoinQuestion}
							className="rounded-xl text-[#949cf7] justify-center items-center p-4 border-2 border-[#4e5058] border-dashed font-medium flex gap-2"
						>
							<Icons.CirclePlusFill className="w-5" />
							<div>Add a Question</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const QuestionItem = ({ question, index, tempId }: { question: ApiOnboardingItem; index: number; tempId?: number }) => {
	const [titleQuestion, setTitleQuestion] = useState(question?.title || '');
	const [answers, setAnswer] = useState<OnboardingAnswer[]>(question?.answers || []);
	const [indexEditAnswer, setIndexEditAnswer] = useState<number | undefined>(undefined);
	const dispatch = useAppDispatch();

	const handleAddAnswers = (answer: OnboardingAnswer, edit?: number) => {
		if (indexEditAnswer !== undefined) {
			const listAnswers = [...answers];
			listAnswers[indexEditAnswer] = answer;
			setAnswer(listAnswers);
			handleCloseEditAnswer();
			return;
		}
		setAnswer([...answers, answer]);
	};

	const handleRemoveAnswer = () => {
		if (indexEditAnswer !== undefined) {
			const newAnswers = [...answers];
			newAnswers.splice(indexEditAnswer, 1);
			setAnswer(newAnswers);
			dispatch(
				onboardingActions.editOnboarding({
					clan_id: question.clan_id as string,
					idOnboarding: question.id as string,
					content: {
						...question,
						title: titleQuestion,
						answers: newAnswers,
						task_type: EGuideType.QUESTION
					}
				})
			);
		}
		handleCloseEditAnswer();
	};

	const handleCloseEditAnswer = () => {
		closeAnswerPopup();
		setIndexEditAnswer(undefined);
	};
	const [openAnswerPopup, closeAnswerPopup] = useModal(
		() => (
			<ModalAddAnswer
				closeAnswerPopup={closeAnswerPopup}
				handleRemove={handleRemoveAnswer}
				editValue={indexEditAnswer !== undefined ? answers[indexEditAnswer] : undefined}
				setAnswer={handleAddAnswers}
				titleQuestion={titleQuestion}
				index={index}
			/>
		),
		[titleQuestion, answers.length, indexEditAnswer]
	);

	useEffect(() => {
		if (indexEditAnswer !== undefined) {
			openAnswerPopup();
		}
	}, [indexEditAnswer]);

	const handleOpenEditAnswer = (index: number) => {
		setIndexEditAnswer(index);
	};
	const [isExpanded, setIsExpanded] = useState(question ? false : true);

	const handleQuestionOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTitleQuestion(e.target.value);
	};

	const toggleExpand = () => {
		setIsExpanded(!isExpanded);
	};

	const handleAddQuestion = () => {
		toggleExpand();
		if (tempId !== undefined) {
			dispatch(
				onboardingActions.addQuestion({
					data: {
						title: titleQuestion,
						answers: answers,
						guide_type: EGuideType.QUESTION
					},
					update: tempId
				})
			);
			return;
		}
		dispatch(
			onboardingActions.editOnboarding({
				clan_id: question.clan_id as string,
				idOnboarding: question.id as string,
				content: {
					...question,
					title: titleQuestion,
					answers: answers,
					task_type: EGuideType.QUESTION
				}
			})
		);
	};

	const handleRemoveQuestion = () => {
		if (tempId !== undefined) {
			dispatch(
				onboardingActions.removeTempTask({
					idTask: tempId,
					type: EGuideType.QUESTION
				})
			);
			return;
		}
		if (question.id) {
			dispatch(
				onboardingActions.removeOnboardingTask({
					idTask: question.id,
					type: EGuideType.QUESTION,
					clan_id: question.clan_id as string
				})
			);
		}
	};

	return (
		<div className="flex flex-col gap-6 bg-bgSecondary p-4 rounded-lg">
			<div className="flex flex-col gap-2">
				<div className="flex justify-between items-center">
					<div className="uppercase text-xs font-medium">Question {index + 1}</div>
					<div className="flex gap-2 items-center">
						<div onClick={handleRemoveQuestion}>
							<Icons.TrashIcon className="w-4" />
						</div>
						<div onClick={toggleExpand}>
							<Icons.ArrowRight defaultSize={`${isExpanded ? 'rotate-90' : '-rotate-90'} w-4`} />
						</div>
					</div>
				</div>
				{isExpanded ? (
					<input
						className="text-[20px] bg-bgTertiary font-semibold outline-none focus:outline-blue-500 rounded-lg p-[10px]"
						type="text"
						placeholder="Enter a question..."
						value={titleQuestion}
						onChange={handleQuestionOnchange}
					/>
				) : (
					<div className="text-white text-xl font-semibold truncate">{titleQuestion}</div>
				)}
			</div>
			{isExpanded && (
				<>
					<div className="flex flex-col gap-2">
						<div>Available answers - 0 of 50</div>
						<div className="flex gap-1 gap-y-2 flex-wrap">
							{answers.map((answer, index) => (
								<GuideItemLayout
									onClick={() => handleOpenEditAnswer(index)}
									key={answer.title}
									icon={answer.emoji}
									description={answer.description}
									title={answer.title}
									className={`w-fit min-h-6 rounded-xl hover:bg-transparent text-white justify-center items-center p-4 border-2 border-[#4e5058] hover:border-[#7d808c]  font-medium flex gap-2 ${answer.description ? 'py-2' : ''}`}
								/>
							))}
							<GuideItemLayout
								onClick={openAnswerPopup}
								icon={<Icons.CirclePlusFill className="w-5" />}
								title={'Add an Answer'}
								className="w-fit hover:bg-transparent rounded-xl text-white justify-center items-center p-4 border-2 border-[#4e5058] hover:border-[#7d808c] border-dashed font-medium flex gap-2"
							/>
						</div>
					</div>
					<div className="flex justify-between">
						<div className="flex gap-6">
							<div className="flex items-center gap-2">
								<input type="checkbox" name="multiple-answer" className="w-5 h-5" />
								<label htmlFor="multiple-answer">Allow multiple answers</label>
							</div>
							<div className="flex items-center gap-2">
								<input type="checkbox" name="required" className="w-5 h-5" />
								<label htmlFor="required">Required</label>
							</div>
						</div>
						<div
							className="rounded-md w-28 h-9 bg-primary text-white flex items-center font-semibold justify-center"
							onClick={handleAddQuestion}
						>
							Save
						</div>
					</div>
				</>
			)}
		</div>
	);
};

export default Questions;
type ModalAddAnswerProp = {
	closeAnswerPopup: () => void;
	setAnswer: (answers: OnboardingAnswer, edit?: number) => void;
	titleQuestion: string;
	index: number;
	editValue?: OnboardingAnswer;
	handleRemove?: () => void;
};
const ModalAddAnswer = ({ closeAnswerPopup, index, setAnswer, titleQuestion, editValue, handleRemove }: ModalAddAnswerProp) => {
	const [titleAnswer, setTitleAnswer] = useState(editValue?.title || '');
	const [answerDescription, setAnswerDescription] = useState(editValue?.description || '');

	const handleChangeTitleAnswer = (e: ChangeEvent<HTMLInputElement>) => {
		setTitleAnswer(e.target.value);
	};

	const handleChangeTitleDescription = (e: ChangeEvent<HTMLInputElement>) => {
		setAnswerDescription(e.target.value);
	};

	const handleSaveAnswer = () => {
		setAnswer({ title: titleAnswer, description: answerDescription }, editValue ? index : undefined);
		setTitleAnswer('');
		setAnswerDescription('');
		closeAnswerPopup();
	};
	const handleRemoveAnswer = () => {
		if (handleRemove) {
			handleRemove();
		}
	};
	return (
		<ModalControlRule bottomLeftBtn="Remove" bottomLeftBtnFunction={handleRemoveAnswer} onClose={closeAnswerPopup} onSave={handleSaveAnswer}>
			<>
				<div className="absolute top-5 flex flex-col gap-2">
					<div className="uppercase text-xs font-medium">Question {index + 1}</div>
					<div className="text-xl text-white font-semibold">{titleQuestion || 'What is your question'} ?</div>
				</div>
				<div className="pb-5 pt-10 flex flex-col gap-2">
					<ControlInput
						title="Add answer title"
						message="Title is required"
						onChange={handleChangeTitleAnswer}
						value={titleAnswer}
						placeholder="Enter an answer..."
						required
					/>
					<ControlInput
						title="Add answer description"
						onChange={handleChangeTitleDescription}
						value={answerDescription}
						placeholder="Enter a description... (optional)"
					/>
				</div>
			</>
		</ModalControlRule>
	);
};
