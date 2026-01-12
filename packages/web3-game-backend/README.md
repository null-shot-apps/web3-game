# Crypto Token Bomb Party - Backend Server

This is the backend server for the Crypto Token Bomb Party game.

## Deployment Instructions

### Deploy to Railway (Recommended)

1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select this repository
4. Set root directory to `packages/web3-game-backend`
5. Railway will auto-detect Node.js and deploy
6. Copy the deployed URL (e.g., `https://your-app.railway.app`)

### Deploy to Render

1. Go to [render.com](https://render.com)
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Set:
   - **Root Directory**: `packages/web3-game-backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Click "Create Web Service"
6. Copy the deployed URL

### Deploy to Heroku

1. Install Heroku CLI
2. Run:
```bash
cd packages/web3-game-backend
heroku create your-app-name
git push heroku main
```
3. Copy the deployed URL

## Environment Variables

No environment variables required! The server runs on the PORT provided by the hosting platform.

## After Deployment

Once deployed, copy your backend URL and update the frontend:

1. Open `packages/web3-game/src/app/game/page.tsx`
2. Find line: `const socket = io('http://localhost:3001');`
3. Replace with: `const socket = io('YOUR_BACKEND_URL');`
4. Deploy the frontend to Vercel

## Local Development

```bash
npm install
npm start
```

Server runs on http://localhost:3001

