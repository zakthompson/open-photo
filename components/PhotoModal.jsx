import React from 'react';
import { useRouter } from 'next/router';
import Modal from './Modal';
import PhotoModalInner from './PhotoModalInner';

export default function PhotoModal() {
  const router = useRouter();
  const { photoId } = router.query;
  function customClose() {
    const newQuery = { ...router.query };
    delete newQuery.modal;
    delete newQuery.photoId;
    router.push({
      pathname: router.pathname,
      query: newQuery,
    });
  }

  return (
    <Modal id="photo" customClose={customClose} customLayout>
      {photoId && <PhotoModalInner close={customClose} />}
    </Modal>
  );
}
