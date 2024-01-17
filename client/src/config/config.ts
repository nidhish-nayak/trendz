const config = {
    serverUrl:
        import.meta.env.MODE === "production"
            ? import.meta.env.VITE_SERVER_URL
            : import.meta.env.VITE_LOCAL_SERVER_URL,
    clientUrl:
        import.meta.env.MODE === "production"
            ? import.meta.env.VITE_CLIENT_URL
            : import.meta.env.VITE_LOCAL_CLIENT_URL,
};

export default config;
