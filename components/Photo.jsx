import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import LazyImage from './LazyImage';
import imagekit from '../utils/imagekit';

export default function Photo({ id, path, name, width, height }) {
  const router = useRouter();
  function openPhotoModal() {
    const newQuery = { ...router.query };
    newQuery.modal = 'photo';
    newQuery.photoId = id;
    router.push({
      path: router.pathname,
      query: newQuery,
    });
  }

  const transformation = [{}];
  if (width) transformation[0] = { ...transformation[0], width };
  if (height) transformation[0] = { ...transformation[0], height };

  const src = imagekit.url({
    path,
    transformation,
  });
  return (
    <button
      type="button"
      onClick={openPhotoModal}
      className="relative w-full h-full overflow-hidden rounded"
    >
      <LazyImage
        src={src}
        alt={name}
        objectFit="cover"
        layout="responsive"
        className="bg-gray-200"
      />
    </button>
  );
}

Photo.propTypes = {
  id: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
};

Photo.defaultProps = {
  width: null,
  height: null,
};
