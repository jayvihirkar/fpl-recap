import React from 'react';

const Background = ({ theme = 'default' }) => {
  // Define colors based on theme
  const colors = {
    default: ['bg-purple-500', 'bg-blue-500', 'bg-pink-500'],
    green:   ['bg-emerald-500', 'bg-green-400', 'bg-teal-500'],
    red:     ['bg-red-600', 'bg-orange-600', 'bg-rose-500'],
    dark:    ['bg-gray-800', 'bg-slate-700', 'bg-gray-900'],
    gold:    ['bg-yellow-500', 'bg-amber-400', 'bg-orange-300']
  };

  const [c1, c2, c3] = colors[theme] || colors.default;

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-black z-0">
      {/* Moving Blobs */}
      <div className={`absolute top-0 -left-4 w-72 h-72 ${c1} rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob`}></div>
      <div className={`absolute top-0 -right-4 w-72 h-72 ${c2} rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000`}></div>
      <div className={`absolute -bottom-8 left-20 w-72 h-72 ${c3} rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000`}></div>
      
      {/* Noise Overlay */}
      <div className="bg-noise"></div>
    </div>
  );
};

export default Background;
