<script lang="ts">
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const daysWithQuestions: number[] = data?.days ?? [];
	const currentDay = data?.currentDay ?? new Date().getDate();

	function hasQuestion(day: number): boolean {
		if (!Array.isArray(daysWithQuestions)) return false;
		return daysWithQuestions.includes(day);
	}

	function isFutureDay(day: number): boolean {
		return day > currentDay;
	}

	function isToday(day: number): boolean {
		return day === currentDay;
	}

	function handleDayClick(day: number) {
		if (hasQuestion(day) && !isFutureDay(day)) {
			goto(`/day/${day}`);
		}
	}
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="mb-8 text-center text-3xl font-bold">Adventskalender</h1>

	<div class="grid grid-cols-4 gap-4 md:grid-cols-6 lg:grid-cols-8">
		{#each Array(24) as _, i}
			{@const day = i + 1}
			{@const hasQ = hasQuestion(day)}
			{@const isFuture = isFutureDay(day)}
			{@const isCurrentDay = isToday(day)}

			<button
				class="aspect-square rounded-lg border-2 p-4 text-center transition-all
					{isCurrentDay
					? 'border-blue-500 bg-blue-50 font-bold'
					: hasQ
						? 'cursor-pointer border-green-500 bg-green-50 hover:bg-green-100'
						: 'border-gray-300 bg-gray-50'}
					{isFuture ? 'cursor-not-allowed opacity-50' : ''}"
				disabled={isFuture || !hasQ}
				type="button"
				onclick={() => handleDayClick(day)}
			>
				<div class="mb-1 text-2xl font-semibold">{day}</div>
				{#if hasQ}
					<div class="text-xs text-green-600">✓</div>
				{:else}
					<div class="text-xs text-gray-400">—</div>
				{/if}
			</button>
		{/each}
	</div>
</div>
