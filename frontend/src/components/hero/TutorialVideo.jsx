import React, { useState } from 'react';

const TutorialVideo = ({ sectorCode }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  // Map sector codes to video URLs (placeholder for now)
  const videoUrls = {
    'BANKING': 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    'HEALTHCARE': 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    'EDUCATION': 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    'RETAIL': 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    'MANUFACTURING': 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    'LOGISTICS': 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    'CONTENT': 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  };

  const videoUrl = videoUrls[sectorCode] || videoUrls['BANKING'];

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold text-gray-800">Watch Tutorial</h3>
      <div className="relative aspect-video bg-gray-900 rounded-xl overflow-hidden shadow-lg">
        {!isPlaying ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600">
            <button
              onClick={() => setIsPlaying(true)}
              className="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-6 transform hover:scale-110 transition-all duration-200 shadow-2xl"
              aria-label="Play video"
            >
              <svg className="w-16 h-16 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
            </button>
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <p className="text-lg font-semibold">Introduction to {sectorCode}</p>
              <p className="text-sm opacity-80">Learn how to get started in 5 minutes</p>
            </div>
          </div>
        ) : (
          <iframe
            src={`${videoUrl}?autoplay=1`}
            title={`${sectorCode} Tutorial Video`}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        )}
      </div>
      <p className="text-sm text-gray-600">
        This tutorial covers the basics of using our platform for {sectorCode.toLowerCase()} operations.
      </p>
    </div>
  );
};

export default TutorialVideo;
