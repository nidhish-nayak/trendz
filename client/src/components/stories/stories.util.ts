import { GET_STORIES_TYPE } from "./stories.types";

export type GROUPED_STORIES_TYPE = {
	userId: number;
	name: string;
	img: string[];
	createdAt: Date;
}[];

export const formatStories = (arr: GET_STORIES_TYPE): GROUPED_STORIES_TYPE => {
	const groupedStories: { [key: number]: GROUPED_STORIES_TYPE[number] } = {};

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
	const formattedStories: GROUPED_STORIES_TYPE =
		Object.values(groupedStories);

	// Sort all groups by createdAt date in descending order
	formattedStories.sort((a, b) => {
		const aTime = new Date(a.createdAt);
		const bTime = new Date(b.createdAt);
		return bTime.getTime() - aTime.getTime();
	});

	return formattedStories;
};
