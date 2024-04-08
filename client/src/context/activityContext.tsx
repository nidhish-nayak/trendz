import { ReactNode, createContext, useState } from "react";
import { REALTIME_TYPE } from "../components/rightbar/activity/activity.types";

type ACTIVITY_CONTEXT_TYPES = {
    isRealtime: boolean;
    setIsRealtime: (status: boolean) => void;
    activity: REALTIME_TYPE | null;
    setActivity: (activity: REALTIME_TYPE | null) => void;
    prevActivity: REALTIME_TYPE | null;
    setPrevActivity: (activity: REALTIME_TYPE | null) => void;
};

export const ActivityContext = createContext<ACTIVITY_CONTEXT_TYPES>({
    isRealtime: false,
    setIsRealtime: () => {},
    activity: null,
    setActivity: () => {},
    prevActivity: null,
    setPrevActivity: () => {},
});

export const ActivityProvider = ({ children }: { children: ReactNode }) => {
    const [isRealtime, setIsRealtimeState] = useState(false);
    const [activity, setActivityState] = useState<REALTIME_TYPE | null>(null);
    const [prevActivity, setPrevActivityState] = useState<REALTIME_TYPE | null>(
        null
    );

    const setIsRealtime = (status: boolean) => {
        setIsRealtimeState(status);
    };

    const setActivity = (activity: REALTIME_TYPE | null) => {
        setActivityState(activity);
    };

    const setPrevActivity = (activity: REALTIME_TYPE | null) => {
        setPrevActivityState(activity);
    };

    const value = {
        isRealtime,
        setIsRealtime,
        activity,
        prevActivity,
        setActivity,
        setPrevActivity,
    };

    return (
        <ActivityContext.Provider value={value}>
            {children}
        </ActivityContext.Provider>
    );
};
