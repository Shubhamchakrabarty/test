import React, { useEffect, useState } from 'react';

function ProcessedResponses() {
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    console.log('Fetching processed responses...');
    fetch('/response/process-responses')
      .then(response => response.json())
      .then(data => {
        console.log('Data fetched:', data);
        setResponses(data);
      })
      .catch(error => console.error('Error fetching processed responses:', error));
      return () => {
        console.log('ProcessedResponses component unmounted.');
      };
  }, []);

  return (
    <div>
      <h2>Processed Responses</h2>
      <ul>
        {responses.map(response => (
          <li key={response.id}>
            <h3>Original Response</h3>
            <p>{response.originalResponse}</p>
            <h3>Suggestions</h3>
            <p>{response.suggestions}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProcessedResponses;