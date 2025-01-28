TwitterPostForm is a full-stack web application that allows users to create and post tweets to X.com (formerly Twitter). Built with React for the frontend and Express for the backend, this project demonstrates how to integrate with the X.com API to post tweets programmatically.

Features
Create Tweets: Write and post tweets directly from the app.

User Authentication: Securely authenticate with X.com using OAuth 2.0.

Backend API: Express server handles API requests and interacts with the X.com API.

Technologies Used
Frontend: React, Axios

Backend: Express.js, Node.js, X.com API

Authentication: OAuth 2.0

Package Manager: npm 

Prerequisites
Before running the project, ensure you have the following installed:

Node.js (v16 or higher)

npm

X.com Developer Account (to access the API)

Setup
1. Clone the Repository

git clone https://github.com/gunt4r/twitterPostForm.git

2. Install Dependencies
Install dependencies for both the frontend and backend:

npm install


3. Run the Application
Start the backend server:

node server.js 

Start the frontend development server:

npm run dev


API Endpoints
POST /api/postTweet: Post a new tweet.


Contributing
Contributions are welcome! If you'd like to contribute, please follow these steps:

Fork the repository.

Create a new branch (git checkout -b feature/your-feature-name).

Commit your changes (git commit -m 'Add some feature').

Push to the branch (git push origin feature/your-feature-name).

Open a pull request.

License
This project is licensed under the MIT License. See the LICENSE file for details.
