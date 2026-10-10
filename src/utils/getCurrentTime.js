const pad = (n) => String(n).padStart(2, "0");

export const getCurrentTime = () => {
  const d = new Date();
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
};