

const apiKey = '3130d743d21bca1683d8149d2bec8735';
const url = 'https://api.synthesia.io/v2/videos/fromTemplate';
const templateWithAvatarId = '7bbe7f51-0ada-4913-8662-9d6f23e8d166';

// Custom function to apply Hindi voice accent
const customAccent = (text) => { 
    return `
    <voice voice-id="baaa2ae0-9fb9-4b0a-902d-29147759ffec" speaker-id="cddbb720-3645-43a9-98b4-7f66c80fd345" lang="HI">${text}</voice>`;
}
// Example question list
const questions = [
    {
        title: 'Question 1',
        script: 'You are tasked with designing a RESTful API for an e-commerce application that handles product listings, inventory management, and customer reviews. What considerations would you take into account for scalability and maintainability?',
    }
]

// Function to generate videos in parallel
const generateVideos = async() => {
    // Use map to create an array of fetch Promises for parallel execution
    const videoPromises = questions.map(question => {
        const options = {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                Authorization: apiKey
            },
            body: JSON.stringify({
                test: true,  // Set to false for real video generation
                templateData: {
                    question_title: question.title,
                    question_script: customAccent(question.script),  // Add custom voice accent to the script

                },
                title: `Job - ${question.title}`,
                visibility: 'private',
                templateId: templateWithAvatarId  // Pass template ID with avatar
            })
        };
        return fetch(url, options);  // Return the fetch Promise
    });

    // Wait for all videos to be generated in parallel
    try {
        const responses = await Promise.all(videoPromises);
        for (const response of responses) {
            const result = await response.json();
            console.log(result);  // Log the generated video response
        }
        console.log('Videos generated successfully!');
    } catch (error) {
        console.error('Error generating videos:', error);
    }
}

console.log('Generating videos');
generateVideos();

function addNewlines(inputStr, maxLineLength = 47) {
    let words = inputStr.split(' ');
    let result = '';
    let currentLine = '';
  
    words.forEach(word => {
      if ((currentLine + word).length > maxLineLength) {
        result += currentLine.trim() + '\n';
        currentLine = word + ' ';
      } else {
        currentLine += word + ' ';
      }
    });
    result += currentLine.trim();
    return result;
}

