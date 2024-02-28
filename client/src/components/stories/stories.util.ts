import { GET_STORIES_TYPE } from "./stories.types";

export type GroupedStories = {
    userId: number;
    name: string;
    img: string[];
    createdAt: Date;
}[];

export const formatStories = (arr: GET_STORIES_TYPE): GroupedStories => {
    const groupedStories: { [key: number]: GroupedStories[number] } = {};

    arr.forEach((story) => {
        const { img, userId, createdAt, name } = story;
        if (!(userId in groupedStories)) {
            groupedStories[userId] = { userId, name, img: [], createdAt };
        }
        groupedStories[userId].img.push(img);
        if (groupedStories[userId].createdAt < createdAt) {
            groupedStories[userId].createdAt = createdAt;
        }
    });

    // Convert object of grouped stories to array
    const formattedStories: GroupedStories = Object.values(groupedStories);

    // Sort all groups by createdAt date in descending order
    formattedStories.reverse();

    return formattedStories;
};
