import { connectToDatabase } from '$lib/server/db';
import type { Question } from '$lib/types/question';

export async function load() {
	try {
		const db = await connectToDatabase();
		const questions = await db
			.collection<Question>('questions')
			.find({ day: { $exists: true, $gte: 1, $lte: 24 } })
			.toArray();

		const daysWithQuestions = questions.map((q) => q.day).filter((day): day is number => day !== undefined);
		const currentDay = new Date().getDate();

		return {
			days: daysWithQuestions.sort((a, b) => a - b),
			currentDay
		};
	} catch (error) {
		console.error('Error fetching days:', error);
		const currentDay = new Date().getDate();
		return {
			days: [],
			currentDay
		};
	}
}

