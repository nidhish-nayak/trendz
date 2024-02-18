export type USER_TYPES = {
    id: number;
    name: string;
    profilePic: string;
    email: string;
    username: string;
    website: string | null;
    city: string | null;
    coverPic: string;
};

export type FOLLOW_TYPE = {
    id: number;
    followerUserId: number;
    followedUserId: number;
};

export type FOLLOW_MUTATION_TYPE = {
    followerUserId: number;
    followedUserId: number;
};
