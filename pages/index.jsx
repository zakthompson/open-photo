import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import { getCurrentUser } from '../actions/users';
import Layout from '../components/Layout';
import LazyImage from '../components/LazyImage';
import Loader from '../components/Loader';

export default function Home() {
  const router = useRouter();
  const { data: user } = useQuery('currentUser', getCurrentUser);

  const familyId = user?.families?.[0]?.id;
  useEffect(() => {
    if (familyId) {
      router.replace(`/families/${familyId}`);
    }
  });

  return (
    <Layout>
      <div className="relative w-full h-full">
        {!user && <Loader />}
        {user && !familyId && (
          <>
            <LazyImage
              src="/images/welcome.jpg"
              alt="Welcome"
              layout="fill"
              objectPosition="left-bottom"
            />
            <div className="absolute z-10 flex flex-col h-full px-2 py-5 md:text-center md:justify-center md:w-1/3 md:right-12 lg:right-32">
              <h3>Welcome</h3>
              <p className="text-xl font-thin">
                It doesn&apos;t look like you&apos;re a part of any families
                yet. Ask your family administrator to add you, and then try
                again.
              </p>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
