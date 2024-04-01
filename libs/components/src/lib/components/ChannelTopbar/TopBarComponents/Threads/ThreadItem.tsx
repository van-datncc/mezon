import { Avatar } from 'flowbite-react';

type ThreadItemProps = {
	thread?: any;
};

const ThreadItem = ({ thread }: ThreadItemProps) => {
	return (
		<div className="p-4 mb-2 cursor-pointer rounded-lg h-[72px] bg-[#535353] border border-[#535353] hover:border hover:border-[#6A6A6A]">
			<div className="flex flex-row justify-between items-center">
				<div className="flex flex-col gap-1">
					<p className="text-base font-semibold leading-5">ncc8-answer</p>
					<div className="flex flex-row items-center">
						<Avatar
							img="https://cdn.mezon.vn/z5126645130854_0c32cb7d64e06799d129e375d8313896.jpg"
							rounded
							size={'xs'}
							theme={{ root: { size: { xs: 'w-4 h-4' } } }}
							className="mr-2"
						/>
						<span className="text-[#17AC86] text-sm font-semibold leading-4">you.mynameis:&nbsp;</span>
						<span className="text-sm font-medium leading-4 mr-2">Hello you</span>
						<span className="text-sm font-medium leading-4">•&nbsp;1d ago</span>
					</div>
				</div>
				<div>
					<Avatar.Group className="flex gap-3">
						<Avatar img="https://cdn.mezon.vn/z5126645130854_0c32cb7d64e06799d129e375d8313896.jpg" rounded size="xs" />
						<Avatar img="https://cdn.mezon.vn/z5126645130854_0c32cb7d64e06799d129e375d8313896.jpg" rounded size="xs" />
						<Avatar img="https://cdn.mezon.vn/z5126645130854_0c32cb7d64e06799d129e375d8313896.jpg" rounded size="xs" />
						<Avatar img="https://cdn.mezon.vn/z5126645130854_0c32cb7d64e06799d129e375d8313896.jpg" rounded size="xs" />
						<Avatar img="https://cdn.mezon.vn/z5126645130854_0c32cb7d64e06799d129e375d8313896.jpg" rounded size="xs" />
						<Avatar.Counter total={99} className="h-6 w-6" />
					</Avatar.Group>
				</div>
			</div>
		</div>
	);
};

export default ThreadItem;
