import auth0 from '../../../utils/auth0';
import { getAllRelated } from '../../../utils/fauna';

export default auth0.requireAuthentication(async (req, res) => {
  const { familyId, galleryId } = req.query;
  try {
    const photosRes = await getAllRelated(
      'photos',
      familyId ? 'families' : 'galleries',
      familyId || galleryId,
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
          max: 1000,
        },
      ],
    );
    res.status(200).json(photosRes);
  } catch (e) {
    console.error(e);
    res.status(e.status || 400).end(e.message);
  }
});
