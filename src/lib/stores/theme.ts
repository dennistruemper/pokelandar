import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export type Theme = 'red' | 'blue';

const THEME_KEY = 'pokelandar_theme';

function createThemeStore() {
	const { subscribe, set, update } = writable<Theme>('red');

	return {
		subscribe,
		setTheme: (theme: Theme) => {
			if (browser) {
				localStorage.setItem(THEME_KEY, theme);
				document.documentElement.setAttribute('data-theme', theme);
			}
			set(theme);
		},
		toggle: () => {
			update((current) => {
				const newTheme = current === 'red' ? 'blue' : 'red';
				if (browser) {
					localStorage.setItem(THEME_KEY, newTheme);
					document.documentElement.setAttribute('data-theme', newTheme);
				}
				return newTheme;
			});
		},
		loadFromStorage: () => {
			if (browser) {
				const stored = localStorage.getItem(THEME_KEY) as Theme | null;
				const theme = stored === 'red' || stored === 'blue' ? stored : 'red';
				document.documentElement.setAttribute('data-theme', theme);
				set(theme);
			}
		}
	};
}

export const themeStore = createThemeStore();

