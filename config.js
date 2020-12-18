export default {
  // server-side
  hostUrl: process.env.HOST_URL || 'localhost',
  auth0Domain: process.env.AUTH0_DOMAIN || '',
  auth0ClientId: process.env.AUTH0_CLIENT_ID || '',
  auth0ClientSecret: process.env.AUTH0_CLIENT_SECRET || '',
  loginRedirect:
    process.env.LOGIN_REDIRECT || 'http://localhost:3000/api/auth/callback',
  logoutRedirect: process.env.LOGOUT_REDIRECT || 'http://localhost:3000',
  cookieSecret: process.env.COOKIE_SECRET || '',
  faunaUrl: process.env.FAUNA_URL || 'https://graphql.fauna.com/graphql',
  faunaApiKey: process.env.FAUNA_API_KEY || '',

  // client-side
  imagekitUrl: process.env.NEXT_PUBLIC_IMAGEKIT_URL || '',
};
