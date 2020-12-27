import React, { useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { UserContext } from '../context/userContext';
import Layout from '../components/Layout';
import LazyImage from '../components/LazyImage';
import Loader from '../components/Loader';

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
    <Layout>
      <div className="relative w-full h-full">
        {!state.user && <Loader />}
        {state.user && (
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
