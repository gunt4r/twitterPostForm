import React, { useState,useEffect} from 'react';
import axios from 'axios';
import './App.css';

const App: React.FC = () => {
    const [apiKey, setApiKey] = useState('');
    const [apiSecret, setApiSecret] = useState('');
    const [accessToken, setAccessToken] = useState('');
    const [accessTokenSecret, setAccessTokenSecret] = useState('');
    const [tweetText, setTweetText] = useState('');
    const [responseMessage, setResponseMessage] = useState('');

    const postTweet = async () => {
      setResponseMessage('Publishing...');
      
      try {
        const response = await axios.post('http://localhost:5000/api/postTweet', {
          api_key: apiKey,
          api_secret: apiSecret,
          access_token: accessToken,
          access_token_secret: accessTokenSecret,
          tweetText,
        });

        setResponseMessage(`Success: ${response.data.message}`);
        
      } catch (error: any) {
        const errorData = error.response?.data;
        const errorMessage = errorData?.error?.message || 
                            errorData?.error ||
                            'Error publishing tweet';
        setResponseMessage(`Error: ${errorMessage}`);
      }
    };
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const oauthToken = urlParams.get('oauth_token');
        const oauthVerifier = urlParams.get('oauth_verifier');
      
        if (oauthToken && oauthVerifier) {
          // Отправляем verifier на сервер
          axios.post('http://localhost:5000/api/handle-callback', {
            oauth_token: oauthToken,
            oauth_verifier: oauthVerifier
          }).then(response => {
            // Сохраняем полученные токены
            setAccessToken(response.data.oauth_token);
            setAccessTokenSecret(response.data.oauth_token_secret);
            setResponseMessage('Successfully authenticated!');
            
            // Очищаем URL от параметров
            window.history.replaceState({}, document.title, "/");
          }).catch(error => {
            setResponseMessage('Authentication failed: ' + error.message);
          });
        }
      }, []);
    return (
        <div className="App">
            <h1>Twitter Bot Publisher</h1>

            <div className="input-group">
                <label>API Key:</label>
                <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                />
            </div>

            <div className="input-group">
                <label>API Key Secret:</label>
                <input
                    type="password"
                    value={apiSecret}
                    onChange={(e) => setApiSecret(e.target.value)}
                />
            </div>

            <div className="input-group">
                <label>Access Token:</label>
                <input
                    type="password"
                    value={accessToken}
                    onChange={(e) => setAccessToken(e.target.value)}
                />
            </div>

            <div className="input-group">
                <label>Access Token Secret:</label>
                <input
                    type="password"
                    value={accessTokenSecret}
                    onChange={(e) => setAccessTokenSecret(e.target.value)}
                />
            </div>

            <div className="input-group">
                <label>Tweet Text:</label>
                <textarea
                    value={tweetText}
                    onChange={(e) => setTweetText(e.target.value)}
                    maxLength={280}
                />
            </div>

            <button 
              onClick={postTweet}
              disabled={!apiKey || !apiSecret || !accessToken || !accessTokenSecret}
            >
                Publish Tweet
            </button>

            <div className="status-message">
                {responseMessage}
            </div>
        </div>
    );
};

export default App;