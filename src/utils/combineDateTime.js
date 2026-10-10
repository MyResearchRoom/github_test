// export const combineDateTime = (dateStr, timeStr) => {
//   if (!dateStr || !timeStr) return null;
//   const datePart = new Date(dateStr).toISOString().split("T")[0];
//   return new Date(`${datePart}T${timeStr}`);
// };


function convertTimeRange(timeRange) {
  const formatTime = (time) => {
    if (!time || !time.includes(":")) return "";
    let [hour, minute] = time?.split(":");
    hour = parseInt(hour, 10);
    const suffix = hour >= 12 ? "PM" : "AM";
    if (hour === 0) hour = 12;
    else if (hour > 12) hour -= 12;

    return `${hour}${minute !== "00" ? "." + minute : ""} ${suffix}`;
  };

  const [start, end] = timeRange?.split(" - ");
  return `${formatTime(start)} - ${formatTime(end)}`;
}

export default convertTimeRange