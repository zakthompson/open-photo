import React, { useContext } from 'react';
import { useRouter } from 'next/router';
import Link from './Link';
import { UserContext } from '../context/userContext';

export default function Header() {
  const router = useRouter();
  const { state } = useContext(UserContext);

  const { familyId } = router.query;

  return (
    <div
      className={`flex items-end px-2 py-1 md:px-10 md:py-5 ${
        state.user && !familyId ? 'justify-between' : ''
      }`}
    >
      <Link href="/">
        <h1>
          <span className="font-bold uppercase">Family</span>
          <span className="font-thin uppercase">Photos</span>
        </h1>
      </Link>
      {state.user && familyId && (
        <div className="flex-1 hidden md:block">
          <Link
            href={`/families/${familyId}/galleries`}
            className="ml-10 text-2xl text-light"
          >
            Galleries
          </Link>
        </div>
      )}
      {state.user && (
        <Link
          href="/api/auth/logout"
          className="hidden text-2xl text-light md:block"
        >
          Log Out
        </Link>
      )}
    </div>
  );
}
