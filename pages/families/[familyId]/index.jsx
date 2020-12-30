import React from 'react';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import Layout from '../../../components/Layout';
import PhotoGrid from '../../../components/PhotoGrid';
import Loader from '../../../components/Loader';
import { getPhotos } from '../../../actions/photos';

export default function Family() {
  const router = useRouter();
  const { familyId } = router.query;

  const { data, error, isLoading } = useQuery(
    ['photos', { familyId }],
    getPhotos,
    { enabled: !!familyId },
  );

  return (
    <Layout>
      <section className="px-2 py-10 md:px-20">
        <h3 className="mb-2 text-left md:mb-10 md:text-center">
          Latest Photos
        </h3>
        <div className="flex flex-wrap items-stretch">
          {isLoading && <Loader />}
          {!isLoading && !error && !!data && <PhotoGrid photos={data} />}
          {!isLoading && error && (
            <div className="m-auto font-thin">
              There was a problem fetching photos. Please refresh the page to
              try again.
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
