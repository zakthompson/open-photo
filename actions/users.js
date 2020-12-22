import axios from '../utils/axios';

export async function updateUser(user) {
  const res = await axios.post(`/api/auth/update`, {
    data: { user },
  });
  return res.data;
}

export default updateUser;