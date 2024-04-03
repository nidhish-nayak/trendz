const config = {
	serverUrl:
		import.meta.env.MODE === "production"
			? import.meta.env.VITE_SERVER_URL
			: import.meta.env.VITE_LOCAL_SERVER_URL,
	clientUrl:
		import.meta.env.MODE === "production"
			? import.meta.env.VITE_CLIENT_URL
			: import.meta.env.VITE_LOCAL_CLIENT_URL,
	supabase: {
		db_url: import.meta.env.VITE_SUPABASE_URL,
		db_key: import.meta.env.VITE_SUPABASE_KEY,
	},
	s3: {
		folders: {
			posts: "posts",
			profiles: {
				covers: "profiles/covers",
				users: "profiles/users",
			},
			stories: "stories",
		},
	},
	guestCredentials: {
		username: import.meta.env.VITE_GUEST_USERNAME,
		password: import.meta.env.VITE_GUEST_PASSWORD,
	},
};

export default config;
