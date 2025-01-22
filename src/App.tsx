/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const App: React.FC = () => {
    const [clientId, setClientId] = useState('');
    const [client_secret, setClient_secret] = useState('');
    const [accessToken, setAccessToken] = useState('');
    const [tweetText, setTweetText] = useState('');
    const [responseMessage, setResponseMessage] = useState('');

    const getAccessToken = async () => {
      try {
        const response = await axios.post('http://localhost:5000/api/getAccessToken', {
          clientId,
          client_secret,
        });
        setAccessToken(response.data.accessToken);
        setResponseMessage('Token was successfully retrieved');
      } catch (error: any) {
        const errorMessage = error.response?.data?.errors
          ? error.response.data.errors.map((e: any) => e.message).join(", ")
          : 'Error getting token.';
        setResponseMessage(errorMessage);
      }
    };
    
    const postTweet = async () => {
      try {
        const response = await axios.post('http://localhost:5000/api/postTweet', {
          accessToken,
          tweetText,
        });
        setResponseMessage(response.data.message);
      } catch (error: any) {
        const errorMessage = error.response?.data?.errors
          ? error.response.data.errors.map((e: any) => e.message).join(", ")
          : 'Error publishing tweet';
        setResponseMessage(errorMessage);
      }
    };
    
    return (
        <div className="App">
            <h1>Publish tweets</h1>

            <div>
                <label>Client ID:</label>
                <input
                    type="text"
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                />
            </div>

            <div>
                <label>Client Secret:</label>
                <input
                    type="text"
                    value={client_secret}
                    onChange={(e) => setClient_secret(e.target.value)}
                />
            </div>

            <button onClick={getAccessToken}>Get access token</button>
            <p>{typeof responseMessage === 'string' ? responseMessage : 'Неизвестная ошибка'}</p>

            {accessToken && (
                <div>
                    <p>Access Token: {accessToken}</p>

                    <div>
                        <label>Тweet text:</label>
                        <textarea
                            value={tweetText}
                            onChange={(e) => setTweetText(e.target.value)}
                        ></textarea>
                    </div>

                    <button onClick={postTweet}>Publish tweet</button>
                </div>
            )}

        </div>
    );
};

export default App;