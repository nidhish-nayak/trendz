import { useState } from "react";
import { supabase } from "../../../supabase/db";
import "../rightbar.scss";
import { REALTIME_TYPE } from "./activity.types";

const Activity = () => {
    const [my, setMy] = useState<REALTIME_TYPE | null>(null);
    const channels = supabase
        .channel("inserted-post")
        .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "posts" },
            (payload) => {
                setMy(payload);
                return console.log("Inserted post", payload);
            }
        )
        .subscribe();
    console.log(my);

    return (
        <div className="item">
            <span>Latest Activities</span>
            <div className="user">
                <div className="userInfo">
                    <img
                        src="https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600"
                        alt="user-image"
                    />
                    <div className="activity-container">
                        <div>
                            <span className="user-name" title="username">
                                John Doe
                            </span>
                            <p className="user-time">1 min ago</p>
                        </div>
                        <p className="user-activity">
                            {my?.new.id} Posted new post!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Activity;
