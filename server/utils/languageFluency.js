
// Helper: Calculate Pronunciation Accuracy
const calculatePronunciationAccuracy = (words) => {
    if (!Array.isArray(words) || words.length === 0) {
        return 0; // Default to 0 if words array is empty or invalid
    }
    const totalWords = words.length;
    const highConfidenceWords = words.filter(word => word.confidence >= 0.8).length;
    return (highConfidenceWords / totalWords) * 100; // Return percentage
};

// Helper: Calculate Fluency Metrics (Words Per Minute, Pauses, Long Pauses)
const calculateFluencyMetrics = (words, totalDuration, pauseThreshold = 1.0, longPauseThreshold = 3.0) => {
    if (!Array.isArray(words) || words.length === 0 || totalDuration <= 0) {
        return { wordsPerMinute: 0, pauses: 0, longPauses: 0 }; // Default to 0 if invalid input
    }
    const wordCount = words.length;

    // Identify pauses and long pauses based on thresholds
    const pauses = words.filter((word, index) => {
        if (index === 0) return false; // Skip the first word
        const gap = word.start - words[index - 1].end; // Time gap between words
        return gap > pauseThreshold; // Regular pause
    }).length;

    const longPauses = words.filter((word, index) => {
        if (index === 0) return false; // Skip the first word
        const gap = word.start - words[index - 1].end; // Time gap between words
        return gap > longPauseThreshold; // Long pause
    }).length;

    // Calculate Words Per Minute
    const wordsPerMinute = (wordCount / totalDuration) * 60;

    return { wordsPerMinute, pauses, longPauses };
};

// Helper: Calculate Confidence and Clarity
const calculateConfidenceMetrics = (words) => {
    if (!Array.isArray(words) || words.length === 0) {
        return 0; // Default to 0 if words array is empty or invalid
    }
    const totalConfidence = words.reduce((sum, word) => sum + word.confidence, 0);
    const averageConfidence = totalConfidence / words.length;
    return averageConfidence * 100; // Return percentage
};


module.exports = { calculatePronunciationAccuracy, calculateFluencyMetrics, calculateConfidenceMetrics };