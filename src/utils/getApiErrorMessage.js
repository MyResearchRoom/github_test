export const getApiErrorMessage = (error, fallback) => {
  const data = error?.response?.data;

  if (data?.code === "PLAN_LIMIT_REACHED") {
    return data.message || data.error || fallback;
  }

  return data?.error || data?.message || error?.message || fallback;
};
