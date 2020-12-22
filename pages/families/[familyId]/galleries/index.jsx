import React from 'react';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import Link from '../../../../components/Link';
import { getGalleries } from '../../../../actions/galleries';

export default function Galleries() {
  const router = useRouter();
  const { familyId } = router.query;

  const { data, error, isLoading } = useQuery(
    ['galleries', { familyId }],
    getGalleries,
  );

  return (
    <>
      <Link href={`/families/${familyId}/galleries/new`}>
        Create New Gallery
      </Link>
      <h2>Galleries</h2>
      <ul>
        {!isLoading && !error && data.map((g) => <li key={g._id}>{g.name}</li>)}
      </ul>
    </>
  );
}
