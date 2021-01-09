import { useRouter } from 'next/router';
import { useQuery, useQueryClient } from 'react-query';
import { getPhoto } from '../actions/photos';

export default function usePhoto(id) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const photoId = id || router.query.photoId;
  const { familyId } = router.query;

  const query = useQuery(['photo', { photoId }], getPhoto, {
    initialData: () => {
      return queryClient
        .getQueryData(['photos', { familyId }])
        ?.find((d) => d.id === id);
    },
  });

  return query;
}
