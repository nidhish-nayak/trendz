// HELPERS
type RETURN_TYPE = { userId?: number; token?: string; status: number };

// MAIN TYPES
export type MANUAL_INPUT_DATA_TYPES = {
	name?: string | boolean | number | null | undefined;
	email?: string | boolean | number | null | undefined;
	username: string | boolean | number | null | undefined;
	password: string | boolean | number | null | undefined;
};

export type MANUAL_AUTH_RETURN_TYPES = Promise<RETURN_TYPE>;

export type POST_TYPE = {
	id: number;
	desc: string;
	img: string;
	userId: number;
	createdAt: string;
	name: string;
	profilePic: string;
};

export type FOLLOWING_TYPES = {
	id: number;
	name: string;
	username: string;
	profilePic: string | null;
};
