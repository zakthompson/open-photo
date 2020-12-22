/* eslint-disable  react/jsx-props-no-spreading */
import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

export default function LazyImage({
  placeholder,
  placeholderSrcset,
  placeholderSizes,
  loading,
  className,
  objectFit,
  objectPosition,
  layout,
  alt,
  imageClassName,
  onLoad: originalOnLoad,
  ...rest
}) {
  const imgRef = useRef(null);
  const targetRef = useRef(null);
  const [isVisible, setIsVisible] = useState(loading === 'eager');
  const [ready, setReady] = useState(false);
  const lazy = !!(
    loading === 'lazy' &&
    typeof window !== 'undefined' &&
    window.IntersectionObserver
  );

  // check if the image is already loaded on our initial render
  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) setReady(true);
  }, []);

  // set up the intersection observer when the target ref exists
  useEffect(() => {
    // check this exists first
    if (!targetRef.current || !lazy) return () => {};

    // create an intersection observer
    const observer = new window.IntersectionObserver(
      ([entry], o) => {
        if (entry.isIntersecting) {
          // once we've intersected, show the image
          setIsVisible(true);

          // and disconnect from future calls
          o.disconnect();
        }
      },
      {
        rootMargin: '50px', // give a 50px buffer
        threshold: 0.1,
      },
    );

    // start the observer
    observer.observe(targetRef.current);

    // disconnect on unmount
    return () => {
      observer.disconnect();
    };
  }, [lazy]);

  const onLoad = (e) => {
    // when the image is loaded, update out state
    setReady(true);
    if (typeof originalOnLoad === 'function') originalOnLoad(e);
  };

  // purgecss requires us to actually define the full class name
  const objectFitClassMap = {
    contain: 'object-contain',
    fill: 'object-fill',
    cover: 'object-cover',
    none: 'object-none',
    'scale-down': 'object-scale-down',
  };
  const objectFitClass = objectFit ? objectFitClassMap[objectFit] : '';

  const objectPositionClassMap = {
    bottom: 'object-bottom',
    center: 'object-center',
    left: 'object-left',
    'left-bottom': 'object-left-bottom',
    'left-top': 'object-left-top',
    right: 'object-right',
    'right-bottom': 'object-right-bottom',
    'right-top': 'object-right-top',
    top: 'object-top',
  };
  const objectPositionClass = objectPosition
    ? objectPositionClassMap[objectPosition]
    : '';

  const wrapperClassNames = [className || ''];
  const imageClassNames = [
    imageClassName || '',
    'transition-opacity ease-in',
    objectFitClass,
    objectPositionClass,
  ];

  // remove opacity if the image is loaded
  if (!ready) imageClassNames.push('opacity-0');

  // add classNames to our layouts
  switch (layout) {
    case 'fill': {
      wrapperClassNames.push('absolute w-full h-full top-0 left-0');
      imageClassNames.push('absolute w-full h-full');

      // if there is no object fit or fill
      // default to fill and center
      if (!objectFit) imageClassNames.push('object-cover');
      if (!objectPosition) imageClassNames.push('object-center');
      break;
    }
    case 'responsive': {
      wrapperClassNames.push('relative');
      imageClassNames.push('relative w-full h-auto');
      break;
    }
    case 'responsiveHeight': {
      wrapperClassNames.push('relative h-full');
      imageClassNames.push('relative h-full w-auto');
      break;
    }
    default: {
      wrapperClassNames.push('relative');
      imageClassNames.push('relative max-w-full h-auto');
    }
  }

  return (
    <div ref={targetRef} className={wrapperClassNames.join(' ')}>
      {isVisible && (
        <>
          {placeholder && (
            <img
              alt={`${alt} - placeholder`}
              src={placeholder}
              srcSet={placeholderSrcset}
              sizes={placeholderSizes}
              className={`absolute inset-0 ${objectFitClass} ${objectPositionClass}`}
            />
          )}
          <img
            alt={alt}
            {...rest}
            ref={imgRef}
            onLoad={onLoad}
            className={imageClassNames.join(' ')}
          />
        </>
      )}
    </div>
  );
}

LazyImage.propTypes = {
  placeholder: PropTypes.string,
  placeholderSrcset: PropTypes.string,
  placeholderSizes: PropTypes.string,
  loading: PropTypes.oneOf(['lazy', 'eager']),
  className: PropTypes.string,
  objectFit: PropTypes.oneOf([
    'contain',
    'cover',
    'fill',
    'none',
    'scale-down',
  ]),
  objectPosition: PropTypes.oneOf([
    'bottom',
    'center',
    'left',
    'left-bottom',
    'left-top',
    'right',
    'right-bottom',
    'right-top',
    'top',
  ]),
  layout: PropTypes.oneOf([
    'intrinsic',
    'fill',
    'responsive',
    'responsiveHeight',
  ]),
  alt: PropTypes.string.isRequired,
  imageClassName: PropTypes.string,
  onLoad: PropTypes.func,
};

LazyImage.defaultProps = {
  placeholder: null,
  placeholderSrcset: null,
  placeholderSizes: null,
  loading: 'lazy',
  className: null,
  objectFit: null,
  objectPosition: null,
  onLoad: null,
  layout: 'intrinsic',
  imageClassName: null,
};
