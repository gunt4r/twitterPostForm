import axios from 'axios';
import OAuth from 'oauth-1.0a';
import crypto from 'crypto';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const rl = createInterface({ input, output });

const config = {
  api_key: '54WG76UlbgSlFEMnZeG2W5pZn',
  api_secret: 'Q71d5ICejFmULfihr129ixPsl0rNBs2SjwnYQAmmxOzjMC5EjU',
  callback_url: 'http://localhost:5137/',
};
const oauth = OAuth({
  consumer: {
    key: config.api_key,
    secret: config.api_secret,
  },
  signature_method: 'HMAC-SHA1',
  hash_function: (baseString, key) =>
    crypto.createHmac('sha1', key).update(baseString).digest('base64'),
});

// Шаг 1: Получение временных токенов (исправлено)
async function getRequestToken() {
  try {
    const requestData = {
      url: 'https://api.twitter.com/oauth/request_token',
      method: 'POST',
      data: { oauth_callback: config.callback_url },
    };

    // Генерируем подпись с callback
    const authHeader = oauth.toHeader(oauth.authorize(requestData));

    console.log('Auth Header:', authHeader); // Для отладки

    const response = await axios.post(requestData.url, null, {
      headers: {
        ...authHeader,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return Object.fromEntries(new URLSearchParams(response.data));
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    process.exit(1);
  }
}
async function authorizeUser(oauth_token) {
  const authUrl = `https://api.twitter.com/oauth/authenticate?oauth_token=${oauth_token}`;
  console.log('\nOpen this URL in your browser:\n', authUrl, '\n');
  return await rl.question('Enter the PIN from Twitter: ');
}

async function getAccessToken(oauth_token, oauth_token_secret, verifier) {
  try {
    const requestData = {
      url: 'https://api.twitter.com/oauth/access_token',
      method: 'POST',
      data: { oauth_verifier: verifier },
    };

    const token = {
      key: oauth_token,
      secret: oauth_token_secret,
    };

    const headers = oauth.toHeader(oauth.authorize(requestData, token));

    const response = await axios.post(requestData.url, null, {
      headers: headers,
      params: { oauth_verifier: verifier },
    });

    return Object.fromEntries(new URLSearchParams(response.data));
  } catch (error) {
    console.error(
      'Error getting access token:',
      error.response?.data || error.message
    );
    process.exit(1);
  }
}

async function main() {
  try {
    const { oauth_token, oauth_token_secret } = await getRequestToken();
    const verifier = await authorizeUser(oauth_token);
    const tokens = await getAccessToken(
      oauth_token,
      oauth_token_secret,
      verifier
    );

    console.log('\nAccess Tokens:');
    console.log('oauth_token:', tokens.oauth_token);
    console.log('oauth_token_secret:', tokens.oauth_token_secret);
    console.log('user_id:', tokens.user_id);
    console.log('screen_name:', tokens.screen_name);

    rl.close();
  } catch (error) {
    console.error('Process failed:', error);
    process.exit(1);
  }
}

main();
