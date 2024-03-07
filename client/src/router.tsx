import { createBrowserRouter } from "react-router-dom";
import App from "./App";

import ErrorPage from "./pages/error/error";
import SinglePost from "./pages/explore/components/singlePost";
import Explore from "./pages/explore/explore";
import FindPeople from "./pages/findPeople/findPeople";
import Friends from "./pages/friends/friends";
import Home from "./pages/home/home";
import Login from "./pages/login/login";
import Profile from "./pages/profile/profile";
import Register from "./pages/register/register";
import { ProtectedRoute } from "./protectedRoute.util";

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
            {
                path: "/explore",
                element: <Explore />,
            },
            {
                path: "/post/:postId",
                element: <SinglePost />,
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

export default router;
