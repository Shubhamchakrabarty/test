const fuzz = require('fuzzball');

// Function to normalize strings for better matching
const normalizeString = (str) => {
  return str.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
};

const fuzzyMatch = (input, options) => {
  console.log('FuzzyMatch Input:', input);
  //console.log('FuzzyMatch Options:', options);
  if (!input || !options || options.length === 0) return [null, 0];
  
  // Normalize input and options
  const normalizedInput = normalizeString(input);
  const normalizedOptions = options.map(option => normalizeString(option));

  const matches = fuzz.extract(normalizedInput, normalizedOptions, { scorer: fuzz.ratio });
  console.log('FuzzyMatch Results:', matches);
  
  if (matches.length && matches[0][1] > 95) { // Confidence threshold
    const matchedIndex = normalizedOptions.indexOf(matches[0][0]);
    return [options[matchedIndex], matches[0][1]];
  }

  return [null, 0];
};

module.exports = { fuzzyMatch, normalizeString };