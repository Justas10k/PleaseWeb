import axios from 'axios';

const API_URL = 'http://localhost:3500/posts';

const getFeedPosts = async (token) => {
  const response = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

const getUserPosts = async (userId, token) => {
  const response = await axios.get(`${API_URL}/${userId}/posts`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

const createPost = async (post, token) => {
  const response = await axios.post(API_URL, post, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export default {
  getFeedPosts,
  getUserPosts,
  createPost,
};
