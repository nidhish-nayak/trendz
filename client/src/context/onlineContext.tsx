import { ReactNode, createContext, useState } from "react";
import { ONLINE_TYPE } from "../components/rightbar/online/online.types";

type ONLINE_CONTEXT_TYPES = {
    isOnline: boolean;
    setIsOnline: (status: boolean) => void;
    onlineData: ONLINE_TYPE | null;
    setOnlineData: (data: ONLINE_TYPE | null) => void;
    prevOnlineData: ONLINE_TYPE | null;
    setPrevOnlineData: (data: ONLINE_TYPE | null) => void;
};

export const OnlineContext = createContext<ONLINE_CONTEXT_TYPES>({
    isOnline: false,
    setIsOnline: () => {},
    onlineData: null,
    setOnlineData: () => {},
    prevOnlineData: null,
    setPrevOnlineData: () => {},
});

export const OnlineProvider = ({ children }: { children: ReactNode }) => {
    const [isOnline, setIsOnlineState] = useState(false);
    const [onlineData, setOnlineDataState] = useState<ONLINE_TYPE | null>(null);
    const [prevOnlineData, setPrevOnlineDataState] =
        useState<ONLINE_TYPE | null>(null);

    const setIsOnline = (status: boolean) => {
        setIsOnlineState(status);
    };

    const setOnlineData = (data: ONLINE_TYPE | null) => {
        setOnlineDataState(data);
    };

    const setPrevOnlineData = (data: ONLINE_TYPE | null) => {
        setPrevOnlineDataState(data);
    };

    const value = {
        isOnline,
        setIsOnline,
        onlineData,
        setOnlineData,
        prevOnlineData,
        setPrevOnlineData,
    };

    return (
        <OnlineContext.Provider value={value}>
            {children}
        </OnlineContext.Provider>
    );
};
