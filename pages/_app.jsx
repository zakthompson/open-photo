/* eslint-disable  react/jsx-props-no-spreading */
/* eslint-disable  react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { QueryClient, QueryClientProvider } from 'react-query';
import GoogleFonts from 'next-google-fonts';
import useSetup from '../hooks/useSetup';
import { UserProvider } from '../context/userContext';
import Loader from '../components/Loader';
import '../styles/index.scss';

const queryClient = new QueryClient();

function WithUser({ children }) {
  const { isLoading, error } = useSetup();
  return (
    <>
      {!isLoading && !error && children}
      {isLoading && (
        <div className="absolute inset-0">
          <Loader />
        </div>
      )}
      {error && (
        <div>An error has occurred. Please try refreshing the page.</div>
      )}
    </>
  );
}

WithUser.propTypes = {
  children: PropTypes.node.isRequired,
};

function MyApp({ Component, pageProps }) {
  return (
    <>
      <GoogleFonts href="https://fonts.googleapis.com/css2?family=Overpass:ital,wght@0,100;0,300;0,700;0,800;1,100&display=swap" />
      <Head>
        <title>Family Photos</title>
      </Head>
      <UserProvider>
        <WithUser>
          <QueryClientProvider client={queryClient}>
            <Component {...pageProps} />
          </QueryClientProvider>
        </WithUser>
      </UserProvider>
    </>
  );
}

MyApp.propTypes = {
  Component: PropTypes.func.isRequired,
  pageProps: PropTypes.object.isRequired,
};

export default MyApp;
