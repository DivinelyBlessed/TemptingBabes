const SYSTEME_KEY = process.env.SYSTEME_API_KEY;
const POPUP_TAG_ID = 2021881;
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

exports.handler = async function(event) {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers: CORS, body: 'Method not allowed' };

  let email, firstName;
  try {
    ({ email, firstName } = JSON.parse(event.body));
  } catch (e) {
    return { statusCode: 400, headers: CORS, body: 'Bad request' };
  }

  if (!email) return { statusCode: 400, headers: CORS, body: 'Email required' };

  async function addTag(contactId) {
    await fetch(`https://api.systeme.io/api/contacts/${contactId}/tags`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-API-Key': SYSTEME_KEY },
      body: JSON.stringify({ tagId: POPUP_TAG_ID })
    });
  }

  const createRes = await fetch('https://api.systeme.io/api/contacts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-API-Key': SYSTEME_KEY },
    body: JSON.stringify({ email, firstName: firstName || undefined })
  });

  if (createRes.status === 201) {
    const data = await createRes.json();
    await addTag(data.id);
    return { statusCode: 200, headers: CORS, body: 'ok' };
  }

  if (createRes.status === 422) {
    const lookupRes = await fetch(`https://api.systeme.io/api/contacts?email=${encodeURIComponent(email)}`, {
      headers: { 'X-API-Key': SYSTEME_KEY }
    });
    const lookup = await lookupRes.json();
    if (lookup.items && lookup.items.length > 0) {
      await addTag(lookup.items[0].id);
      return { statusCode: 200, headers: CORS, body: 'ok' };
    }
  }

  return { statusCode: 500, headers: CORS, body: 'Failed' };
};
