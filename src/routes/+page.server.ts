import { CALENDAR_START_DATE } from '$lib/constants';
import { connectToDatabase } from '$lib/server/db';
import type { Question } from '$lib/types/question';

export async function load() {
	try {
		const db = await connectToDatabase();
		const questions = await db
			.collection<Question>('questions')
			.find({ day: { $exists: true, $gte: 1, $lte: 24 } })
			.toArray();

		const daysWithQuestions = questions
			.map((q) => q.day)
			.filter((day): day is number => day !== undefined);

		// Check if calendar has started
		const now = new Date();
		let currentDay = 0; // Default to 0 (disabled) if before start date

		if (now >= CALENDAR_START_DATE) {
			// Only calculate current day if we're past the start date
			currentDay = now.getDate();
		}

		return {
			days: daysWithQuestions.sort((a, b) => a - b),
			currentDay
		};
	} catch (error) {
		console.error('Error fetching days:', error);
		const now = new Date();
		const currentDay = now >= CALENDAR_START_DATE ? now.getDate() : 0;
		return {
			days: [],
			currentDay
		};
	}
}
