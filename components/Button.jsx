import React from 'react';
import PropTypes from 'prop-types';
import Link from './Link';

export default function Button({
  href,
  onClick,
  rounded,
  className,
  children,
  type,
}) {
  const El = href ? Link : `button`;

  return (
    <El
      className={`flex items-center justify-center rounded ${
        rounded ? 'rounded-full p-3' : 'px-3 py-1'
      } ${className}`}
      href={href}
      onClick={onClick}
      type={type}
    >
      {children}
    </El>
  );
}

Button.propTypes = {
  href: PropTypes.string,
  onClick: PropTypes.func,
  rounded: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  type: PropTypes.string,
};

Button.defaultProps = {
  href: null,
  onClick: null,
  rounded: false,
  className: '',
  type: undefined,
};
