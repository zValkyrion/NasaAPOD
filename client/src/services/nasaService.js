import api from './api';

export const getApod = (date = null) => {
  const params = date ? { date } : {};
  console.log("Calling API: Get NASA APOD", params);
  return api.get('/nasa/apod', { params });
};