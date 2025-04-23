import api from './api';

export const loginUser = (credentials) => {
  console.log("Calling API: Login User", credentials.email);
  return api.post('/auth/login', credentials);
}

export const registerUser = (userData) => {
   console.log("Calling API: Register User", userData.email);
   return api.post('/auth/register', userData);
}

export const deleteAccountService = async () => {
  console.log("Calling API: Delete User Account");
  const response = await api.delete('/auth/user');
  return response.data;
};
