import { LOGIN_API } from '../API/apiEndpoints'
import axios from 'axios';
import '../API/axiosConfig'
 
export async function login(username, password) {
  const params = new URLSearchParams();
  params.append('username', username);
  params.append('password', password);
 
  try {
    const response = await axios.post(LOGIN_API.LOGIN_API_021A, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      responseType: 'text', // because backend returns a raw string (JWT)
    });
 
    const token = response.data;
    localStorage.setItem('token', token);
    return token;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}
 
export function getToken() {
  return localStorage.getItem('token');
}
 
export function logout() {
  localStorage.removeItem('token');
}