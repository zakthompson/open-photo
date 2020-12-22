import axios from '../utils/axios';

export async function getGalleries({ queryKey }) {
  const { familyId } = queryKey[1];
  const res = await axios.get(`/api/galleries?familyId=${familyId}`);
  return res.data;
}

export async function createGallery(gallery) {
  const res = await axios.post(`/api/galleries/create`, {
    body: { gallery },
  });
  return res.data;
}
