import { RealtimeChannel } from "@supabase/supabase-js";
import { useContext, useEffect } from "react";
import { ONLINE_TYPE } from "../../components/rightbar/online/online.types";
import { OnlineContext } from "../../context/onlineContext";
import { supabase } from "../../supabase/db";

const useOnlineChannel = (userId: number) => {
	const { isOnline, setOnlineData } = useContext(OnlineContext);

	useEffect(() => {
		let roomOne: RealtimeChannel;
		const userData = {
			user_id: userId,
			online_at: new Date().toISOString(),
		};

		if (isOnline === true) {
			roomOne = supabase.channel("room_01");

			roomOne
				.on("presence", { event: "sync" }, () => {
					const newState = roomOne.presenceState();
					const array = Object.values(newState)
						.flatMap((arr) => arr)
						.map((user) => user) as ONLINE_TYPE;

					setOnlineData(array);
				})
				.subscribe();

			roomOne.track(userData);
		}

		return () => {
			if (roomOne) {
				roomOne.untrack(userData);
				roomOne.unsubscribe();
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isOnline, userId]);
};

export default useOnlineChannel;
