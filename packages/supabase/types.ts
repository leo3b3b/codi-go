export type School = {
	id: string;
	name: string;
};

export type ClassRoom = {
	id: string;
	name: string;
	school_id: string;
	teacher_id: string | null;
};

export type Student = {
	id: string;
	name: string;
	level: number | null;
};
