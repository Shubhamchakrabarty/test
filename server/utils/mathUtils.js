//Math Utility Functions, mathUtils.js

const generateWeights = (n) => {
    if (n <= 0) {
      throw new Error("Array size must be a positive integer.");
    }
  
    let weights = new Array(n).fill(0);
    let middle = Math.floor(n / 2);
  
    for (let i = 0; i <= middle; i++) {
      weights[i] = (i + 1) / (middle + 1);
      weights[n - i - 1] = weights[i];
    }
  
    // Normalize the weights so that they sum to 1
    let sum = weights.reduce((a, b) => a + b, 0);
    weights = weights.map(w => w / sum);
  
    return weights;
  };
  
  const weightedAverage= (scores) => {
    if (!Array.isArray(scores) || scores.length === 0) {
        throw new Error("Scores must be a non-empty array.");
    }
    console.log(`scores: `, scores);
    // Sort the scores array
    const sortedScores = [...scores].sort((a, b) => a - b);
    console.log(`sortedScores: `, sortedScores);
  
    const n = sortedScores.length;
  
    const weights = generateWeights(n);
    
    console.log(`weights: `, weights);
    let weightedSum = 0;
  
    for (let i = 0; i < n; i++) {
        weightedSum += sortedScores[i] * weights[i];
    }
    console.log(`weighted average: `, weightedSum);
    return weightedSum;
  }

  const roundToTwoDecimalPlaces = (num) => {
    return Math.round(num * 100) / 100;
  };

  // Utility function to find the closest score to the weighted average
const findClosestIndex = (arr, value) => {
  return arr.reduce((closestIndex, currentValue, index) => {
    return (Math.abs(currentValue - value) < Math.abs(arr[closestIndex] - value)) ? index : closestIndex;
  }, 0);
};

module.exports = {
    generateWeights, 
    weightedAverage,
    roundToTwoDecimalPlaces,
    findClosestIndex
  };