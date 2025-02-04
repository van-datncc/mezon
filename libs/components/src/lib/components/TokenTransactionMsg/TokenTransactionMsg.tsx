import { MessagesEntity } from '@mezon/store';
import { Icons } from '@mezon/ui';

interface ITokenTransactionMessageProps {
	message: MessagesEntity;
}

const TokenTransactionMessage = ({ message }: ITokenTransactionMessageProps) => {
	return (
		<div className="py-2 w-[230px]">
			<div className="border dark:border-borderDivider rounded-md dark:bg-bgSecondary bg-bgLightSecondary text-[#4E5057] dark:text-[#DFDFE0]">
				<div className="p-3 flex gap-2 border-b dark:border-borderDivider w-full">
					<div className="w-[50px] flex items-center">
						<Icons.Transaction className="w-full dark:text-green-600 text-green-700" />
					</div>
					<div className="flex flex-col gap-2 flex-1">
						<div className="font-semibold ">{message.content.t}</div>
						<div className="text-xs font-medium">Transaction</div>
					</div>
				</div>
				<div className="text-xs dark:text-blue-500 text-blue-600 font-semibold p-3">Mezon transfer</div>
			</div>
		</div>
	);
};

export default TokenTransactionMessage;
