function formatTimeRelative(time) {
    time -= Date.now();
    let timeAbs = Math.abs(time);

    let result = "";

    if (timeAbs < 1000 * 10) {
        return "now";
    } else if (timeAbs < 1000 * 60) {
        let seconds = Math.floor(timeAbs / 1000);
        result = seconds + " second" + (seconds != 1 ? "s" : "");
    } else if (timeAbs < 1000 * 60 * 60) {
        let minutes = Math.floor(timeAbs / (1000 * 60));
        result = minutes + " minute" + (minutes != 1 ? "s" : "");
    } else if (timeAbs < 1000 * 60 * 60 * 24) {
        let hours = Math.floor(timeAbs / (1000 * 60 * 60));
        result = hours + " hour" + (hours != 1 ? "s" : "");
    } else if (timeAbs < 1000 * 60 * 60 * 24 * 30) {
        let days = Math.floor(timeAbs / (1000 * 60 * 60 * 24));
        result = days + " day" + (days != 1 ? "s" : "");
    } else if (timeAbs < 1000 * 60 * 60 * 24 * 365) {
        let months = Math.max(Math.floor(timeAbs / (1000 * 60 * 60 * 24 * 30.5)), 1);
        result = months + " month" + (months != 1 ? "s" : "");
    } else {
        let years = Math.max(Math.floor(timeAbs / (1000 * 60 * 60 * 24 * 365.25)), 1);
        result = years + " year" + (years != 1 ? "s" : "");
    }

    return time > 0 ? "in " + result : result + " ago";
}