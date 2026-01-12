# 💣 Crypto Token Bomb Party - Frontend

A fast-paced multiplayer game where players race to type crypto token names before time runs out!

## 🎮 Game Rules

- Up to **15 players** can join a game
- Each player gets **10 seconds** to type a valid crypto token name
- Each player has **3 lives**
- Token names **cannot be repeated** in the same game
- Last player standing wins! 🏆

## 🚀 Quick Start (Local Development)

1. **Install dependencies**:
```bash
npm install
```

2. **Set up environment**:
```bash
cp .env.example .env.local
```

3. **Make sure backend is running** (see `packages/web3-game-backend/`)

4. **Start the dev server**:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## 📦 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment instructions.

**Quick summary**:
1. Deploy backend to Railway/Render
2. Deploy frontend to Vercel with backend URL as environment variable

## 🔧 Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

For production, set this to your deployed backend URL (e.g., `https://your-app.railway.app`)

## 🛠️ Tech Stack

- **Next.js 15** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS**
- **Socket.IO Client** (for real-time multiplayer)

## 📁 Project Structure

```
packages/web3-game/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Home page (create/join room)
│   │   ├── game/
│   │   │   └── page.tsx      # Game page
│   │   └── layout.tsx
│   └── components/
│       ├── GameLobby.tsx     # Waiting room
│       ├── GamePlay.tsx      # Main gameplay
│       └── GameOver.tsx      # Winner screen
├── public/
├── .env.example
└── package.json
```

## 🎯 Features

- ✅ Real-time multiplayer (Socket.IO)
- ✅ Token validation via CoinGecko API
- ✅ Turn-based gameplay with 10-second timer
- ✅ Lives system (3 lives per player)
- ✅ No repeated tokens
- ✅ Responsive design
- ✅ Beautiful gradient UI

## 🐛 Troubleshooting

### "Cannot connect to server"
Make sure the backend server is running and `NEXT_PUBLIC_BACKEND_URL` is set correctly.

### "Invalid token" for valid tokens
The game fetches tokens from CoinGecko API. If the API is down, it falls back to a basic list. Wait a moment and try again.

## 📄 License

MIT

