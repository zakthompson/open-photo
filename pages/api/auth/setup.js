import { getAllRelated, getByAttribute, create } from '../../../utils/fauna';
import auth0 from '../../../utils/auth0';

export default auth0.requireAuthentication(async (req, res) => {
  try {
    const { user } = await auth0.getSession(req);
    let dbUser = await getByAttribute('users', 'uid', user.sub);
    if (dbUser.error) {
      dbUser = await create('users', { uid: user.sub });
    }
    const families = await getAllRelated('families', 'users', dbUser.id);

    const data = {
      ...dbUser,
      families,
    };
    res.status(200).json(data);
  } catch (e) {
    console.error(e);
    res.status(e.status || 400).end(e.message);
  }
});
