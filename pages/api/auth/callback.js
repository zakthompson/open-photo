import auth0 from '../../../utils/auth0';

export default async (req, res) => {
  try {
    await auth0.handleCallback(req, res);
  } catch (e) {
    console.error(e);
    res.status(e.status || 400).end(e.message);
  }
};
