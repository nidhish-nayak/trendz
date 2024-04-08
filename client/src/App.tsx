import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useContext } from "react";
import { Outlet } from "react-router-dom";

import Leftbar from "./components/leftbar/leftbar";
import Navbar from "./components/navbar/navbar";
import Rightbar from "./components/rightbar/rightbar";

import { DarkModeContext } from "./context/darkModeContext";
import "./style.scss";

const App = () => {
    const queryClient = new QueryClient();
    const { darkMode } = useContext(DarkModeContext);

    return (
        <QueryClientProvider client={queryClient}>
            <div className={`theme-${darkMode ? "dark" : "light"}`}>
                <Navbar />
                <div className="main" style={{ display: "flex" }}>
                    <Leftbar />
                    <div className="outlet-container">
                        <Outlet />
                    </div>
                    <Rightbar />
                </div>
            </div>
        </QueryClientProvider>
    );
};

export default App;
