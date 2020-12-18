/* eslint-disable  react/jsx-props-no-spreading */
/* eslint-disable  react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import Header from '../components/Header';
import useSetup from '../hooks/useSetup';
import '../styles/index.scss';

function MyApp({ Component, pageProps }) {
  const { user } = useSetup();
  return (
    <>
      <Head>
        <title>Family Photos</title>
      </Head>
      <Header user={user} />
      <Component {...pageProps} user={user} />
    </>
  );
}

MyApp.propTypes = {
  Component: PropTypes.func.isRequired,
  pageProps: PropTypes.object.isRequired,
};

export default MyApp;
