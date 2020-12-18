import config from '../config';

export default async function fauna(query) {
  try {
    const res = await fetch(config.faunaUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${config.faunaApiKey}`,
      },
      body: JSON.stringify({ query }),
    });

    return await res.json();
  } catch (e) {
    console.error(e);
    return Promise.reject(e.message);
  }
}
