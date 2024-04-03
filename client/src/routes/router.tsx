import { createBrowserRouter } from "react-router-dom";
import App from "../App";

import ErrorPage from "../pages/error/error";
import Login from "../pages/login/login";
import {
	Explore,
	FindPeople,
	Friends,
	Home,
	MobileRightbar,
	Profile,
	Register,
	SinglePost,
	Suspense,
} from "./lazyRoutes";
import { ProtectedRoute } from "./protectedRoute";

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
				element: (
					<Suspense>
						<Home />
					</Suspense>
				),
			},
			{
				path: "/profile/:id",
				element: (
					<Suspense>
						<Profile />
					</Suspense>
				),
			},
			{
				path: "/friends",
				element: (
					<Suspense>
						<Friends />
					</Suspense>
				),
			},
			{
				path: "/findPeople",
				element: (
					<Suspense>
						<FindPeople />
					</Suspense>
				),
			},
			{
				path: "/explore",
				element: (
					<Suspense>
						<Explore />
					</Suspense>
				),
			},
			{
				path: "/post/:postId",
				element: (
					<Suspense>
						<SinglePost />
					</Suspense>
				),
			},
			{
				path: "/activities",
				element: (
					<Suspense>
						<MobileRightbar />
					</Suspense>
				),
			},
		],
	},
	{
		path: "/login",
		element: <Login />,
	},
	{
		path: "/register",
		element: (
			<Suspense>
				<Register />
			</Suspense>
		),
	},
]);

export default router;
