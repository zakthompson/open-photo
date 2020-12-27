import auth0 from '../../../utils/auth0';
import fauna from '../../../utils/fauna';

export default auth0.requireAuthentication(async (req, res) => {
  const { photoId } = req.query;
  try {
    const photoRes = await fauna(`{
      findPhotoByID(id: "${photoId}") {
        _id,
        name,
        key,
        description,
        creator {
          name,
        }
      }
    }`);
    console.log(photoRes);
    res.status(200).json(photoRes.data.findPhotoByID);
  } catch (e) {
    console.error(e);
    res.status(e.status || 400).end(e.message);
  }
});
