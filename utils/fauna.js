import faunadb, { query as q } from 'faunadb';
import config from '../config';

const client = new faunadb.Client({ secret: config.faunaSecret });

function mapKeys(varName, keys) {
  return keys.reduce(
    (obj, next) => {
      return {
        ...obj,
        [next]: q.Select(['data', next], q.Var(varName)),
      };
    },
    {
      id: q.Select(['ref', 'id'], q.Var(varName)),
      createdAt: q.Select(['ts'], q.Var(varName)),
    },
  );
}

function mapRelations(varName, collection, id, relations) {
  return relations.reduce((obj, next) => {
    const index = `${next.collection}_by_${collection}`;
    if (next.many) {
      return {
        ...obj,
        [next.name]: q.Let(
          {
            [`col-${next.name}`]: q.Map(
              q.Let(
                {
                  paginate_options: next.max || 100,
                },
                q.Paginate(q.Match(q.Index(index), id)),
              ),
              q.Lambda(
                `${next.name}`,
                q.Let(
                  {
                    rel: q.If(
                      q.IsArray(q.Var(next.name)),
                      q.Get(q.Select([1], q.Var(next.name))),
                      q.Get(q.Var(next.name)),
                    ),
                  },
                  {
                    ...mapKeys('rel', next.keys),
                  },
                ),
              ),
            ),
          },
          q.Select(['data'], q.Var(`col-${next.name}`)),
        ),
      };
    }

    return {
      ...obj,
      [next.name]: q.Let(
        {
          rel: q.Get(q.Select(['data', next.name], q.Var(varName))),
        },
        {
          ...mapKeys('rel', next.keys),
        },
      ),
    };
  }, {});
}

export async function getById(collection, id, keys, relations = []) {
  const res = await client.query(
    q.Let(
      {
        obj: q.Get(q.Ref(q.Collection(collection), id)),
      },
      {
        ...mapKeys('obj', keys),
        ...mapRelations('obj', collection, id, relations),
      },
    ),
  );

  return res;
}

export async function update(collection, id, data, keys = [], relations = []) {
  const res = await client.query(
    q.Let(
      {
        obj: q.Update(q.Ref(q.Collection(collection), id), { data }),
      },
      {
        ...mapKeys('obj', keys),
        ...mapRelations('obj', collection, id, relations),
      },
    ),
  );

  return res;
}

export async function getAllRelated(
  collection,
  attribute,
  value,
  keys,
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
        q.Let(
          {
            obj: q.If(
              q.IsArray(q.Var('x')),
              q.Get(q.Select([1], q.Var('x'))),
              q.Get(q.Var('x')),
            ),
          },
          {
            ...mapKeys('obj', keys),
            ...mapRelations(
              'obj',
              collection,
              q.Select(['ref'], q.Var('obj')),
              relations,
            ),
          },
        ),
      ),
    ),
  );

  return res;
}

export async function getAllByAttribute(
  collection,
  attribute,
  value,
  keys,
  relations = [],
) {
  const index = `${collection}_by_${attribute}`;
  const res = await client.query(
    q.Map(
      q.Match(q.Index(index), value),
      q.Lambda(
        'x',
        q.Let(
          {
            obj: q.Get(q.Var('x')),
          },
          {
            ...mapKeys('obj', keys),
            ...mapRelations(
              'obj',
              collection,
              q.Select(['ref'], q.Var('obj')),
              relations,
            ),
          },
        ),
      ),
    ),
  );

  return res;
}

export async function getByAttribute(
  collection,
  attribute,
  value,
  keys,
  relations = [],
) {
  const index = `${collection}_by_${attribute}`;
  const res = await client.query(
    q.Let(
      {
        ref: q.Match(q.Index(index), value),
      },
      q.If(
        q.Exists(q.Var('ref')),
        q.Let(
          {
            obj: q.Get(q.Var('ref')),
          },
          {
            ...mapKeys('obj', keys),
            ...mapRelations(
              'obj',
              collection,
              q.Select(['ref'], q.Var('obj')),
              relations,
            ),
          },
        ),
        {
          error: 'Item not found',
        },
      ),
    ),
  );

  return res;
}

export async function create(collection, data, keys = [], relations = []) {
  const res = await client.query(
    q.Let(
      {
        obj: q.Create(q.Collection(collection), { data }),
      },
      {
        ...mapKeys('obj', keys),
        ...mapRelations(
          'obj',
          collection,
          q.Select(['ref'], q.Var('obj')),
          relations,
        ),
      },
    ),
  );

  return res;
}

export default client;
