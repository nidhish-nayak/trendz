export type CommentsTypes = {
    id: number;
    desc: string;
    createdAt: Date;
    userId: number;
    postId: number;
    name: string;
    profilePic: string;
}[];

export type CommentsProps = {
    postId: number;
};
