import { Icons } from '@mezon/ui';
import { useState } from 'react';
import { useModal } from 'react-modal-hook';
import { EOnboardingStep } from '..';
import ModalControlRule, { ControlInput } from '../ModalControlRule';

interface IQuestionsProps {
	handleGoToPage: (page: EOnboardingStep) => void;
}

const Questions = ({ handleGoToPage }: IQuestionsProps) => {
	const [showChannelNotAssigned, setShowChannelNotAssigned] = useState(false);

	const toggleChannelNotAssigned = () => {
		setShowChannelNotAssigned(!showChannelNotAssigned);
	};

	const [preJoinQuestions, setPreJoinQuestion] = useState<number[]>([]);
	const [postJoinQuestions, setPostJoinQuestion] = useState<number[]>([]);

	const handleAddPreJoinQuestion = () => {
		setPreJoinQuestion([...preJoinQuestions, 1]);
	};

	const handleAddPostJoinQuestion = () => {
		setPostJoinQuestion([...postJoinQuestions, 1]);
	};

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
						{preJoinQuestions.map((question, index) => (
							<QuestionItem key={index} />
						))}
						<div
							onClick={handleAddPreJoinQuestion}
							className="rounded-xl text-[#949cf7] justify-center items-center p-4 border-2 border-[#4e5058] border-dashed font-medium flex gap-2"
						>
							<Icons.CirclePlusFill className="w-5" />
							<div>Add a Question</div>
						</div>
					</div>
					<div className="border-t border-[#4e5058]" />
					<div className="flex flex-col gap-2 cursor-pointer">
						<div className="text-[16px] text-white font-bold">Post-join Questions</div>
						<div>
							Members will be asked these questions after they join your server, on the Channels & Roles page. Use them to assign roles
							that members can pick later, like vanity roles.
						</div>
						{postJoinQuestions.map((question, index) => (
							<QuestionItem key={index} />
						))}
						<div
							onClick={handleAddPostJoinQuestion}
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

const QuestionItem = () => {
	const [openAnswerPopup, closeAnswerPopup] = useModal(() => (
		<ModalControlRule bottomLeftBtn="Remove" onClose={closeAnswerPopup}>
			<>
				<div className="absolute top-5 flex flex-col gap-2">
					<div className="uppercase text-xs font-medium">Question 1</div>
					<div className="text-xl text-white font-semibold">What do you want to do in this community?</div>
				</div>
				<div className="pb-5 pt-10 flex flex-col gap-2">
					<ControlInput
						title="Add answer title"
						message="Title is required"
						onChange={() => {}}
						value=""
						placeholder="Enter an answer..."
						required
					/>
					<ControlInput title="Add answer description" onChange={() => {}} value="" placeholder="Enter a description... (optional)" />
				</div>
			</>
		</ModalControlRule>
	));

	const [isExpanded, setIsExpanded] = useState(true);
	const [question, setQuestion] = useState('');

	const handleQuestionOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setQuestion(e.target.value);
	};

	const toggleExpand = () => {
		setIsExpanded(!isExpanded);
	};

	return (
		<div className="flex flex-col gap-6 bg-bgSecondary p-4 rounded-lg">
			<div className="flex flex-col gap-2">
				<div className="flex justify-between items-center">
					<div className="uppercase text-xs font-medium">Question 1</div>
					<div className="flex gap-2 items-center">
						<Icons.TrashIcon className="w-4" />
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
						value={question}
						onChange={handleQuestionOnchange}
					/>
				) : (
					<div className="text-white text-xl font-semibold">{question}</div>
				)}
			</div>
			{isExpanded && (
				<div className="flex flex-col gap-2">
					<div>Available answers - 0 of 50</div>
					<div className="flex gap-[1%] gap-y-[1%]">
						<div
							onClick={openAnswerPopup}
							className="w-[49.5%] rounded-xl text-white justify-center items-center p-4 border-2 border-[#4e5058] border-dashed font-medium flex gap-2"
						>
							<Icons.CirclePlusFill className="w-5" />
							<div>Add an Answer</div>
						</div>
					</div>
				</div>
			)}
			{isExpanded && (
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
			)}
		</div>
	);
};

export default Questions;
