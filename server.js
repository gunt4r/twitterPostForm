import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';
import OAuth1 from 'oauth-1.0a';
import crypto from 'crypto';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.post('/api/postTweet', async (req, res) => {
  const { api_key, api_secret, access_token, access_token_secret, tweetText } = req.body;

  if (!api_key || !api_secret || !access_token || !access_token_secret || !tweetText) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const oauth = OAuth1({
    consumer: {
      key: api_key,
      secret: api_secret,
    },
    signature_method: 'HMAC-SHA1',
    hash_function: (baseString, key) => crypto.createHmac('sha1', key).update(baseString).digest('base64'),
  });

  const token = {
    key: access_token,
    secret: access_token_secret,
  };

  const url = 'https://api.twitter.com/2/tweets';

  const authHeader = oauth.toHeader(oauth.authorize({
    url,
    method: 'POST',
  }, token));

  try {
    const response = await axios.post(url, { text: tweetText }, {
      headers: {
        ...authHeader,
        'Content-Type': 'application/json',
      },
    });

    res.json({ message: 'Tweet successfully posted!', tweet: response.data });
  } catch (error) {
    console.error('Error: ', error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || 'Failed to post tweet.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});