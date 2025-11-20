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
	},
	{
		_id: 'largest-ocean',
		question: 'What is the largest ocean on Earth?',
		answer: 'Pacific Ocean',
		reward: 'Brilliant!',
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'tallest-mountain',
		question: 'What is the tallest mountain in the world?',
		answer: 'Mount Everest',
		reward: 'Outstanding!',
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'longest-river',
		question: 'What is the longest river in the world?',
		answer: 'Nile River',
		reward: 'Fantastic!',
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'red-planet',
		question: 'Which planet is known as the Red Planet?',
		answer: 'Mars',
		reward: 'Amazing!',
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'water-formula',
		question: 'What is the chemical formula for water?',
		answer: 'H2O',
		reward: 'Superb!',
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'capital-japan',
		question: 'What is the capital of Japan?',
		answer: 'Tokyo',
		reward: 'Wonderful!',
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'fastest-land-animal',
		question: 'What is the fastest land animal?',
		answer: 'Cheetah',
		reward: 'Incredible!',
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'largest-desert',
		question: 'What is the largest desert in the world?',
		answer: 'Antarctica',
		reward: 'Excellent thinking!',
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'primary-colors',
		question: 'What are the three primary colors?',
		answer: 'Red, Blue, Yellow',
		reward: 'Great knowledge!',
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'largest-planet',
		question: 'What is the largest planet in our solar system?',
		answer: 'Jupiter',
		reward: 'Spectacular!',
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'capital-australia',
		question: 'What is the capital of Australia?',
		answer: 'Canberra',
		reward: 'Well remembered!',
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'human-bones',
		question: 'How many bones does an adult human have?',
		answer: '206',
		reward: 'Impressive!',
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'longest-day',
		question: 'Which day has the most hours of daylight in the Northern Hemisphere?',
		answer: 'June 21st (Summer Solstice)',
		reward: 'Clever answer!',
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'largest-mammal',
		question: 'What is the largest mammal in the world?',
		answer: 'Blue Whale',
		reward: 'Marvelous!',
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'capital-brazil',
		question: 'What is the capital of Brazil?',
		answer: 'Brasília',
		reward: 'Terrific!',
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'speed-of-light',
		question: 'What is the speed of light in a vacuum?',
		answer: '299,792,458 meters per second',
		reward: 'Scientific genius!',
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'largest-country',
		question: 'What is the largest country by land area?',
		answer: 'Russia',
		reward: 'Geographic master!',
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'deepest-ocean',
		question: 'What is the deepest point in the ocean?',
		answer: 'Mariana Trench',
		reward: 'Ocean expert!',
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'capital-egypt',
		question: 'What is the capital of Egypt?',
		answer: 'Cairo',
		reward: 'History buff!',
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'freezing-point',
		question: 'At what temperature does water freeze in Celsius?',
		answer: '0 degrees',
		reward: 'Perfect recall!',
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'largest-lake',
		question: 'What is the largest lake in the world?',
		answer: 'Caspian Sea',
		reward: 'Geography whiz!',
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'capital-canada',
		question: 'What is the capital of Canada?',
		answer: 'Ottawa',
		reward: 'North American expert!',
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		_id: 'planets-count',
		question: 'How many planets are in our solar system?',
		answer: '8',
		reward: 'Astronomy star!',
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
