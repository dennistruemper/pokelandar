import { query } from '$app/server';
import { connectToDatabase } from '$lib/server/db';
import type { Question } from '$lib/types/question';
import { error } from '@sveltejs/kit';
import { CALENDAR_START_DATE } from '$lib/constants';

export const getDaysWithQuestions = query(async () => {
	try {
		const db = await connectToDatabase();
		const questions = await db
			.collection<Question>('questions')
			.find({ day: { $exists: true, $gte: 1, $lte: 24 } })
			.toArray();

		// Return only the day numbers that have questions
		const daysWithQuestions = questions.map((q) => q.day).filter((day): day is number => day !== undefined);

		console.log(`Found ${questions.length} questions with days:`, daysWithQuestions);

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
});

export const getQuestionsForDay = query(
	'unchecked',
	async (day: unknown) => {
		// Validate day parameter
		if (typeof day !== 'number' || day < 1 || day > 24) {
			throw error(400, 'Invalid day parameter');
		}

		try {
			const db = await connectToDatabase();
			const questions = await db
				.collection<Question>('questions')
				.find({ day })
				.toArray();

			// Return questions without answers and rewards
			return questions.map((q) => ({
				_id: q._id?.toString(),
				question: q.question,
				day: q.day
			}));
		} catch (error) {
			console.error('Error fetching questions for day:', error);
			return [];
		}
	}
);

