import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import useModal from '../../../../hooks/useModal';
import Layout from '../../../../components/Layout';
import Link from '../../../../components/Link';
import NewGalleryModal from '../../../../components/NewGalleryModal';
import LazyImage from '../../../../components/LazyImage';
import Button from '../../../../components/Button';
import { getGalleries } from '../../../../actions/galleries';
import imagekit from '../../../../utils/imagekit';

export default function Galleries() {
  const router = useRouter();
  const { openModal } = useModal('create-gallery');
  const [showing, setShowing] = useState(null);
  const { familyId } = router.query;

  const { data, error, isLoading } = useQuery(
    ['galleries', { familyId }],
    getGalleries,
    { enabled: !!familyId },
  );

  return (
    <Layout>
      <section className="h-full px-20 py-10">
        <div className="flex justify-between mt-10">
          <h2>Galleries</h2>
          <Button onClick={openModal} className="text-white bg-gray-light">
            Create New
          </Button>
        </div>
        <div className="flex px-5 py-8 max-h-2/3">
          <ul className="flex-shrink-0 w-72">
            {!isLoading &&
              !error &&
              data &&
              data.map((g, i) => (
                <li key={g._id}>
                  <Link
                    href={`/families/${familyId}/galleries/${g._id}`}
                    className="text-3xl font-thin transition-text-size hover:font-light"
                    onMouseEnter={() => setShowing(i)}
                  >
                    {g.name}
                  </Link>
                </li>
              ))}
          </ul>
          <div className="flex items-center overflow-hidden">
            {!isLoading &&
              !error &&
              data &&
              data.map(
                (g, i) =>
                  showing === i &&
                  g.photos.data.slice(0, 5).map((p) => {
                    const src = imagekit.url({
                      path: p.key,
                      transformation: [{ height: '128' }],
                    });
                    return (
                      <div className="relative ml-2 overflow-hidden rounded">
                        <LazyImage src={src} alt={p.name} layout="responsive" />
                      </div>
                    );
                  }),
              )}
          </div>
        </div>
        <NewGalleryModal />
      </section>
    </Layout>
  );
}
