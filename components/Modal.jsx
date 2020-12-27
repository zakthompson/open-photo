import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { createPortal } from 'react-dom';
import { X } from 'react-feather';

export default function Modal({
  id,
  header,
  children,
  customClose,
  customLayout,
}) {
  const router = useRouter();

  const closeModal = () => {
    const newQuery = { ...router.query };
    delete newQuery.modal;
    router.push({
      pathname: router.pathname,
      query: newQuery,
    });
  };

  return router.query.modal && router.query.modal === id
    ? createPortal(
        <>
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            {!customLayout && (
              <div className="w-full h-full p-2 overflow-auto bg-white border rounded md:p-5 md:w-2/3 md:h-auto md:h-2/3">
                <div className="flex items-center justify-between w-full text-gray-dark">
                  <h2 className="p-2 md:pl-5">{header}</h2>
                  <button type="button" onClick={customClose || closeModal}>
                    <X size={36} />
                  </button>
                </div>
                <div className="p-2 overflow-auto md:p-5">{children}</div>
              </div>
            )}
            {customLayout && children}
          </div>
          <div className="absolute inset-0 bg-gray-700 opacity-75" />
        </>,
        document.body,
      )
    : null;
}

Modal.propTypes = {
  id: PropTypes.string.isRequired,
  header: PropTypes.string,
  children: PropTypes.node,
  customClose: PropTypes.func,
  customLayout: PropTypes.bool,
};

Modal.defaultProps = {
  header: '',
  children: null,
  customClose: null,
  customLayout: false,
};
