import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import PersonRemoveAlt1Icon from "@mui/icons-material/PersonRemoveAlt1";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import Spinner from "../../../components/spinner/spinner";
import { AuthContext } from "../../../context/authContext";
import { axiosRequest } from "../../../utils/axios.utils";
import "../profile.scss";
import { FOLLOW_MUTATION_TYPE, FOLLOW_TYPE } from "../profile.types";

const FollowUser = () => {
	const { id } = useParams();
	const [isSpin, setIsSpin] = useState(false);
	const queryClient = useQueryClient();
	const [isFollowed, setIsFollowed] = useState(false);
	const { currentUser } = useContext(AuthContext);

	if (!currentUser || !id) throw Error("User/Profile not found!");

	// Get Followers Data
	const getFollowers = async () => {
		const res = await axiosRequest.get(`/relationships/${id}`);
		if (res.data.length === 0) setIsFollowed(false);
		else setIsFollowed(true);
		return res.data;
	};

	const { isLoading, data, error } = useQuery({
		queryKey: ["relationships", id],
		queryFn: getFollowers,
	});

	if (error) throw Error("getFollowers fetch failed!");

	// Mutate Followers Data
	const followMutation = useMutation({
		mutationFn: (followDetails: FOLLOW_MUTATION_TYPE) =>
			axiosRequest.post("/relationships", followDetails),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["relationships"] });
			return setIsSpin(false);
		},
		onError(error) {
			setIsSpin(false);
			console.log(error);
			return alert("Follow user failed!");
		},
	});

	const unfollowMutation = useMutation({
		mutationFn: () => axiosRequest.delete(`/relationships/${id}`),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["relationships"] });
			return setIsSpin(false);
		},
		onError(error) {
			setIsSpin(false);
			console.log(error);
			return alert("Unfollow user failed!");
		},
	});

	// Follow user
	const handleFollow = () => {
		setIsSpin(true);
		const followDetails = {
			followerUserId: currentUser.id,
			followedUserId: parseInt(id),
		};
		followMutation.mutate(followDetails);
	};

	// Unfollow User
	const handleUnfollow = () => {
		setIsSpin(true);
		unfollowMutation.mutate();
	};

	if (isLoading) {
		return <Spinner />;
	}

	if (currentUser!.id === parseInt(id!)) {
		const followerCount: FOLLOW_TYPE[] = data;
		return (
			<button className="follow-button">
				{followerCount.length} Followers
			</button>
		);
	}

	if (!isLoading && data) {
		return (
			<>
				{isFollowed ? (
					<button
						className="follow-button"
						style={{ backgroundColor: "crimson" }}
						onClick={handleUnfollow}
					>
						<PersonRemoveAlt1Icon fontSize="small" />
						Unfollow
					</button>
				) : (
					<button className="follow-button" onClick={handleFollow}>
						{isSpin ? (
							<Spinner />
						) : (
							<>
								<PersonAddAlt1Icon fontSize="small" />
								Follow
							</>
						)}
					</button>
				)}
			</>
		);
	}
};

export default FollowUser;
