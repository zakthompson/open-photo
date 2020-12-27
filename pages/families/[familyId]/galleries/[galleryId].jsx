import React from 'react';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import Layout from '../../../../components/Layout';
import PhotoGrid from '../../../../components/PhotoGrid';
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

  const gallery = isLoading ? {} : data.find((g) => g._id === galleryId);

  return (
    <Layout>
      <section className="px-2 py-10 md:px-20">
        {isLoading && <Loader />}
        {!isLoading && (
          <>
            <h3 className="mb-2 text-left md:mb-10">{gallery.name}</h3>
            <div className="flex flex-wrap items-stretch">
              <PhotoGrid photos={gallery.photos.data} />
            </div>
          </>
        )}
      </section>
    </Layout>
  );
}
