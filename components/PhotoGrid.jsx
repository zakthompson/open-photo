import React from 'react';
import PropTypes from 'prop-types';
import Photo from './Photo';

export default function PhotoGrid({ photos }) {
  return (
    <div className="flex flex-wrap">
      {photos.map((p) => (
        <div key={p._id} className="flex-grow h-64 p-1">
          <Photo path={p.key} id={p._id} name={p.name} height={256} />
        </div>
      ))}
    </div>
  );
}

PhotoGrid.propTypes = {
  photos: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string,
      creator: PropTypes.shape({
        name: PropTypes.string.isRequired,
      }).isRequired,
    }),
  ).isRequired,
};
