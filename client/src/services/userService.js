import api from './api';

export const getUserProfile = () => {
  console.log("Calling API: Get User Profile");
  return api.get('/users/profile');
}

export const updateUserProfile = (profileData) => {
  console.log("Calling API: Update User Profile", profileData);
  // Solo enviar campos no vacíos/nulos si es necesario, aunque el backend ya lo maneja
  const dataToSend = {};
  if (profileData.name !== undefined) dataToSend.name = profileData.name;
  if (profileData.password) dataToSend.password = profileData.password;
  return api.put('/users/profile', dataToSend);
}