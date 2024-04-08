import React, { ReactNode, lazy } from "react";
import Spinner from "../components/spinner/spinner";

// Lazy loaded components
export const Home = lazy(() => import("../pages/home/home"));
export const Profile = lazy(() => import("../pages/profile/profile"));
export const Friends = lazy(() => import("../pages/friends/friends"));
export const FindPeople = lazy(() => import("../pages/findPeople/findPeople"));
export const Explore = lazy(() => import("../pages/explore/explore"));
export const SinglePost = lazy(
    () => import("../pages/explore/components/singlePost")
);
export const Register = lazy(() => import("../pages/register/register"));
export const MobileRightbar = lazy(
    () => import("../components/rightbar/mobile/mobileRightbar")
);

// Reusable suspense wrapper
export const Suspense = ({ children }: { children: ReactNode }) => {
    return <React.Suspense fallback={<Spinner />}>{children}</React.Suspense>;
};
