import { createClient } from "@supabase/supabase-js";

const dbConfig = {
	supabaseUrl: process.env.DB_URL,
	supabaseKey: process.env.DB_SERVICE_ROLE_KEY,
};

const supabase = createClient(dbConfig.supabaseUrl, dbConfig.supabaseKey);

const get_stories = async () => {
	try {
		const { data, error } = await supabase.from("stories").select("*");

		if (error) throw Error("Story deletion from DB failed!");
		return data;
	} catch (error) {
		throw Error("get story failed!");
	}
};

const get_old_stories = (stories) => {
	const now = new Date();
	const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // Date one week ago

	const old_stories = stories.filter((story) => {
		const createdAt = new Date(story.createdAt);
		return createdAt < oneWeekAgo; // Filter stories older than one week
	});

	return old_stories;
};

const delete_old_stories = async (ids) => {
	try {
		if (ids.length < 1) return "No stories to delete";

		const { data, error } = await supabase
			.from("stories")
			.delete()
			.in("id", ids);

		if (error) throw Error("Story deletion from DB failed!");
		return "Deletion of old stories successful!";
	} catch (error) {
		return "Delete old story failed!";
	}
};

export const handler = async (event) => {
	// GET ALL STORIES
	const stories = await get_stories();

	// GET STORIES OLDER THAN A WEEK
	const old_stories = get_old_stories(stories);
	const to_be_deleted_ids = old_stories.map((story) => story.id);

	// DELETE OLD STORIES
	const res = await delete_old_stories(to_be_deleted_ids);

	const response = {
		statusCode: 200,
		body: JSON.parse(JSON.stringify(res)),
	};

	return response;
};
