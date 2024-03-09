import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import { AuthProvider } from "./context/authContext.tsx";
import { DarkModeProvider } from "./context/darkModeContext.tsx";
import { PostProvider } from "./context/postContext.tsx";
import { ProfileProvider } from "./context/profileContext.tsx";
import { SearchProvider } from "./context/searchContext.tsx";
import "./main.scss";
import router from "./routes/router.tsx";

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
    <React.StrictMode>
        <DarkModeProvider>
            <AuthProvider>
                <SearchProvider>
                    <PostProvider>
                        <ProfileProvider>
                            <RouterProvider router={router} />
                        </ProfileProvider>
                    </PostProvider>
                </SearchProvider>
            </AuthProvider>
        </DarkModeProvider>
    </React.StrictMode>
);
