import React from 'react';

export default function GalleriesHeader({ mediaType, setMediaType }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-200 dark:border-zinc-800">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
          Photo & Media Gallery
        </h1>
        <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
          High-resolution photography showcasing Cambodian landmarks and scenery
        </p>
      </div>

      <div className="flex p-0.5 bg-gray-100 dark:bg-zinc-800 rounded-md text-xs font-semibold">
        {['All', 'Image', 'Video'].map((type) => (
          <button
            key={type}
            onClick={() => setMediaType(type)}
            className={`px-3 py-1 rounded transition-colors cursor-pointer ${
              mediaType === type
                ? 'bg-white dark:bg-zinc-700 text-[#003E83] dark:text-[#60a5fa] shadow-xs'
                : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {type === 'Image' ? 'Photos' : type === 'Video' ? 'Videos' : 'All'}
          </button>
        ))}
      </div>
    </div>
  );
}
