// Convert float to ratio (with denominator limit)
// export const convertToRatio = (num, denominatorLimit = 100) => {
//   const n = parseFloat(num);
//   if (isNaN(n)) return num;

//   let bestNumer = 1;
//   let bestDenom = 1;
//   let bestError = Math.abs(n - bestNumer / bestDenom);

//   for (let denom = 1; denom <= denominatorLimit; denom++) {
//     const numer = Math.round(n * denom);
//     const error = Math.abs(n - numer / denom);

//     if (error < bestError) {
//       bestNumer = numer;
//       bestDenom = denom;
//       bestError = error;
//     }
//   }

//   return `${bestNumer}/${bestDenom}`;
// };


export const convertToRatio = (num, denominatorLimit = 100) => {
  const n = parseFloat(num);
  if (isNaN(n)) return num;

  const whole = Math.floor(n);
  const frac = n - whole;

  // If no fractional part → return integer
  if (frac === 0) return `${whole}`;

  let bestNumer = 1;
  let bestDenom = 1;
  let bestError = Math.abs(frac - bestNumer / bestDenom);

  for (let denom = 1; denom <= denominatorLimit; denom++) {
    const numer = Math.round(frac * denom);
    const error = Math.abs(frac - numer / denom);

    if (error < bestError) {
      bestNumer = numer;
      bestDenom = denom;
      bestError = error;
    }
  }

  // Mixed number (whole + fraction)
  return whole > 0
    ? `${whole} ${bestNumer}/${bestDenom}`
    : `${bestNumer}/${bestDenom}`;
};