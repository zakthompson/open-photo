import auth0 from '../../../utils/auth0';
import fauna from '../../../utils/fauna';

export default auth0.requireAuthentication(async (req, res) => {
  try {
    const { id, uid, name } = req.body.user;
    const userRes = await fauna(`mutation {
      updateUser(id: "${id}", data: { uid: "${uid}", name: "${name}" }) {
        _id,
        uid,
        name,
        families {
          data {
            _id,
            name,
            users {
              data {
                uid
              }
            }
          }
        }
      }
    }`);
    res.status(200).json(userRes.data.updateUser);
  } catch (e) {
    console.error(e);
    res.status(e.status || 400).end(e.message);
  }
});
