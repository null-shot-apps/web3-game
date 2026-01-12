'use client';

import { Player } from '@/app/game/page';

type GameOverProps = {
  winner: Player;
  onPlayAgain: () => void;
  onLeaveGame: () => void;
};

export default function GameOver({ winner, onPlayAgain, onLeaveGame }: GameOverProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-2xl w-full shadow-2xl border border-white/20 text-center">
        <div className="mb-6">
          <div className="text-8xl mb-4">🏆</div>
          <h1 className="text-5xl font-bold text-yellow-300 mb-4">
            {winner.name} Wins!
          </h1>
          <p className="text-white/80 text-xl">
            Congratulations! You&apos;re the Crypto Token Champion! 🎉
          </p>
        </div>

        <div className="mb-8 p-6 bg-white/5 rounded-lg border border-white/10">
          <p className="text-white/70 text-lg">
            {winner.name} survived with <span className="text-red-400 font-bold">❤️ {winner.lives} {winner.lives === 1 ? 'life' : 'lives'}</span> remaining!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={onPlayAgain}
            className="flex-1 px-6 py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-colors text-lg"
          >
            Play Again 🔄
          </button>
          <button
            onClick={onLeaveGame}
            className="flex-1 px-6 py-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-colors text-lg"
          >
            Leave Game 🚪
          </button>
        </div>

        <div className="mt-6">
          <p className="text-white/60 text-sm">
            Made with ❤️ Jennycruzy
          </p>
        </div>
      </div>
    </div>
  );
}



