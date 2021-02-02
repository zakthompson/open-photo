import auth0 from '../../../utils/auth0';
import { getById } from '../../../utils/fauna';

export default auth0.requireAuthentication(async (req, res) => {
  const { photoId } = req.query;
  try {
    const photoRes = await getById(
      'photos',
      photoId,
      ['key', 'name', 'description'],
      [
        {
          name: 'creator',
          collection: 'users',
          keys: ['name'],
        },
        {
          name: 'galleries',
          collection: 'galleries',
          many: true,
          keys: ['name'],
        },
      ],
    );
    res.status(200).json(photoRes);
  } catch (e) {
    console.error(e);
    res.status(e.status || 400).end(e.message);
  }
});
