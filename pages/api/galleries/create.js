import auth0 from '../../../utils/auth0';
import fauna from '../../../utils/fauna';

export default auth0.requireAuthentication(async (req, res) => {
  const { gallery } = req.body;
  try {
    const galleryRes = await fauna(`mutation {
      createGallery(data: {
        name: "${gallery.name}",
        family: { connect: "${gallery.familyId}" },
        creator: { connect: "${gallery.creatorId}" }
      }) {
        _id
      }
    }`);
    res.status(201).json(galleryRes.data.createGallery);
  } catch (e) {
    console.error(e);
    res.status(e.status || 400).end(e.message);
  }
});
