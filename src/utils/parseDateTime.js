export const parseDateTime = (date, time) => {
  if (!date) return 0;

  const [year, month, day] = String(date).split("-").map(Number);

  if (!day || !month || !year) return 0;

  const [hours = 0, minutes = 0] = String(time || "00:00")
    .split(":")
    .map(Number);

  return new Date(
    year,
    month - 1,
    day,
    hours,
    minutes
  ).getTime();
};