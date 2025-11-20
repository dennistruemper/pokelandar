export interface Question {
	_id?: string;
	question: string;
	answer: string;
	reward: string;
	day: number; // Day of the month (1-24)
	createdAt?: Date;
	updatedAt?: Date;
}
