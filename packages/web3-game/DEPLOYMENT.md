# 🚀 Deployment Guide - Crypto Token Bomb Party

This game has **TWO parts** that need to be deployed separately:

## 📦 Part 1: Backend Server (Socket.IO)

**Location**: `packages/web3-game-backend/`

### Option A: Deploy to Railway (Easiest)

1. Go to [railway.app](https://railway.app) and sign up
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your repository
4. Click **"Add variables"** and set:
   - **Root Directory**: `packages/web3-game-backend`
5. Railway will auto-deploy
6. **Copy your backend URL** (e.g., `https://your-app.railway.app`)

### Option B: Deploy to Render

1. Go to [render.com](https://render.com) and sign up
2. Click **"New"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `crypto-bomb-backend`
   - **Root Directory**: `packages/web3-game-backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Click **"Create Web Service"**
6. **Copy your backend URL** (e.g., `https://crypto-bomb-backend.onrender.com`)

---

## 🎨 Part 2: Frontend (Next.js)

**Location**: `packages/web3-game/`

### Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign up
2. Click **"Add New"** → **"Project"**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `packages/web3-game`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
5. **Add Environment Variable**:
   - **Key**: `NEXT_PUBLIC_BACKEND_URL`
   - **Value**: Your backend URL from Step 1 (e.g., `https://your-app.railway.app`)
6. Click **"Deploy"**
7. **Your game is live!** 🎉

---

## 🔧 Alternative: Deploy Frontend to Netlify

1. Go to [netlify.com](https://netlify.com) and sign up
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect your GitHub repository
4. Configure:
   - **Base directory**: `packages/web3-game`
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
5. **Add Environment Variable**:
   - **Key**: `NEXT_PUBLIC_BACKEND_URL`
   - **Value**: Your backend URL (e.g., `https://your-app.railway.app`)
6. Click **"Deploy site"**

---

## ✅ Verify Deployment

1. Open your frontend URL (from Vercel/Netlify)
2. Click **"Create Game"**
3. Share the room code with friends
4. Start playing!

---

## 🐛 Troubleshooting

### "Cannot connect to server"
- Make sure your backend is deployed and running
- Check that `NEXT_PUBLIC_BACKEND_URL` environment variable is set correctly in Vercel/Netlify
- Verify the backend URL is accessible (visit it in your browser - you should see "Cannot GET /")

### "Room not found"
- Make sure the backend server is running
- Check browser console for connection errors

### Backend keeps sleeping (Render free tier)
- Render free tier sleeps after 15 minutes of inactivity
- Consider upgrading to a paid plan or use Railway instead

---

## 💰 Cost

- **Railway**: Free tier includes 500 hours/month (enough for testing)
- **Render**: Free tier (sleeps after 15 min inactivity)
- **Vercel**: Free tier (perfect for frontend)
- **Netlify**: Free tier (perfect for frontend)

**Total cost for hobby use: $0** 🎉

---

## 📝 Summary

1. ✅ Deploy backend to Railway/Render
2. ✅ Copy backend URL
3. ✅ Deploy frontend to Vercel/Netlify with backend URL as environment variable
4. ✅ Play the game!

Need help? Check the README files in each package folder.

