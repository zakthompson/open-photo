import React from 'react';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import Layout from '../../../components/Layout';
import PhotoGrid from '../../../components/PhotoGrid';
import { getPhotos } from '../../../actions/photos';

export default function Family() {
  const router = useRouter();
  const { familyId } = router.query;

  const { data, error, isLoading } = useQuery(
    ['photos', { familyId }],
    getPhotos,
  );

  return (
    <Layout>
      <section className="px-2 py-10 md:px-20">
        <h3 className="mb-2 text-left md:mb-10 md:text-center">
          Latest Photos
        </h3>
        <div className="flex flex-wrap items-stretch">
          {!isLoading && !error && <PhotoGrid photos={data} />}
        </div>
      </section>
    </Layout>
  );
}
