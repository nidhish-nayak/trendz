const config = {
    serverUrl:
        import.meta.env.MODE === "development"
            ? import.meta.env.LOCAL_SERVER_URL
            : import.meta.env.SERVER_URL,
    clientUrl:
        import.meta.env.MODE === "development"
            ? import.meta.env.LOCAL_CLIENT_URL
            : import.meta.env.CLIENT_URL,
};

export default config;
