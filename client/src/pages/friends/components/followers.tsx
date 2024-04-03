import { useQuery } from "@tanstack/react-query";
import { useContext, useState } from "react";

import { AuthContext } from "../../../context/authContext";
import { axiosRequest } from "../../../utils/axios.utils";
import { FOLLOWERS_DATA_TYPES } from "../friends.types";

import { AccountBox, Search } from "@mui/icons-material";
import { Link } from "react-router-dom";
import Spinner from "../../../components/spinner/spinner";
import FriendsError from "../friends.error";
import "../friends.scss";

const Followers = () => {
	const { currentUser } = useContext(AuthContext);
	if (!currentUser) throw Error("User not found!");

	const [inputData, setInputData] = useState("");

	const filterFollowersData = (followersData: FOLLOWERS_DATA_TYPES) => {
		const data = followersData.filter((follower) => {
			const searchText = inputData.toLowerCase();
			const name = follower.name.toLowerCase();
			const username = follower.username.toLowerCase();
			return name.includes(searchText) || username.includes(searchText);
		});

		return data;
	};

	// // Get Followers Data
	const getFollowers = async (): Promise<FOLLOWERS_DATA_TYPES> => {
		const res = await axiosRequest.get(`/friends/followers`);
		return res.data;
	};

	const {
		isLoading: followersLoading,
		data: followersData,
		error: followersError,
	} = useQuery({
		queryKey: ["relationships", "followers", currentUser.id],
		queryFn: getFollowers,
	});

	if (followersError || !followersData)
		return (
			<FriendsError title="Followers" error="Followers data not found!" />
		);

	if (followersLoading) {
		return <Spinner />;
	}

	if (!followersLoading && followersData) {
		const followers = filterFollowersData(followersData);

		return (
			<div className="friends">
				<h3 className="friends-title">
					Followers <span>(people who follow you)</span>
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
					{followers.map((follower) => (
						<div className="friend" key={follower.id}>
							<div className="friend-data">
								<img
									src={follower.profilePic}
									alt="friend-image"
									className="friend-image"
								/>
								<div className="friend-detail">
									<span
										className="detail-name"
										title={follower.name}
									>
										<Link
											to={`/profile/${follower.id}`}
											style={{
												textDecoration: "none",
												color: "inherit",
											}}
										>
											{follower.name}
										</Link>
									</span>
									<span
										className="detail-username"
										title={follower.username}
									>
										{follower.username}
									</span>
								</div>
							</div>
							<Link
								to={`/profile/${follower.id}`}
								style={{
									textDecoration: "none",
									color: "inherit",
								}}
							>
								<div className="friend-status-back">
									<div className="unfollow-icon">
										<AccountBox />
									</div>
									<span className="unfollow-text">
										Profile
									</span>
								</div>
							</Link>
						</div>
					))}
				</div>
			</div>
		);
	}
};

export default Followers;
