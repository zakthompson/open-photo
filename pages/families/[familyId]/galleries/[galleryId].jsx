import React from 'react';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import Layout from '../../../../components/Layout';
import Loader from '../../../../components/Loader';
import { getGalleries } from '../../../../actions/galleries';

export default function Gallery() {
  const router = useRouter();
  const { familyId } = router.query;
  const { galleryId } = router.query;

  const { data, isLoading } = useQuery(
    ['galleries', { familyId }],
    getGalleries,
  );

  const gallery = data ? data.find((g) => g.id === galleryId) : {};

  return (
    <Layout>
      <section className="px-2 py-10 md:px-20">
        {isLoading && <Loader />}
        {!isLoading && (
          <>
            <h3 className="mb-2 text-left md:mb-10">{gallery.name}</h3>
            <div className="flex flex-wrap items-stretch">
              <div>Photos</div>
            </div>
          </>
        )}
      </section>
    </Layout>
  );
}
