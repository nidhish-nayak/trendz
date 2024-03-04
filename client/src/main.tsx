import React, { ReactNode, useContext } from "react";
import ReactDOM from "react-dom/client";
import {
    Navigate,
    RouterProvider,
    createBrowserRouter,
} from "react-router-dom";

import App from "./App.tsx";
import ErrorPage from "./pages/error/error.jsx";
import Home from "./pages/home/home.tsx";
import Login from "./pages/login/login.tsx";
import Profile from "./pages/profile/profile.tsx";
import Register from "./pages/register/register.tsx";

import { AuthContext, AuthProvider } from "./context/authContext.tsx";
import { DarkModeProvider } from "./context/darkModeContext.tsx";
import { PostProvider } from "./context/postContext.tsx";
import { ProfileProvider } from "./context/profileContext.tsx";
import { SearchProvider } from "./context/searchContext.tsx";
import "./main.scss";
import FindPeople from "./pages/findPeople/findPeople.tsx";
import Friends from "./pages/friends/friends.tsx";

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    const { currentUser } = useContext(AuthContext);

    if (!currentUser) {
        return <Navigate to="/login" />;
    }
    return children;
};

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <ProtectedRoute>
                <App />
            </ProtectedRoute>
        ),
        errorElement: <ErrorPage />,
        children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "/profile/:id",
                element: <Profile />,
            },
            {
                path: "/friends",
                element: <Friends />,
            },
            {
                path: "/findPeople",
                element: <FindPeople />,
            },
        ],
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/register",
        element: <Register />,
    },
]);

const root = ReactDOM.createRoot(document.getElementById("root")!);

import.meta.env.MODE === "production"
    ? root.render(
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
      )
    : root.render(
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
