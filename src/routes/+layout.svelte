<script lang="ts">
	import { onMount } from 'svelte';
	import { sessionStore } from '$lib/stores/session';
	import { createSession, loadSessionByCode } from './session.remote';
	import './layout.css';

	onMount(async () => {
		// Load session code from localStorage
		sessionStore.loadFromStorage();

		// Subscribe once to check if we need to create a session
		let unsubscribe: (() => void) | null = null;
		unsubscribe = sessionStore.subscribe(async (state) => {
			if (!state.code) {
				if (unsubscribe) unsubscribe();
				try {
					const result = await createSession();
					if (result) {
						sessionStore.setCode(result.code);
						// Load session data
						const session = await loadSessionByCode(result.code);
						if (session) {
							sessionStore.updateProgress(session.completedDays, session.lastCompletedDay);
						}
					}
				} catch (error) {
					console.error('Error creating session:', error);
				}
			} else {
				if (unsubscribe) unsubscribe();
				// Load existing session data
				try {
					const session = await loadSessionByCode(state.code);
					if (session) {
						sessionStore.updateProgress(session.completedDays, session.lastCompletedDay);
					}
				} catch (error) {
					console.error('Error loading session:', error);
				}
			}
		});
	});
</script>

<slot />
