const pad = (n) => String(n).padStart(2, "0");

export const getCurrentDate = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

