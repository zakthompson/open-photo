import auth0 from '../../../utils/auth0';
import fauna from '../../../utils/fauna';

export default auth0.requireAuthentication(async (req, res) => {
  const { familyId } = req.query;
  try {
    const familyRes = await fauna(`{
      familyPhotosSortedByTsDesc(familyId: "${familyId}", _size: 50) {
        data {
          _id,
          name,
          key,
          creator {
            _id,
            uid,
            name,
          },
          tags {
            data {
              _id,
              name,
            }
          }
        }
      }
    }`);
    res.status(200).json(familyRes.data.familyPhotosSortedByTsDesc.data);
  } catch (e) {
    console.error(e);
    res.status(e.status || 400).end(e.message);
  }
});
