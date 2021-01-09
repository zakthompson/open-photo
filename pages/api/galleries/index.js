import auth0 from '../../../utils/auth0';
import { getAllRelated } from '../../../utils/fauna';

export default auth0.requireAuthentication(async (req, res) => {
  const { familyId } = req.query;
  try {
    const galleryRes = await getAllRelated('galleries', 'families', familyId, [
      'family',
      'creator',
    ]);
    res.status(200).json(galleryRes);
  } catch (e) {
    console.error(e);
    res.status(e.status || 400).end(e.message);
  }
});
