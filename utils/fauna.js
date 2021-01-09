import faunadb, { query as q } from 'faunadb';
import config from '../config';

const client = new faunadb.Client({ secret: config.faunaSecret });

function serialize(res, relations) {
  const relationObj = relations.reduce((obj, next) => {
    if (Array.isArray(res.data[next])) {
      return {
        ...obj,
        [next]: res.data[next].map((x) => x.id),
      };
    }
    return {
      ...obj,
      [next]: res.data[next].id,
    };
  }, {});

  return {
    id: res.ref?.id,
    createdAt: res.ts,
    error: res.error,
    ...res.data,
    ...relationObj,
  };
}

export async function getById(collection, id, relations = []) {
  const res = await client.query(q.Get(q.Ref(q.Collection(collection), id)));

  return serialize(res, relations);
}

export async function update(collection, id, data, relations = []) {
  const res = await client.query(
    q.Update(q.Ref(q.Collection(collection), id), { data }),
  );

  return serialize(res, relations);
}

export async function getAllRelated(
  collection,
  attribute,
  value,
  relations = [],
) {
  const index = `${collection}_by_${attribute}`;
  const res = await client.query(
    q.Map(
      q.Let(
        {
          paginate_options: { size: 100 },
        },
        q.Paginate(
          q.Match(q.Index(index), q.Ref(q.Collection(attribute), value)),
        ),
      ),
      q.Lambda(
        'x',
        // x could be a ref or an array that contains a ref
        // Depends on whether it is a sorted index or not
        q.If(
          q.IsArray(q.Var('x')),
          q.Get(q.Select([1], q.Var('x'))),
          q.Get(q.Var('x')),
        ),
      ),
    ),
  );

  return res.data.map((doc) => serialize(doc, relations));
}

export async function getAllByAttribute(
  collection,
  attribute,
  value,
  relations = [],
) {
  const index = `${collection}_by_${attribute}`;
  const res = await client.query(
    q.Map(q.Match(q.Index(index), value), q.Lambda('x', q.Get(q.Var('x')))),
  );

  return res.map((doc) => serialize(doc, relations));
}

export async function getByAttribute(
  collection,
  attribute,
  value,
  relations = [],
) {
  const index = `${collection}_by_${attribute}`;
  const res = await client.query(
    q.Let(
      {
        ref: q.Match(q.Index(index), value),
      },
      q.If(q.Exists(q.Var('ref')), q.Get(q.Var('ref')), {
        error: 'Item not found',
      }),
    ),
  );

  return serialize(res, relations);
}

export async function create(collection, data, relations = []) {
  const res = await client.query(q.Create(q.Collection(collection), { data }));

  return serialize(res, relations);
}

export default client;
