import React from 'react';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import imagekit from '../../../utils/imagekit';
import LazyImage from '../../../components/LazyImage';
import { getPhotos } from '../../../actions/photos';
import Link from '../../../components/Link';

export default function Family() {
  const router = useRouter();
  const { familyId } = router.query;

  const { data, error, isLoading } = useQuery(
    ['photos', { familyId }],
    getPhotos,
  );

  return (
    <>
      <h2>Latest Photos</h2>
      <div className="flex flex-wrap items-stretch justify-center px-24">
        {!isLoading &&
          !error &&
          data.map((p) => (
            <div
              key={p._id}
              className="h-64 mx-2 mt-4 overflow-hidden rounded bg-grey-400"
            >
              <LazyImage
                key={p._id}
                src={imagekit.url({
                  path: p.key,
                  transformation: [
                    {
                      height: '256',
                    },
                  ],
                })}
                alt={p.name}
                objectFit="cover"
              />
            </div>
          ))}
      </div>
      <Link
        href={`/families/${familyId}/photos/new`}
        className="fixed flex items-center justify-center text-4xl text-white bg-blue-600 rounded-full shadow-lg w-14 h-14 right-10 bottom-10"
      >
        +
      </Link>
    </>
  );
}
