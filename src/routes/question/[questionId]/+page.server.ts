import { connectToDatabase } from '$lib/server/db';
import type { Question } from '$lib/types/question';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
	const questionId = params.questionId;

	if (!questionId) {
		throw error(400, 'Question ID is required');
	}

	try {
		const db = await connectToDatabase();
		const question = await db.collection<Question>('questions').findOne({ _id: questionId });

		if (!question) {
			throw error(404, 'Question not found');
		}

		// Return question with answer and reward for the detail page
		return {
			question: {
				_id: question._id?.toString(),
				question: question.question,
				answer: question.answer,
				reward: question.reward,
				day: question.day
			}
		};
	} catch (err) {
		if (err && typeof err === 'object' && 'status' in err) {
			throw err;
		}
		console.error('Error fetching question:', err);
		throw error(500, 'Failed to fetch question');
	}
}

