import React from 'react';
import { useLocation } from 'react-router-dom';

const VideoAsk = () => {
  const location = useLocation();
  const { email, name } = location.state || {};

  const videoAskSrc = `https://www.videoask.com/fv41vng0c#contact_email=${encodeURIComponent(email)}&contact_name=${encodeURIComponent(name)}`;

  return (
    <div>
      <h1>Welcome, {name}!</h1>
      <iframe
        src={videoAskSrc}
        allow="camera *; microphone *; autoplay *; encrypted-media *; fullscreen *; display-capture *;"
        width="100%"
        height="600px"
        style={{ border: 'none', borderRadius: '24px' }}
      ></iframe>
    </div>
  );
};

export default VideoAsk;