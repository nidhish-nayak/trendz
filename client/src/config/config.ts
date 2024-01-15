const config = {
    serverUrl:
        import.meta.env.MODE === "production"
            ? import.meta.env.SERVER_URL
            : import.meta.env.LOCAL_SERVER_URL,
    clientUrl:
        import.meta.env.MODE === "production"
            ? import.meta.env.CLIENT_URL
            : import.meta.env.LOCAL_CLIENT_URL,
};

export default config;
