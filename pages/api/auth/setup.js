import auth0 from '../../../utils/auth0';
import fauna from '../../../utils/fauna';

export default auth0.requireAuthentication(async (req, res) => {
  try {
    const { user } = await auth0.getSession(req);
    let data;
    let dbUser = await fauna(`{
      findUserByUID(uid: "${user.sub}") {
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
    if (!dbUser.data) {
      dbUser = await fauna(`mutation {
        createUser(data: { uid: "${user.sub}" }) {
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
      if (!dbUser.data) {
        throw new Error(JSON.stringify(dbUser.errors));
      }
      data = dbUser.data.createUser;
    } else {
      data = dbUser.data.findUserByUID;
    }

    res.status(200).json(data);
  } catch (e) {
    console.error(e);
    res.status(e.status || 400).end(e.message);
  }
});
