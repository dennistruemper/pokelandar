import { connectToDatabase } from '$lib/server/db';
import type { Question } from '$lib/types/question';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	try {
		const db = await connectToDatabase();
		const questions = await db.collection<Question>('questions').find({}).toArray();

		// Convert MongoDB _id to string for JSON serialization
		const questionsWithStringIds = questions.map((q) => ({
			...q,
			_id: q._id?.toString() || undefined
		}));

		return json(questionsWithStringIds);
	} catch (error) {
		console.error('Error fetching questions:', error);
		return json({ error: 'Failed to fetch questions' }, { status: 500 });
	}
};
