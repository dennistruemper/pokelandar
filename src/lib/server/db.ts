import { MongoClient, Db } from 'mongodb';

// In Docker, use the service name 'mongodb', otherwise use 'localhost'
const mongoHost = process.env.MONGODB_HOST || (process.env.NODE_ENV === 'production' ? 'mongodb' : 'localhost');
const mongoUser = process.env.MONGODB_USER || 'admin';
const mongoPassword = process.env.MONGODB_PASSWORD || 'password';
const mongoAuthSource = process.env.MONGODB_AUTH_SOURCE || 'admin';

const uri = process.env.MONGODB_URI || `mongodb://${mongoUser}:${mongoPassword}@${mongoHost}:27017/pokelandar?authSource=${mongoAuthSource}`;
const dbName = process.env.MONGODB_DB_NAME || 'pokelandar';

let client: MongoClient | null = null;
let db: Db | null = null;

export async function connectToDatabase(): Promise<Db> {
	if (db) {
		return db;
	}

	if (!client) {
		client = new MongoClient(uri);
		await client.connect();
	}

	db = client.db(dbName);
	return db;
}

export async function closeDatabase(): Promise<void> {
	if (client) {
		await client.close();
		client = null;
		db = null;
	}
}

