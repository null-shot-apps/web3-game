'use client';

import { useState, useEffect, useRef } from 'react';
import { Player } from '@/app/game/page';

type GamePlayProps = {
  roomCode: string;
  players: Player[];
  setPlayers: (players: Player[]) => void;
  currentPlayerId: string;
  setCurrentPlayerId: (id: string) => void;
  usedTokens: Set<string>;
  setUsedTokens: (tokens: Set<string>) => void;
  onGameOver: (winner: Player) => void;
};

export default function GamePlay({
  players,
  setPlayers,
  currentPlayerId,
  setCurrentPlayerId,
  usedTokens,
  setUsedTokens,
  onGameOver,
}: GamePlayProps) {
  const [tokenInput, setTokenInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(10);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [message, setMessage] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [allTokens, setAllTokens] = useState<Set<string>>(new Set());
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch all token names from CoinGecko on mount
  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/coins/list');
        const data = await response.json() as Array<{ name: string }>;
        const tokenNames = new Set(data.map((coin) => coin.name.toLowerCase()));
        setAllTokens(tokenNames);
      } catch (error) {
        console.error('Failed to fetch tokens:', error);
        // Fallback to a basic list if API fails
        setAllTokens(new Set(['bitcoin', 'ethereum', 'solana', 'cardano', 'ripple', 'polkadot', 'dogecoin', 'avalanche', 'polygon', 'chainlink']));
      }
    };
    fetchTokens();
  }, []);

  // Initialize first player
  useEffect(() => {
    const activePlayers = players.filter(p => !p.isEliminated);
    if (activePlayers.length > 0 && !currentPlayerId) {
      setCurrentPlayerId(activePlayers[0].id);
      setCurrentPlayerIndex(0);
    }
  }, [players, currentPlayerId, setCurrentPlayerId]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      handleTimeout();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  // Focus input when it's the current player's turn
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentPlayerId]);

  const handleTimeout = () => {
    const activePlayers = players.filter(p => !p.isEliminated);
    const currentPlayer = activePlayers[currentPlayerIndex];
    
    if (currentPlayer) {
      const updatedPlayers = players.map(p => {
        if (p.id === currentPlayer.id) {
          const newLives = p.lives - 1;
          return {
            ...p,
            lives: newLives,
            isEliminated: newLives <= 0,
          };
        }
        return p;
      });
      
      setPlayers(updatedPlayers);
      setMessage(`⏰ ${currentPlayer.name} ran out of time! Lost a life.`);
      
      setTimeout(() => {
        moveToNextPlayer(updatedPlayers);
      }, 2000);
    }
  };

  const validateToken = async (token: string): Promise<boolean> => {
    const normalizedToken = token.toLowerCase().trim();
    
    // Check if token has been used
    if (usedTokens.has(normalizedToken)) {
      return false;
    }
    
    // Check if token exists in our list
    return allTokens.has(normalizedToken);
  };

  const handleSubmit = async () => {
    if (!tokenInput.trim() || isValidating) return;

    setIsValidating(true);
    const isValid = await validateToken(tokenInput);

    const activePlayers = players.filter(p => !p.isEliminated);
    const currentPlayer = activePlayers[currentPlayerIndex];

    if (isValid) {
      // Correct answer
      const newUsedTokens = new Set(usedTokens);
      newUsedTokens.add(tokenInput.toLowerCase().trim());
      setUsedTokens(newUsedTokens);
      setMessage(`✅ ${currentPlayer.name} got it right! "${tokenInput}"`);
      
      setTimeout(() => {
        moveToNextPlayer(players);
      }, 1500);
    } else {
      // Wrong answer
      const reason = usedTokens.has(tokenInput.toLowerCase().trim()) 
        ? 'Token already used!' 
        : 'Invalid token!';
      
      const updatedPlayers = players.map(p => {
        if (p.id === currentPlayer.id) {
          const newLives = p.lives - 1;
          return {
            ...p,
            lives: newLives,
            isEliminated: newLives <= 0,
          };
        }
        return p;
      });
      
      setPlayers(updatedPlayers);
      setMessage(`❌ ${currentPlayer.name} - ${reason} Lost a life.`);
      
      setTimeout(() => {
        moveToNextPlayer(updatedPlayers);
      }, 2000);
    }

    setTokenInput('');
    setIsValidating(false);
  };

  const moveToNextPlayer = (updatedPlayers: Player[]) => {
    const activePlayers = updatedPlayers.filter(p => !p.isEliminated);
    
    if (activePlayers.length === 1) {
      onGameOver(activePlayers[0]);
      return;
    }
    
    if (activePlayers.length === 0) {
      return;
    }

    const nextIndex = (currentPlayerIndex + 1) % activePlayers.length;
    setCurrentPlayerIndex(nextIndex);
    setCurrentPlayerId(activePlayers[nextIndex].id);
    setTimeLeft(10);
    setMessage('');
  };

  const activePlayers = players.filter(p => !p.isEliminated);
  const currentPlayer = activePlayers[currentPlayerIndex];

  if (!currentPlayer) {
    return <div className="text-white text-center p-8">Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-4xl w-full shadow-2xl border border-white/20">
        {/* Timer */}
        <div className="text-center mb-6">
          <div className={`text-6xl font-bold ${timeLeft <= 3 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
            {timeLeft}
          </div>
          <p className="text-white/70 text-sm mt-2">seconds remaining</p>
        </div>

        {/* Current Player */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-yellow-300 mb-2">
            {currentPlayer.name}&apos;s Turn
          </h2>
          <p className="text-white/80">Type a crypto token name!</p>
        </div>

        {/* Input */}
        <div className="mb-6">
          <input
            ref={inputRef}
            type="text"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="e.g., Bitcoin, Ethereum, Solana..."
            disabled={isValidating}
            className="w-full px-6 py-4 rounded-lg bg-white/20 text-white text-xl placeholder-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <button
            onClick={handleSubmit}
            disabled={!tokenInput.trim() || isValidating}
            className="w-full mt-3 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors"
          >
            {isValidating ? 'Checking...' : 'Submit'}
          </button>
        </div>

        {/* Message */}
        {message && (
          <div className="text-center mb-6 p-4 bg-white/10 rounded-lg">
            <p className="text-white font-semibold text-lg">{message}</p>
          </div>
        )}

        {/* Players Status */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-64 overflow-y-auto">
          {players.map((player) => (
            <div
              key={player.id}
              className={`rounded-lg p-3 border ${
                player.isEliminated
                  ? 'bg-red-900/30 border-red-500/50 opacity-50'
                  : player.id === currentPlayer.id
                  ? 'bg-yellow-500/30 border-yellow-400 ring-2 ring-yellow-400'
                  : 'bg-white/10 border-white/20'
              }`}
            >
              <p className="text-white font-medium truncate">{player.name}</p>
              <p className="text-white/80 text-sm">
                {player.isEliminated ? '💀 Out' : `❤️ ${player.lives}`}
              </p>
            </div>
          ))}
        </div>

        {/* Used Tokens Count */}
        <div className="mt-6 text-center">
          <p className="text-white/70 text-sm">
            Tokens used: {usedTokens.size} | Players left: {activePlayers.length}
          </p>
        </div>
      </div>
    </div>
  );
}



