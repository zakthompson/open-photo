import React from 'react';
import PropTypes from 'prop-types';
import Photo from './Photo';

export default function PhotoGrid({ photos }) {
  return (
    <div className="flex flex-wrap m-auto text-center">
      {photos.map((p) => (
        <div key={p.id} className="flex-grow h-64 p-1">
          <Photo path={p.key} id={p.id} name={p.name} height={256} />
        </div>
      ))}
      {!photos.length && <div className="font-thin">No photos to display</div>}
    </div>
  );
}

PhotoGrid.propTypes = {
  photos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      createdAt: PropTypes.number.isRequired,
      key: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string,
      creator: PropTypes.shape({
        id: PropTypes.string.isRequired,
        createdAt: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      }).isRequired,
    }),
  ).isRequired,
};
