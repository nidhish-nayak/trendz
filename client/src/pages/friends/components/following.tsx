import { HeartBrokenRounded, Search } from "@mui/icons-material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import Spinner from "../../../components/spinner/spinner";
import { AuthContext } from "../../../context/authContext";
import { axiosRequest } from "../../../utils/axios.utils";
import FriendsError from "../friends.error";
import "../friends.scss";
import { FOLLOWING_DATA_TYPES } from "../friends.types";

const Following = () => {
	const { currentUser } = useContext(AuthContext);
	const queryClient = useQueryClient();
	const [isSpin, setIsSpin] = useState(false);
	if (!currentUser) throw Error("User not found!");

	const [inputData, setInputData] = useState("");

	const filterFollowingData = (followingData: FOLLOWING_DATA_TYPES) => {
		const data = followingData.filter((following) => {
			const searchText = inputData.toLowerCase();
			const name = following.name.toLowerCase();
			const username = following.username.toLowerCase();
			return name.includes(searchText) || username.includes(searchText);
		});

		return data;
	};

	// Get Following Data
	const getFollowing = async () => {
		const res = await axiosRequest.get(`/friends/following`);
		return res.data;
	};

	const {
		isLoading: followingLoading,
		data: followingData,
		error: followingError,
	} = useQuery({
		queryKey: ["following"],
		queryFn: getFollowing,
	});

	// Unfollow User
	const unfollowMutation = useMutation({
		mutationFn: (followingId: number) =>
			axiosRequest.delete(`/relationships/${followingId}`),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["following"],
			});
			queryClient.invalidateQueries({
				queryKey: ["relationships", currentUser.id],
			});
			queryClient.invalidateQueries({
				queryKey: ["suggested"],
			});
			return setIsSpin(false);
		},
		onError(error) {
			setIsSpin(false);
			console.log(error);
			return alert("Unfollow user failed!");
		},
	});

	const handleUnfollow = (id: number) => {
		setIsSpin(true);
		unfollowMutation.mutate(id);
	};

	if (followingError || !followingData) {
		return (
			<FriendsError title="Following" error="Following data not found!" />
		);
	}

	if (followingLoading) {
		return <Spinner />;
	}

	if (!followingLoading && followingData) {
		const allFollowing = filterFollowingData(followingData);

		return (
			<div className="friends">
				<h3 className="friends-title">
					Following <span>(all people you follow)</span>
				</h3>
				<hr className="friends-divider" />
				<div className="friends-search">
					<div className="search-icon">
						<Search fontSize="small" />
					</div>
					<input
						type="text"
						placeholder="Search"
						onChange={(e) => {
							setInputData(e.target.value);
						}}
					/>
				</div>
				<div className="friends-list">
					{isSpin ? (
						<Spinner />
					) : (
						allFollowing.map((following) => (
							<div className="friend" key={following.id}>
								<div className="friend-data">
									<img
										src={following.profilePic}
										alt="friend-image"
										className="friend-image"
									/>
									<div className="friend-detail">
										<span
											className="detail-name"
											title={following.name}
										>
											<Link
												to={`/profile/${following.id}`}
												style={{
													textDecoration: "none",
													color: "inherit",
												}}
											>
												{following.name}
											</Link>
										</span>
										<span
											className="detail-username"
											title={following.username}
										>
											{following.username}
										</span>
									</div>
								</div>
								<div
									className="friend-status"
									onClick={() => handleUnfollow(following.id)}
								>
									<div className="unfollow-icon">
										<HeartBrokenRounded />
									</div>
									<span className="unfollow-text">
										Unfollow!
									</span>
									<span className="unfollow-text-hover">
										Unfollow!
									</span>
								</div>
							</div>
						))
					)}
				</div>
			</div>
		);
	}
};

export default Following;
