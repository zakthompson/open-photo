import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import { X, Download } from 'react-feather';
import { getPhoto } from '../actions/photos';
import imagekit from '../utils/imagekit';
import LazyImage from './LazyImage';
import Loader from './Loader';

export default function PhotoModalInner({ close }) {
  const router = useRouter();
  const { photoId } = router.query;

  const { data, isLoading } = useQuery(['photo', { photoId }], getPhoto);

  const src = isLoading
    ? ''
    : imagekit.url({
        path: data.key,
      });

  return (
    <div className="absolute inset-0 flex flex-col w-full min-h-screen overflow-auto lg:min-h-0 lg:relative lg:min-h-4/5 lg:w-5/6 lg:h-4/5 lg:flex-row">
      <div className="relative flex justify-center flex-shrink-0 w-full h-auto mr-4 bg-black shadow-lg lg:items-center lg:rounded lg:w-2/3">
        {isLoading && <Loader />}
        {!isLoading && (
          <LazyImage
            src={src}
            alt={data.name}
            layout="responsive"
            objectFit="contain"
          />
        )}
        <button
          type="button"
          className="absolute text-white top-2 right-2"
          onClick={close}
        >
          <X size={36} />
        </button>
      </div>
      <div className="flex flex-col flex-1 p-6 text-center bg-white shadow-lg lg:rounded lg:w-1/3">
        {isLoading && <Loader />}
        {!isLoading && (
          <>
            <h3 className="mb-5">{data.name}</h3>
            <div className="text-2xl italic font-thin">{data.creator.name}</div>
            <div className="flex items-center flex-1 text-3xl font-thin">
              <div className="w-full my-10 text-center">
                {data.description || (
                  <span className="italic">No description provided</span>
                )}
              </div>
            </div>
            <div>
              <a
                href={src.split('?')[0]}
                download
                className="flex justify-center"
                target="_blank"
                rel="noreferrer"
              >
                <Download size={72} />
              </a>
              <div className="font-thin">Download at full resolution</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

PhotoModalInner.propTypes = {
  close: PropTypes.func.isRequired,
};
