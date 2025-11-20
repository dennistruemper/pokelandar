import { query } from '$app/server';
import { connectToDatabase } from '$lib/server/db';
import { generatePokemonCode, isValidPokemonCode } from '$lib/server/pokemon-codes';
import type { Session } from '$lib/types/session';

/**
 * Creates a new session with a Pokemon code
 */
export const createSession = query(async () => {
	try {
		const db = await connectToDatabase();
		const collection = db.collection<Session>('sessions');

		// Generate a unique Pokemon code
		let code: string;
		let exists = true;
		let attempts = 0;
		while (exists && attempts < 10) {
			code = generatePokemonCode();
			const existing = await collection.findOne({ code });
			if (!existing) {
				exists = false;
			}
			attempts++;
		}

		if (exists) {
			throw new Error('Failed to generate unique code');
		}

		const now = new Date();
		const session: Session = {
			code: code!,
			completedDays: [],
			lastCompletedDay: 0,
			createdAt: now,
			updatedAt: now
		};

		const result = await collection.insertOne(session);

		return {
			sessionId: result.insertedId.toString(),
			code: code!
		};
	} catch (error) {
		console.error('Error creating session:', error);
		throw error;
	}
});

/**
 * Loads a session by Pokemon code
 */
export const loadSessionByCode = query('unchecked', async (code: unknown) => {
	if (typeof code !== 'string' || !isValidPokemonCode(code)) {
		return null;
	}

	try {
		const db = await connectToDatabase();
		const collection = db.collection<Session>('sessions');

		const session = await collection.findOne({ code });

		if (!session) {
			return null;
		}

		return {
			sessionId: session._id?.toString(),
			code: session.code,
			completedDays: session.completedDays,
			lastCompletedDay: session.lastCompletedDay
		};
	} catch (error) {
		console.error('Error loading session:', error);
		return null;
	}
});

/**
 * Validates a Pokemon code format
 */
export const validatePokemonCode = query('unchecked', async (code: unknown) => {
	if (typeof code !== 'string') {
		return false;
	}
	return isValidPokemonCode(code);
});

/**
 * Creates a new session with a specific Pokemon code
 */
export const createSessionWithCode = query('unchecked', async (code: unknown) => {
	if (typeof code !== 'string' || !isValidPokemonCode(code)) {
		return null;
	}

	try {
		const db = await connectToDatabase();
		const collection = db.collection<Session>('sessions');

		// Check if code already exists
		const existing = await collection.findOne({ code });
		if (existing) {
			// Return existing session
			return {
				sessionId: existing._id?.toString(),
				code: existing.code,
				completedDays: existing.completedDays,
				lastCompletedDay: existing.lastCompletedDay
			};
		}

		// Create new session with the provided code
		const now = new Date();
		const session: Session = {
			code,
			completedDays: [],
			lastCompletedDay: 0,
			createdAt: now,
			updatedAt: now
		};

		const result = await collection.insertOne(session);

		return {
			sessionId: result.insertedId.toString(),
			code: code
		};
	} catch (error) {
		console.error('Error creating session with code:', error);
		return null;
	}
});

/**
 * Marks a day as completed for a session
 */
export const completeDay = query('unchecked', async (params: unknown) => {
	if (!params || typeof params !== 'object') {
		return { success: false, error: 'Invalid parameters' };
	}
	const { sessionCode, day } = params as { sessionCode: unknown; day: unknown };
	if (typeof sessionCode !== 'string' || typeof day !== 'number' || day < 1 || day > 24) {
		return { success: false, error: 'Invalid parameters' };
	}

	try {
		const db = await connectToDatabase();
		const collection = db.collection<Session>('sessions');

		const session = await collection.findOne({ code: sessionCode });

		if (!session) {
			return { success: false, error: 'Session not found' };
		}

		// Check if previous day is completed (unless it's day 1)
		if (day > 1 && !session.completedDays.includes(day - 1)) {
			return {
				success: false,
				error: 'Previous day must be completed first',
				requiredDay: day - 1
			};
		}

		// Add day to completedDays if not already there
		const updatedCompletedDays = session.completedDays.includes(day)
			? session.completedDays
			: [...session.completedDays, day].sort((a, b) => a - b);

		const lastCompletedDay = Math.max(session.lastCompletedDay, day);

		await collection.updateOne(
			{ code: sessionCode },
			{
				$set: {
					completedDays: updatedCompletedDays,
					lastCompletedDay,
					updatedAt: new Date()
				}
			}
		);

		return {
			success: true,
			completedDays: updatedCompletedDays,
			lastCompletedDay
		};
	} catch (error) {
		console.error('Error completing day:', error);
		return { success: false, error: 'Failed to complete day' };
	}
});

/**
 * Checks if a day can be accessed (previous day completed)
 */
export const canAccessDay = query('unchecked', async (params: unknown) => {
	if (!params || typeof params !== 'object') {
		return { canAccess: false, reason: 'Invalid parameters' };
	}
	const { sessionCode, day } = params as { sessionCode: unknown; day: unknown };
	if (typeof sessionCode !== 'string' || typeof day !== 'number' || day < 1 || day > 24) {
		return { canAccess: false, reason: 'Invalid parameters' };
	}

	try {
		const db = await connectToDatabase();
		const collection = db.collection<Session>('sessions');

		const session = await collection.findOne({ code: sessionCode });

		if (!session) {
			return { canAccess: false, reason: 'Session not found' };
		}

		// Day 1 is always accessible
		if (day === 1) {
			return { canAccess: true };
		}

		// Check if previous day is completed
		const previousDayCompleted = session.completedDays.includes(day - 1);

		return {
			canAccess: previousDayCompleted,
			reason: previousDayCompleted ? undefined : 'Previous day not completed',
			requiredDay: previousDayCompleted ? undefined : day - 1
		};
	} catch (error) {
		console.error('Error checking day access:', error);
		return { canAccess: false, reason: 'Error checking access' };
	}
});
