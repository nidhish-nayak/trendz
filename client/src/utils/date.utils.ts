const formatTimeDifference = (timeInMilliseconds: number): string => {
    const timeInMinutes = timeInMilliseconds / (1000 * 60);

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

export default formatTimeDifference;
