import { initAuth0 } from '@auth0/nextjs-auth0';
import config from '../config';

export default initAuth0({
  domain: config.auth0Domain,
  clientId: config.auth0ClientId,
  clientSecret: config.auth0ClientSecret,
  scope: 'openid profile',
  redirectUri: config.loginRedirect,
  postLogoutRedirectUri: config.logoutRedirect,
  session: {
    cookieSecret: config.cookieSecret,
    cookieLifetime: 60 * 60 * 8,
    cookieDomain: config.hostUrl,
    storeAccessToken: true,
  },
});
