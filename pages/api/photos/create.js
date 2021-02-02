import AWS from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import { query as q } from 'faunadb';
import auth0 from '../../../utils/auth0';
import { create } from '../../../utils/fauna';
import config from '../../../config';

const endpoint = new AWS.Endpoint(config.wasabiUrl);
const s3 = new AWS.S3({ endpoint });

export default auth0.requireAuthentication(async (req, res) => {
  const { photo } = req.body;
  const base = uuid();
  const key = `${photo.familyId}/${base}/${photo.filename}`;
  const name = photo.name || photo.filename;
  const { description, type, familyId, creatorId } = photo;
  const expires = 60 * 30;
  try {
    const presignedUrl = s3.getSignedUrl('putObject', {
      Bucket: config.wasabiBucket,
      Key: `photos/${key}`,
      ContentType: type,
      Expires: expires,
    });

    const photoRes = await create(
      'photos',
      {
        key,
        name,
        description,
        family: q.Ref(q.Collection('families'), familyId),
        creator: q.Ref(q.Collection('users'), creatorId),
      },
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

    res.status(201).json({
      presignedUrl,
      data: photoRes,
      index: photo.index,
    });
  } catch (e) {
    console.error(e);
    res.status(e.status || 400).end(e.message);
  }
});
