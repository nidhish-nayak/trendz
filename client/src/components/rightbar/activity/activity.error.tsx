const ActivityError = ({ setFunction }: { setFunction: () => void }) => {
	return (
		<div className="item">
			<div className="item-container">
				<div className="item-title-realtime">Latest Activities</div>
				<div
					className="item-realtime"
					title="Realtime updates cause heavy load on servers. Default state is set to disabled."
					onClick={() => setFunction()}
				>
					<p className="realtime-title">Realtime</p>
					<div className="realtime-circle" />
				</div>
			</div>
			<div
				className="user offline"
				style={{ color: "crimson", fontWeight: 500 }}
			>
				Server Error!
			</div>
		</div>
	);
};

export default ActivityError;
