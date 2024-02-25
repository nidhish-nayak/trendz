const config = {
    serverUrl:
        import.meta.env.MODE === "production"
            ? import.meta.env.VITE_SERVER_URL
            : import.meta.env.VITE_LOCAL_SERVER_URL,
    clientUrl:
        import.meta.env.MODE === "production"
            ? import.meta.env.VITE_CLIENT_URL
            : import.meta.env.VITE_LOCAL_CLIENT_URL,
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
    guestUser: {
        username: "guest",
        password: "password",
    },
};

export default config;
