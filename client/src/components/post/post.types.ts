export type PostTypes = {
    post: {
        id: number;
        userId: number;
        profilePic?: string;
        name: string;
        img?: string;
        desc: string;
        createdAt: Date;
    };
};

export type LikedPost = {
    postId: number;
    userId: number;
};
