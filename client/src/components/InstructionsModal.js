import React, { useState } from 'react';
import './InstructionsModal.css';

const InstructionsModal = ({ show, onClose, instructionDetails, onAccept }) => {
    const [currentScreen, setCurrentScreen] = useState(1); // Tracks the screen (1: instructions, 2: welcome and context)
    if (!show) return null;

    const defaultInstructions = {
        pre_interview_instructions: "Ensure you're prepared and have a stable internet connection.",
        welcome_message: "Welcome to the interview!",
        context_video_url: null,
        context_video_text: null,
        welcome_video_url: null,
        language: 'en-IN',
    };

    const instructions = instructionDetails || defaultInstructions;

    // Function to format language code
    const formatLanguage = (code) => {
        if (code.startsWith('hi')) return 'Hindi';
        return 'English'; // Fallback in case of unexpected code
    };

    const handleNext = () => {
        setCurrentScreen(2); // Navigate to the second screen
    };

    const handleStartInterview = () => {
        onAccept(); 
        onClose();
    };

    const renderTextWithParagraphs = (text) => {
        // Split text by double line breaks (for paragraphs) or single line breaks
        return text.split(/\n\n|\r\n\r\n/).map((paragraph, index) => (
            <p key={index} className="context-paragraph">
                {paragraph.split(/\n|\r\n/).map((line, lineIndex) => (
                    <span key={lineIndex}>
                        {line}
                        <br />
                    </span>
                ))}
            </p>
        ));
    };

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                {/* Screen 1: Instructions */}
                {currentScreen === 1 && (
                    <div className="screen1-layout">
                        <div className="left-column">
                            <h2 className='poppins-semibold'>Instructions</h2>
                            {instructions.welcome_video_url && (
                                <div className="video-card">
                                    <iframe
                                        title="Welcome Video"
                                        src={instructions.welcome_video_url}
                                        frameBorder="0"
                                        allow="autoplay; fullscreen"
                                        allowFullScreen
                                        className="video-card-iframe"
                                    ></iframe>
                                </div>
                            )}
                            <div className="text-card">

                                <h3 className='poppins-medium'>Preparation</h3>
                                <p>Find a quiet space with minimal background noise. Check your equipment to ensure the microphone is working and your device has a functioning audio input. Make sure you have a stable internet connection to avoid disruptions. Use a modern browser that supports audio recording and has microphone access permissions enabled.</p>

                                <h3>Starting Your Recording</h3>
                                <p>Access the recording interface through the Audio Upload Form where recording controls are available. Click 'Start Recording' to begin, and ensure the microphone is positioned 6-12 inches from your mouth for clarity. Speak clearly and confidently, and follow any prompts or questions given for a comprehensive response.</p>

                                <h3>During Recording</h3>
                                <p>Keep an eye on the recording time to stay within the allotted duration. Minimize background noise and interruptions. Focus on providing relevant and concise responses based on the questions or topic at hand.</p>

                                <h3>Stopping Your Recording</h3>
                                <p>Click 'Stop Recording' to end the session and automatically save your file. Review the recording to ensure it meets your expectations. If needed, re-record by clicking 'Start Recording' again.</p>

                                <h3>Audio Playback and Controls</h3>
                                <p>Use the playback controls to listen to your recording, including play, pause, rewind, and forward options. Adjust the volume slider for comfortable playback, and use the rewind and forward buttons to navigate through different sections of your recording.</p>
                            </div>
                        </div>
                        <div className="right-column">
                            {/* Warning Box */}
                            <div className="warning-box">
                                <p><strong>Warning:</strong> Ensure you complete the online test in a single session. Do not refresh or navigate away from the page, as this may result in losing your progress.</p>
                            </div>
                            {/* Button to move to the next screen */}
                            <div className="modal-buttons">
                                <button onClick={handleNext} className="next-button">Next</button>
                            </div>
                        </div>
                        
                    </div>
                )}

                {/* Screen 2: Welcome Message, Language, and Context */}
                {currentScreen === 2 && (
                    <div className="screen2-container">
                        <p className='poppins-medium'>{instructions.welcome_message || defaultInstructions.welcome_message}</p>

                        {/* Display formatted language */}
                        <p className="poppins-medium">
                            This interview will be conducted in <span className="highlight-english">{formatLanguage(instructions.language)}</span>.
                        </p>

                        {/* Context video or text */}
                        {instructions.context_video_url && (
                            <div className="video-container">
                                <div className="context-card">
                                <h3>Please watch the following video carefully. There will be questions based on this video.</h3>
                                   <iframe
                                        title="Context Video"
                                        src={instructions.context_video_url}
                                        className="context-video-iframe"
                                        frameBorder="0"
                                        allow="autoplay; fullscreen"
                                        allowFullScreen
                                        style={{ width: '80vw', height: '80vh' }}
                                    ></iframe> 
                                </div>
                                
                            </div>
                        )}

                        {instructions.context_video_text && !instructions.context_video_url && (
                            <div className="context-card">
                                <h3>Please read the following passage carefully. There will be questions based on this passage.</h3>
                                <div style={{ textAlign: 'left', marginBottom: '20px' }}>
                                    {renderTextWithParagraphs(instructions.context_video_text)}
                                </div>
                            </div>
                        )}

                        

                        {/* Button to start the interview */}
                        <div className="modal-buttons">
                            <button onClick={handleStartInterview} className="accept-button">Start Interview</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InstructionsModal;
