import React from 'react';
import Link from './Link';
import { User } from '../commonPropTypes';

export default function Header({ user }) {
  return (
    <div className="flex items-center justify-between px-4 py-2 shadow-md">
      <div>
        <h1>Family Photos</h1>
      </div>
      {user && (
        <div>
          <Link href="/api/auth/logout">Log Out</Link>
        </div>
      )}
    </div>
  );
}

Header.propTypes = {
  user: User,
};

Header.defaultProps = {
  user: {},
};
