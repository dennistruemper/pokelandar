import { MongoClient } from 'mongodb';
import type { Question } from '../src/lib/types/question';

const uri =
	process.env.MONGODB_URI || 'mongodb://admin:password@localhost:27017/pokelandar?authSource=admin';
const dbName = process.env.MONGODB_DB_NAME || 'pokelandar';

type SeedQuestion = Omit<Question, '_id'> & { _id: string };

const sampleQuestions: SeedQuestion[] = [
	{
		_id: 'largest-animal',
		question: 'Which is the largest animal?',
		answer: 'Elephant',
		reward: 'Great job!',
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'capital-france',
		question: 'What is the capital of France?',
		answer: 'Paris',
		reward: "Awesome, that's correct!",
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'continent-count',
		question: 'How many continents are there?',
		answer: '7',
		reward: 'Excellent work!',
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'smallest-planet',
		question: 'What is the smallest planet in our solar system?',
		answer: 'Mercury',
		reward: 'Well done!',
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'two-plus-two',
		question: 'What is 2 + 2?',
		answer: '4',
		reward: 'Perfect!',
		createdAt: new Date(),
		updatedAt: new Date()
	}
];

async function seed() {
	const client = new MongoClient(uri);

	try {
		await client.connect();
		console.log('Connected to MongoDB');

		const db = client.db(dbName);
		const collection = db.collection<Question>('questions');

		for (const question of sampleQuestions) {
			const now = new Date();
			await collection.updateOne(
				{ _id: question._id },
				{
					$set: {
						question: question.question,
						answer: question.answer,
						reward: question.reward,
						updatedAt: now
					},
					$setOnInsert: {
						createdAt: question.createdAt ?? now
					}
				},
				{ upsert: true }
			);
		}

		console.log(`Upserted ${sampleQuestions.length} questions`);
	} catch (error) {
		console.error('Error seeding database:', error);
		// Don't exit with error code - let the app start anyway
		throw error;
	} finally {
		await client.close();
		console.log('Disconnected from MongoDB');
	}
}

seed();
