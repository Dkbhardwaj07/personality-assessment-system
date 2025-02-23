import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000"; // Backend URL

export const submitResponse = async (data) => {
  return axios.post(`${API_BASE_URL}/submit_response`, data);
};

export const getPersonalityProfile = async (email) => {
  return axios.get(`${API_BASE_URL}/personality-profile`, {
    params: { email },
  });
};

// export const getPersonalityProfile = async (email) => {
//   return axios.get(`${API_BASE_URL}/personality-profile?email=${email}`);
// };