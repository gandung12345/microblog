import React from 'react';
import { Loader2, Sparkles, AlertCircle } from 'lucide-react';

export function LoadingState({ message = "Resting and fetching contents..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-[#718096]">
      <Loader2 className="w-8 h-8 animate-spin text-[#8C9A8E] mb-3" />
      <p className="text-sm font-medium tracking-wide">{message}</p>
    </div>
  );
}

export function EmptyState({ message = "No articles discovered under this topic yet." }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-[#F5F3EF] border border-[#E8E5DF] rounded-3xl text-center text-[#718096] my-6">
      <Sparkles className="w-8 h-8 text-[#A0AEC0] mb-2" />
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-[#FFF5F5] border border-[#FEB2B2] rounded-3xl text-center text-[#C53030] my-6">
      <AlertCircle className="w-8 h-8 text-[#E53E3E] mb-2" />
      <h3 className="text-base font-semibold">Unable to sync right now</h3>
      {message && <p className="text-xs mt-1 text-[#9B2C2C] mb-4">{message}</p>}
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-5 py-2 bg-[#E53E3E] text-white rounded-full text-xs font-medium hover:bg-[#C53030] transition shadow-sm"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
