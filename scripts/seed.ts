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
		day: 1,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'advent-calendar-start',
		question: 'On which date does Advent typically begin?',
		answer: 'December 1st',
		reward: 'Perfect start!',
		day: 1,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'first-month',
		question: 'What is the first month of the year?',
		answer: 'January',
		reward: 'Excellent!',
		day: 1,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'capital-france',
		question: 'What is the capital of France?',
		answer: 'Paris',
		reward: "Awesome, that's correct!",
		day: 2,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'continent-count',
		question: 'How many continents are there?',
		answer: '7',
		reward: 'Excellent work!',
		day: 3,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'smallest-planet',
		question: 'What is the smallest planet in our solar system?',
		answer: 'Mercury',
		reward: 'Well done!',
		day: 4,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'two-plus-two',
		question: 'What is 2 + 2?',
		answer: '4',
		reward: 'Perfect!',
		day: 5,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'largest-ocean',
		question: 'What is the largest ocean on Earth?',
		answer: 'Pacific Ocean',
		reward: 'Brilliant!',
		day: 6,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'tallest-mountain',
		question: 'What is the tallest mountain in the world?',
		answer: 'Mount Everest',
		reward: 'Outstanding!',
		day: 7,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'longest-river',
		question: 'What is the longest river in the world?',
		answer: 'Nile River',
		reward: 'Fantastic!',
		day: 8,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'red-planet',
		question: 'Which planet is known as the Red Planet?',
		answer: 'Mars',
		reward: 'Amazing!',
		day: 9,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'water-formula',
		question: 'What is the chemical formula for water?',
		answer: 'H2O',
		reward: 'Superb!',
		day: 10,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'capital-japan',
		question: 'What is the capital of Japan?',
		answer: 'Tokyo',
		reward: 'Wonderful!',
		day: 11,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'fastest-land-animal',
		question: 'What is the fastest land animal?',
		answer: 'Cheetah',
		reward: 'Incredible!',
		day: 12,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'largest-desert',
		question: 'What is the largest desert in the world?',
		answer: 'Antarctica',
		reward: 'Excellent thinking!',
		day: 13,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'primary-colors',
		question: 'What are the three primary colors?',
		answer: 'Red, Blue, Yellow',
		reward: 'Great knowledge!',
		day: 14,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'largest-planet',
		question: 'What is the largest planet in our solar system?',
		answer: 'Jupiter',
		reward: 'Spectacular!',
		day: 15,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'capital-australia',
		question: 'What is the capital of Australia?',
		answer: 'Canberra',
		reward: 'Well remembered!',
		day: 16,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'human-bones',
		question: 'How many bones does an adult human have?',
		answer: '206',
		reward: 'Impressive!',
		day: 17,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'longest-day',
		question: 'Which day has the most hours of daylight in the Northern Hemisphere?',
		answer: 'June 21st (Summer Solstice)',
		reward: 'Clever answer!',
		day: 18,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'largest-mammal',
		question: 'What is the largest mammal in the world?',
		answer: 'Blue Whale',
		reward: 'Marvelous!',
		day: 19,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'capital-brazil',
		question: 'What is the capital of Brazil?',
		answer: 'Brasília',
		reward: 'Terrific!',
		day: 20,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'speed-of-light',
		question: 'What is the speed of light in a vacuum?',
		answer: '299,792,458 meters per second',
		reward: 'Scientific genius!',
		day: 21,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'largest-country',
		question: 'What is the largest country by land area?',
		answer: 'Russia',
		reward: 'Geographic master!',
		day: 22,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'deepest-ocean',
		question: 'What is the deepest point in the ocean?',
		answer: 'Mariana Trench',
		reward: 'Ocean expert!',
		day: 23,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'capital-egypt',
		question: 'What is the capital of Egypt?',
		answer: 'Cairo',
		reward: 'History buff!',
		day: 24,
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
						day: question.day,
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
