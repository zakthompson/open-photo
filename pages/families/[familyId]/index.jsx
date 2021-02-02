import React from 'react';
import Layout from '../../../components/Layout';
import PhotoGrid from '../../../components/PhotoGrid';
import Loader from '../../../components/Loader';
import usePhotos from '../../../hooks/usePhotos';

export default function Family() {
  const { photos, error, isFetching } = usePhotos();

  return (
    <Layout>
      <section className="px-2 py-10 md:px-20">
        <h3 className="mb-2 text-left md:mb-10 md:text-center">
          Latest Photos
        </h3>
        <div className="flex flex-wrap items-stretch">
          {!photos.length && isFetching && <Loader />}
          {!error && !!photos.length && <PhotoGrid photos={photos} />}
          {!isFetching && error && (
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
