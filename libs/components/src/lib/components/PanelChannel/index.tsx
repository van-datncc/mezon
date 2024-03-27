import { Coords } from '../ChannelLink';

type PanelChannel = {
	coords: Coords;
};

const PanelChannel = ({ coords }: PanelChannel) => {
	return (
		<div
			style={{ left: coords.mouseX, top: coords.mouseY }}
			className="fixed top-full bg-[#111214] rounded-md shadow z-10 w-[188px] py-[10px] px-[10px]"
		>
			<div className="flex flex-col pb-3 mb-3 border-b-[0.08px] border-b-[#1E1E1E]">
				<li className="list-none p-[5px] rounded-sm text-[14px] text-[#7A7A7A] cursor-default">Đánh dấu là đã đọc</li>
			</div>
			<div className="flex flex-col pb-3 mb-3 border-b-[0.08px] border-b-[#1E1E1E]">
				<li className="list-none p-[5px] rounded-sm hover:bg-[#3C45A5] text-[14px] text-[#B5BAC1] hover:text-[#fff] cursor-pointer">
					Thoát khỏi chủ đề
				</li>
				<li className="list-none p-[5px] rounded-sm text-[14px] text-[#B5BAC1] cursor-pointer">Sao chép link</li>
			</div>
			<div className="flex flex-col pb-3 mb-3 border-b-[0.08px] border-b-[#1E1E1E]">
				<li className="list-none p-[5px] rounded-sm text-[14px] text-[#B5BAC1] cursor-pointer">Tắt tiếng chủ đề</li>
				<li className="list-none p-[5px] rounded-sm text-[14px] text-[#B5BAC1] cursor-pointer">Cài đặt thông báo</li>
			</div>
		</div>
	);
};

export default PanelChannel;
