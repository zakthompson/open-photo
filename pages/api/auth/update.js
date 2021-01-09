import auth0 from '../../../utils/auth0';
import { update } from '../../../utils/fauna';

export default auth0.requireAuthentication(async (req, res) => {
  try {
    const { id, name } = req.body.user;
    const userRes = await update('users', id, { name });
    res.status(200).json(userRes);
  } catch (e) {
    console.error(e);
    res.status(e.status || 400).end(e.message);
  }
});
