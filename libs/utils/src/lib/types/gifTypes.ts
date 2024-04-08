export type OriginalImage = {
	height: string;
	width: string;
	size: string;
	url: string;
	mp4_size: string;
	mp4: string;
	webp_size: string;
	webp: string;
	frames: string;
	hash: string;
};

export type DownsizedImage = {
	height: string;
	width: string;
	size: string;
	url: string;
};

export type FixedHeightImage = {
	height: string;
	width: string;
	size: string;
	url: string;
	mp4_size: string;
	mp4: string;
	webp_size: string;
	webp: string;
};

export type User = {
	avatar_url: string;
	banner_image: string;
	banner_url: string;
	profile_url: string;
	username: string;
	display_name: string;
	description: string;
	instagram_url: string;
	website_url: string;
	is_verified: boolean;
};

export type OnLoad = {
	url: string;
};

export type OnClick = {
	url: string;
};

export type OnSent = {
	url: string;
};

export type Analytics = {
	onload: OnLoad;
	onclick: OnClick;
	onsent: OnSent;
};

export type IGif = {
	type: string;
	id: string;
	url: string;
	slug: string;
	bitly_gif_url: string;
	bitly_url: string;
	embed_url: string;
	username: string;
	source: string;
	title: string;
	rating: string;
	content_url: string;
	source_tld: string;
	source_post_url: string;
	is_sticker: number;
	import_datetime: string;
	trending_datetime: string;
	images: {
		original: OriginalImage;
		downsized: DownsizedImage;
		downsized_large: DownsizedImage;
		downsized_medium: DownsizedImage;
		downsized_small: {
			height: string;
			width: string;
			mp4_size: string;
			mp4: string;
		};
		downsized_still: DownsizedImage;
		fixed_height: FixedHeightImage;
		fixed_height_downsampled: FixedHeightImage;
		fixed_height_small: FixedHeightImage;
		fixed_height_small_still: DownsizedImage;
		fixed_height_still: DownsizedImage;
		fixed_width: FixedHeightImage;
		fixed_width_downsampled: FixedHeightImage;
		fixed_width_small: FixedHeightImage;
		fixed_width_small_still: DownsizedImage;
		fixed_width_still: DownsizedImage;
		looping: {
			mp4_size: string;
			mp4: string;
		};
		original_still: DownsizedImage;
		original_mp4: {
			height: string;
			width: string;
			mp4_size: string;
			mp4: string;
		};
		preview: {
			height: string;
			width: string;
			mp4_size: string;
			mp4: string;
		};
		preview_gif: {
			height: string;
			width: string;
			size: string;
			url: string;
		};
		preview_webp: {
			height: string;
			width: string;
			size: string;
			url: string;
		};
		'480w_still': DownsizedImage;
		// Thêm các trường còn lại tương tự
	};
	user: User;
	analytics_response_payload: string;
	analytics: Analytics;
	alt_text: string;
};
