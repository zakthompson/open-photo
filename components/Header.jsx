import React, { useContext } from 'react';
import Link from './Link';
import { UserContext } from '../context/userContext';

export default function Header() {
  const { state } = useContext(UserContext);

  return (
    <div className="flex items-center justify-between px-4 py-2 shadow-md">
      <div>
        <h1>Family Photos</h1>
      </div>
      {state.user && (
        <div>
          <Link href="/api/auth/logout">Log Out</Link>
        </div>
      )}
    </div>
  );
}
