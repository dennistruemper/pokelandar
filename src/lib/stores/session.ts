import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const SESSION_CODE_KEY = 'pokelandar_session_code';

export interface SessionState {
	code: string | null;
	completedDays: number[];
	lastCompletedDay: number;
}

function createSessionStore() {
	const { subscribe, set, update } = writable<SessionState>({
		code: null,
		completedDays: [],
		lastCompletedDay: 0
	});

	return {
		subscribe,
		setCode: (code: string) => {
			if (browser) {
				localStorage.setItem(SESSION_CODE_KEY, code);
			}
			update((state) => ({ ...state, code }));
		},
		loadFromStorage: () => {
			if (browser) {
				const stored = localStorage.getItem(SESSION_CODE_KEY);
				if (stored) {
					update((state) => ({ ...state, code: stored }));
				}
			}
		},
		updateProgress: (completedDays: number[], lastCompletedDay: number) => {
			update((state) => ({
				...state,
				completedDays,
				lastCompletedDay
			}));
		},
		clear: () => {
			if (browser) {
				localStorage.removeItem(SESSION_CODE_KEY);
			}
			set({
				code: null,
				completedDays: [],
				lastCompletedDay: 0
			});
		}
	};
}

export const sessionStore = createSessionStore();

