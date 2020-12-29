import axios from '../utils/axios';

export async function getCurrentUser() {
  const res = await axios.get(`/api/auth/setup`);
  return res.data;
}

export async function updateUser(user) {
  const res = await axios.post(`/api/auth/update`, {
    user,
  });
  return res.data;
}
