/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

export default function LinkWrapper({ children, href, ...rest }) {
  return (
    <Link href={href}>
      <a {...rest}>{children}</a>
    </Link>
  );
}

LinkWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  href: PropTypes.string.isRequired,
};
