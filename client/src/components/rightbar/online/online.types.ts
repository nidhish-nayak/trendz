// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ONLINE_TYPE = {
	online_at: string;
	user_id: number;
	presence_ref: string;
}[];

export type ONLINE_USERS = {
	id: number;
	name: string;
	username: string;
	profilePic: string;
}[];
