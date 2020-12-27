import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { Upload } from 'react-feather';
import useModal from '../hooks/useModal';
import Header from './Header';
import Button from './Button';
import UploadModal from './UploadModal';
import PhotoModal from './PhotoModal';

export default function Layout({ children }) {
  const router = useRouter();
  const { openModal } = useModal('upload');

  const { familyId } = router.query;

  return (
    <div className="flex flex-col h-full">
      <Header />
      <main className="flex-1 overflow-auto">{children}</main>
      {familyId && (
        <>
          <Button
            onClick={openModal}
            className="fixed text-white shadow-md bg-gray-dark hover:bg-gray-500 right-10 bottom-10"
            rounded
          >
            <Upload />
          </Button>
          <UploadModal />
          <PhotoModal />
        </>
      )}
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};
