export const calculateUsage = (used, limit) => {
  const usedNum = Number(used) || 0;
  const limitNum = Number(limit) || 0;
  const percent = limitNum > 0 ? Math.min(Math.round((usedNum / limitNum) * 100), 100) : 0;

  return {
    percent,
    usage: `${usedNum}/${limitNum}`,
  };
};
