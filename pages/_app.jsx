/* eslint-disable  react/jsx-props-no-spreading */
/* eslint-disable  react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { QueryClient, QueryClientProvider } from 'react-query';
import GoogleFonts from 'next-google-fonts';
import '../styles/index.scss';

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }) {
  return (
    <>
      <GoogleFonts href="https://fonts.googleapis.com/css2?family=Overpass:ital,wght@0,100;0,300;0,700;0,800;1,100&display=swap" />
      <Head>
        <title>Family Photos</title>
      </Head>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </>
  );
}

MyApp.propTypes = {
  Component: PropTypes.func.isRequired,
  pageProps: PropTypes.object.isRequired,
};

export default MyApp;
