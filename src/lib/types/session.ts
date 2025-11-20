export interface Session {
	_id?: string;
	code: string; // e.g., "Glurak-Bisasam-Pikachu"
	completedDays: number[]; // Array of completed day numbers [1, 2, 3, ...]
	lastCompletedDay: number; // Last day that was completed
	createdAt: Date;
	updatedAt: Date;
}

