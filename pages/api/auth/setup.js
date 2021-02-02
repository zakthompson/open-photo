import { getByAttribute, create } from '../../../utils/fauna';
import auth0 from '../../../utils/auth0';

export default auth0.requireAuthentication(async (req, res) => {
  try {
    const { user } = await auth0.getSession(req);
    let dbUser = await getByAttribute(
      'users',
      'uid',
      user.sub,
      ['uid', 'name'],
      [
        {
          name: 'families',
          collection: 'families',
          many: true,
          keys: ['name'],
        },
      ],
    );
    if (dbUser.error) {
      dbUser = await create(
        'users',
        { uid: user.sub },
        ['uid', 'name'],
        [
          {
            name: 'families',
            collection: 'families',
            many: true,
            keys: ['name'],
          },
        ],
      );
    }

    res.status(200).json(dbUser);
  } catch (e) {
    console.error(e);
    res.status(e.status || 400).end(e.message);
  }
});
