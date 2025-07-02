export interface ThemeConfig {
	name: string;
	displayName: string;
	cssFile: string;
	color: string;
}

export const AVAILABLE_THEMES: ThemeConfig[] = [
	{
		name: 'dark',
		displayName: 'Dark Theme',
		color: 'linear-gradient(135deg, #1e3c72, #1e3c72)',
		cssFile: 'assets/themes/dark.css'
	},
	{
		name: 'light',
		displayName: 'Light Theme',
		color: 'linear-gradient(135deg, #f5f7fa, #c3cfe2)',
		cssFile: 'assets/themes/light.css'
	},
	{
		name: 'cyber',
		displayName: 'Cyber Theme',
		color: 'linear-gradient(135deg, #1e3c72, #1e3c72)',
		cssFile: 'assets/themes/cyber.css'
	},

	{
		name: 'green_meadow',
		displayName: 'Green Meadow',
		color: `linear-gradient(
		  hsl(0 calc(1*0%) 100% / 0.47843137254901963), 
		  hsl(0 calc(1*0%) 100% / 0.47843137254901963)
		),
		linear-gradient(
		  180deg,
		  hsl(165.625 calc(1*39.669%) 52.549% / 1) 6.15%,
		  hsl(118.681 calc(1*40.444%) 55.882% / 1) 48.7%,
		  hsl(86.667 calc(1*48.293%) 59.804% / 1) 93.07%
		)`,
		cssFile: 'assets/themes/green_meadow.css'
	},
	{
		name: 'soft_peach',
		displayName: 'Soft Peach',
		color: 'linear-gradient(135deg, #ffafbd, #ffc3a0)',
		cssFile: 'assets/themes/soft_peach.css'
	},
	{
		name: 'lavender_mist',
		displayName: 'Lavender Mist',
		color: 'linear-gradient(135deg, #c9d6ff, #e2e2e2)',
		cssFile: 'assets/themes/lavender_mist.css'
	},
	{
		name: 'cloud_white',
		displayName: 'Cloud White',
		color: 'linear-gradient(135deg, #f5f7fa, #c3cfe2)',
		cssFile: 'assets/themes/cloud_white.css'
	},
	{
		name: 'pink_blossom',
		displayName: 'Pink Blossom',
		color: 'linear-gradient(135deg, #ffdde1, #ee9ca7)',
		cssFile: 'assets/themes/pink_blossom.css'
	},
	{
		name: 'purple_haze',
		displayName: 'Purple Haze',
		color: 'linear-gradient(135deg, #e0c3fc, #8ec5fc)',
		cssFile: 'assets/themes/purple_haze.css'
	},
	{
		name: 'redDark',
		displayName: 'Red Dark',
		color: 'linear-gradient(135deg, #a1c4fd, #c2e9fb)',
		cssFile: 'assets/themes/redDark.css'
	},
	{
		name: 'Abyss Dark',
		displayName: 'Abyss Dark',
		color: 'linear-gradient(135deg, #f6d365, #fda085)',
		cssFile: 'assets/themes/abyss_dark_.css'
	}
];

let currentThemeLink: HTMLLinkElement | null = null;

export class ThemeManager {
	static async loadTheme(themeName: string): Promise<void> {
		const theme = AVAILABLE_THEMES.find((t) => t.name === themeName);
		if (!theme) {
			console.warn(`Theme "${themeName}" not found`);
			return;
		}

		try {
			if (currentThemeLink) {
				currentThemeLink.remove();
				currentThemeLink = null;
			}

			const link = document.createElement('link');
			link.rel = 'stylesheet';
			link.href = theme.cssFile;
			link.id = `theme-${themeName}`;

			document.head.appendChild(link);
			currentThemeLink = link;

			await new Promise((resolve, reject) => {
				link.onload = resolve;
				link.onerror = reject;
			});

			localStorage.setItem('current-theme', themeName);
		} catch (error) {
			console.error(`Failed to load theme "${themeName}":`, error);
		}
	}

	static getCurrentTheme(): string {
		return localStorage.getItem('current-theme') || 'dark';
	}

	static async initializeTheme(): Promise<void> {
		const currentTheme = this.getCurrentTheme();
		await this.loadTheme(currentTheme);
	}

	static getAvailableThemes(): ThemeConfig[] {
		return AVAILABLE_THEMES;
	}
}
