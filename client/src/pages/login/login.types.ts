export type LoginTypes = {
	username: string;
	password: string;
};

export type LoginResponseTypes = {
	isLoggedIn: boolean;
	response: string | null;
};
