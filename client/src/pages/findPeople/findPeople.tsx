import { PersonAdd, Search } from "@mui/icons-material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChangeEvent, useContext, useState } from "react";
import { Link } from "react-router-dom";
import Spinner from "../../components/spinner/spinner";
import { AuthContext } from "../../context/authContext";
import { axiosRequest } from "../../utils/axios.utils";
import "../friends/friends.scss";
import { FOLLOW_MUTATION_TYPE } from "../profile/profile.types";
import { FIND_PEOPLE_DATA_TYPES } from "./findPeople.types";

const FindPeople = () => {
    const queryClient = useQueryClient();
    const { currentUser } = useContext(AuthContext);
    if (!currentUser) throw Error("User not found!");

    const [isSpin, setIsSpin] = useState(false);
    const [inputData, setInputData] = useState("");

    // Search filter
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInputData(e.target.value);
    };

    const filterFindPeopleData = (findPoepleData: FIND_PEOPLE_DATA_TYPES) => {
        const data = findPoepleData.filter((people) => {
            const searchText = inputData.toLowerCase();
            const name = people.name.toLowerCase();
            const username = people.username.toLowerCase();
            return name.includes(searchText) || username.includes(searchText);
        });

        return data;
    };

    // Mutate Followers Data
    const followMutation = useMutation({
        mutationFn: (followDetails: FOLLOW_MUTATION_TYPE) =>
            axiosRequest.post("/relationships", followDetails),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["relationships"],
            });
            queryClient.invalidateQueries({
                queryKey: ["users", currentUser.id],
            });
            queryClient.invalidateQueries({
                queryKey: ["suggested"],
            });
            return setIsSpin(false);
        },
        onError(error) {
            setIsSpin(false);
            console.log(error);
            return alert("Follow user failed!");
        },
    });

    const handleFollow = (peopleId: number) => {
        setIsSpin(true);
        const followDetails = {
            followerUserId: currentUser.id,
            followedUserId: peopleId,
        };

        followMutation.mutate(followDetails);
    };

    // GET FIND PEOPLE DATA
    const getFindPeople = async (): Promise<FIND_PEOPLE_DATA_TYPES> => {
        const res = await axiosRequest.get("/friends/findPeople");
        return res.data;
    };

    const { isLoading, data, error } = useQuery({
        queryKey: ["users", currentUser.id],
        queryFn: getFindPeople,
    });

    if (error) {
        return <div className="friends">Server fetch failed!</div>;
    }

    if (isLoading || !data) {
        return (
            <div className="friends">
                <Spinner />
            </div>
        );
    }

    if (!isLoading && data) {
        const findPeopleData = filterFindPeopleData(data);

        return (
            <div className="friends-container">
                <div className="friends">
                    <h3 className="friends-title">
                        Find People <span>(people you might know)</span>
                    </h3>
                    <hr className="friends-divider" />
                    <div className="friends-search">
                        <div className="search-icon">
                            <Search fontSize="small" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search"
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="friends-list">
                        {isSpin ? (
                            <Spinner />
                        ) : (
                            findPeopleData.map((people) => (
                                <div className="friend" key={people.id}>
                                    <div className="friend-data">
                                        <img
                                            src={people.profilePic}
                                            alt="friend-image"
                                            className="friend-image"
                                        />
                                        <div className="friend-detail">
                                            <span
                                                className="detail-name"
                                                title={people.name}
                                            >
                                                <Link
                                                    to={`/profile/${people.id}`}
                                                    style={{
                                                        textDecoration: "none",
                                                        color: "inherit",
                                                    }}
                                                >
                                                    {people.name}
                                                </Link>
                                            </span>
                                            <span
                                                className="detail-username"
                                                title={people.username}
                                            >
                                                {people.username}
                                            </span>
                                        </div>
                                    </div>
                                    <div
                                        className="friend-status-back"
                                        onClick={() => handleFollow(people.id)}
                                    >
                                        <div className="unfollow-icon">
                                            <PersonAdd />
                                        </div>
                                        <span className="unfollow-text">
                                            Follow
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        );
    }
};

export default FindPeople;
