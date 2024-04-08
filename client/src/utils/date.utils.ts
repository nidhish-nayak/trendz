const formatTime = (createdAt: Date): string => {
    const currentDate = new Date().toISOString();
    const postedDate = createdAt;

    const currentDateObject = new Date(currentDate).getTime();
    const postedDateObject = new Date(postedDate).getTime();

    const timeDifference: number = currentDateObject - postedDateObject;
    const timeInMinutes = timeDifference / (1000 * 60);

    if (timeInMinutes < 1) {
        return "Just now";
    } else if (timeInMinutes < 60) {
        return `${Math.round(timeInMinutes)} min${
            Math.round(timeInMinutes) !== 1 ? "s" : ""
        } ago`;
    } else if (timeInMinutes < 1440) {
        return `${Math.round(timeInMinutes / 60)} hr${
            Math.round(timeInMinutes / 60) !== 1 ? "s" : ""
        } ago`;
    } else if (timeInMinutes < 365 * 24 * 60) {
        return `${Math.round(timeInMinutes / 1440)} day${
            Math.round(timeInMinutes / 1440) !== 1 ? "s" : ""
        } ago`;
    } else {
        return "A year ago";
    }
};

export default formatTime;
