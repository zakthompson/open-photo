/* eslint-disable  react/jsx-props-no-spreading */
/* eslint-disable  react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { QueryClient, QueryClientProvider } from 'react-query';
import Header from '../components/Header';
import useSetup from '../hooks/useSetup';
import { UserProvider } from '../context/userContext';
import '../styles/index.scss';

const queryClient = new QueryClient();

function WithUser({ children }) {
  const { isLoading, error } = useSetup();
  return (
    <>
      {!isLoading && !error && children}
      {isLoading && <div>Loading...</div>}
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
      <Head>
        <title>Family Photos</title>
      </Head>
      <UserProvider>
        <WithUser>
          <QueryClientProvider client={queryClient}>
            <Header />
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
