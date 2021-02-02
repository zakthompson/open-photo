import axios from '../utils/axios';

export async function getPhotos({ queryKey }) {
  const { familyId } = queryKey[1];
  const res = await axios.get(`/api/photos?familyId=${familyId}`);
  return res.data;
}

export async function getGalleryPhotos({ queryKey }) {
  const { galleryId } = queryKey[1];
  const res = await axios.get(`/api/photos?galleryId=${galleryId}`);
  return res.data;
}

export async function getPhoto({ queryKey }) {
  const { photoId } = queryKey[1];
  const res = await axios.get(`/api/photos/${photoId}`);
  return res.data;
}

export async function createPhoto(photo) {
  const res = await axios.post(`/api/photos/create`, { photo });
  return res.data;
}

export async function uploadToS3({ index, url, file, onUploadProgress }) {
  const res = await axios.put(url, file, {
    headers: {
      'Content-Type': file.type,
    },
    onUploadProgress: (progress) => onUploadProgress(index, progress),
  });
  return { data: res.data, index };
}
