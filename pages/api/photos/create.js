import AWS from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import auth0 from '../../../utils/auth0';
import fauna from '../../../utils/fauna';
import config from '../../../config';

const endpoint = new AWS.Endpoint(config.wasabiUrl);
const s3 = new AWS.S3({ endpoint });

export default auth0.requireAuthentication(async (req, res) => {
  const { photo } = req.body;
  const base = uuid();
  const key = `${photo.familyId}/${base}/${photo.filename}`;
  const name = photo.name || photo.filename;
  const { type } = photo;
  const expires = 60 * 30;
  try {
    const presignedUrl = s3.getSignedUrl('putObject', {
      Bucket: config.wasabiBucket,
      Key: `photos/${key}`,
      ContentType: type,
      Expires: expires,
    });

    const photoRes = await fauna(`mutation {
      createPhoto(data: {
        name: "${name}",
        key: "${key}",
        family: { connect: "${photo.familyId}" },
        creator: { connect: "${photo.creatorId}" }
        ${photo.galleryId ? `gallery: { connect: "${photo.galleryId}" }` : ''}
      }) {
        _id
      }
    }`);
    res.status(201).json({
      presignedUrl,
      data: photoRes.data.createPhoto,
      index: photo.index,
    });
  } catch (e) {
    console.error(e);
    res.status(e.status || 400).end(e.message);
  }
});
