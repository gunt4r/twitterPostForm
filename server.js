import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.post('/api/getAccessToken', async (req, res) => {
  const { clientId, client_secret } = req.body;

  if (!clientId || !client_secret) {
    return res
      .status(400)
      .json({ error: 'Client ID and Client Secret are required' });
  }

  try {
    const response = await axios.post(
      'https://api.twitter.com/2/oauth2/token',
      new URLSearchParams({
        grant_type: 'client_credentials',
      }).toString(),
      {
        headers: {
          Authorization: `Basic ${Buffer.from(`${clientId}:${client_secret}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
      }
    );

    res.json({ accessToken: response.data.access_token });
  } catch (error) {
    console.error(
      'Error: ',
      error.response?.data || error.message
    );
    res
      .status(500)
      .json({
        errors: error.response?.data?.errors || [{ message: error.message }],
      });
  }
});

app.post('/api/postTweet', async (req, res) => {
  const { accessToken, tweetText } = req.body;

  if (!accessToken || !tweetText) {
    return res
      .status(400)
      .json({ error: 'Access Token and text are required' });
  }

  try {
    const response = await axios.post(
      'https://api.twitter.com/2/tweets',
      { text: tweetText },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.json({ message: 'Tweet was published', tweet: response.data });
  } catch (error) {
    res
      .status(500)
      .json({ error: error.response?.data || 'Tweet has not been published.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
