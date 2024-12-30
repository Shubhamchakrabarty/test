// utils/apiUtils.js
export const getApiUrl = (path) => {
    const baseUrl = process.env.NODE_ENV === 'development'
      ? 'http://localhost:5000'
      : 'https://pehchaan.me';

    
    console.log("Path:",`${baseUrl}${path}`);
    return `${baseUrl}${path}`;
  };