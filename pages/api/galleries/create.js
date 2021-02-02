import { query as q } from 'faunadb';
import { create } from '../../../utils/fauna';
import auth0 from '../../../utils/auth0';

export default auth0.requireAuthentication(async (req, res) => {
  const { gallery } = req.body;
  const { name, familyId, creatorId } = gallery;
  try {
    const galleryRes = await create(
      'galleries',
      {
        name,
        family: q.Ref(q.Collection('families'), familyId),
        creator: q.Ref(q.Collection('users'), creatorId),
      },
      ['name'],
      [
        {
          name: 'creator',
          collection: 'users',
          keys: ['name'],
        },
        {
          name: 'family',
          collection: 'families',
          keys: ['name'],
        },
      ],
    );
    res.status(201).json(galleryRes);
  } catch (e) {
    console.error(e);
    res.status(e.status || 400).end(e.message);
  }
});
