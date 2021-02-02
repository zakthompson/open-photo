import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useInfiniteQuery, useQueryClient } from 'react-query';
import { getPhotos } from '../actions/photos';

export default function usePhotos() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { familyId } = router.query;
  const [photos, setPhotos] = useState([]);

  const { data, error, isFetching } = useInfiniteQuery(
    ['photos', { familyId }],
    getPhotos,
    {
      enabled: !!familyId,
      getNextPageParam: (lastPage) => lastPage.after,
    },
  );

  useEffect(() => {
    if (data?.pages) {
      setPhotos(
        data.pages.reduce((arr, next) => {
          return [...arr, ...next.data];
        }, []),
      );
    }
  }, [data]);

  useEffect(() => {
    // We want a non-paged version of this cached to eagerly show individual
    // photos
    if (familyId) {
      queryClient.setQueryData(['photos', { familyId }], photos);
    }
  }, [photos, familyId, queryClient]);

  return { photos, error, isFetching };
}
