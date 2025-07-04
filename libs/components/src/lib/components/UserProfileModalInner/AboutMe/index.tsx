type AboutMeProps = {
	createTime?: string;
};

const AboutMe = ({ createTime }: AboutMeProps) => {
	const formatDate = (dateString: string) => {
		const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', options);
	};

	return (
		<div className="flex flex-col gap-[20px]">
			<div className="flex flex-col gap-2">
				<p className="text-xs font-semibold text-theme-primary">Member Since</p>
				<span className="text-sm font-normal text-theme-primary">{formatDate(createTime || '')}</span>
			</div>
			<div className="flex flex-col gap-2">
				<p className="text-xs font-semibold text-theme-primary">Note</p>
				<textarea
					name=""
					id=""
					rows={2}
					placeholder="Click to add a note"
					className="w-full p-1  rounded-[3px] text-sm font-normal focus-visible:outline-none border-theme-primary bg-theme-setting-nav text-theme-primary"
				></textarea>
			</div>
		</div>
	);
};

export default AboutMe;
