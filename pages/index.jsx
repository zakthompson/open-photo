import React, { useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { UserContext } from '../context/userContext';

export default function Home() {
  const router = useRouter();
  const { state } = useContext(UserContext);

  useEffect(() => {
    const familyId = state.user?.families?.data?.[0]?._id;
    if (familyId) {
      router.replace(`/families/${familyId}`);
    }
  });

  return (
    <>
      <h2>Welcome!</h2>
      <p>
        It doesn&apos;t look like you&apos;re a part of any families yet. Ask
        your family administrator to add you, and then try again.
      </p>
    </>
  );
}
