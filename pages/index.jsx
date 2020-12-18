import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { User } from '../commonPropTypes';

export default function Home({ user }) {
  const router = useRouter();

  useEffect(() => {
    if (user && user.families.data.length) {
      router.replace('/family');
    }
  }, [router, user]);

  return (
    <>
      {!user && <p>Loading...</p>}
      {user && (
        <>
          <h1>Welcome!</h1>
          <p>
            It doesn&apos;t look like you&apos;re a part of any families yet.
            Ask your family administrator to add you, and then try again!
          </p>
        </>
      )}
    </>
  );
}

Home.propTypes = {
  user: User,
};

Home.defaultProps = {
  user: {},
};
