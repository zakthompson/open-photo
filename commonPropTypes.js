import PropTypes from 'prop-types';

export const User = PropTypes.shape({
  _id: PropTypes.string,
  families: PropTypes.shape({
    data: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
      }),
    ),
  }),
});

export default User;
