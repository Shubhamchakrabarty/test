export const calculatePercentile = (values, percentile) => {
    if (values.length < 10) return null; // Only calculate if count >= 10
    values.sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * values.length) - 1;
    return values[index];
  };

