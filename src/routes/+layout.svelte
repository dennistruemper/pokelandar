<script lang="ts">
	import { onMount } from 'svelte';
	import { sessionStore } from '$lib/stores/session';
	import { themeStore } from '$lib/stores/theme';
	import { createSession, loadSessionByCode } from './session.remote';
	import './layout.css';

	let currentTheme = $state<'red' | 'blue'>('red');

	onMount(async () => {
		// Load theme from localStorage
		themeStore.loadFromStorage();
		themeStore.subscribe((theme) => {
			currentTheme = theme;
		});

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

<!-- Theme Toggle -->
<div class="fixed top-2 right-2 sm:top-4 sm:right-4 z-50">
	<button
		onclick={() => themeStore.toggle()}
		class="rounded-full p-2 sm:p-3 shadow-lg transition-all hover:scale-110"
		style="background-color: var(--theme-primary); color: white;"
		title="Wechsle zwischen Pokémon Rot und Blau"
	>
		{#if currentTheme === 'red'}
			<span class="text-lg sm:text-xl">🔴</span>
		{:else}
			<span class="text-lg sm:text-xl">🔵</span>
		{/if}
	</button>
</div>

<slot />
