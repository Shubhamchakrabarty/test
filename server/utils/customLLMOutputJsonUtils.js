const customJsonParser = (responseText) => {
    let cleanedText = responseText.trim();

    // Remove code fences if present
    if (cleanedText.startsWith("```json")) {
      cleanedText = cleanedText.substring(7, cleanedText.length - 3).trim();
    } else if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText.substring(3, cleanedText.length - 3).trim();
    }

    // Identify the starting and ending point of the JSON object
    const jsonStart = cleanedText.indexOf('{');
    const jsonEnd = cleanedText.lastIndexOf('}');
    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error("No JSON object found in response text.");
    }

    cleanedText = cleanedText.substring(jsonStart, jsonEnd + 1);

    return cleanedText;
  };

  // Helper function to format feedback
const formatFeedback = (feedback) => {
  // Check if feedback is a valid JSON string
  let parsedFeedback;
  try {
    parsedFeedback = JSON.parse(feedback);
  } catch (error) {
    // If it's not a JSON string, return the feedback as plain text
    return { type: 'text', content: feedback };
  }

  // If parsedFeedback is an object, structure it for React
  if (typeof parsedFeedback === 'object' && parsedFeedback !== null) {
    // Convert the object into an array of key-value pairs
    const feedbackEntries = Object.entries(parsedFeedback).map(([key, value]) => ({
      label: key.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase()), // Convert key to a more readable format
      content: value,
    }));

    return { type: 'json', content: feedbackEntries };
  }

  // If it's not a recognized structure, return as is
  return { type: 'text', content: feedback };
};

  module.exports = { customJsonParser, formatFeedback};