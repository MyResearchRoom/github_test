export const formatTime = (time) => {
    let [hour, minute] = time.split(":");
    hour = parseInt(hour, 10);
    const suffix = hour >= 12 ? "PM" : "AM";
    if (hour === 0) hour = 12;
    else if (hour > 12) hour -= 12;

    return `${hour}${minute !== "00" ? "." + minute : ""} ${suffix}`;
  };