/**
 * src/pages/Trending.tsx
 * 
 * Trending page component.
 * Displays a list of trending videos scanned in real-time from social media.
 * Each video displays a title, thumbnail, detection confidence, and tags indicating suspicion.
 * Placeholder data used; integrate with backend API for real content.
 */

import React from 'react';

interface VideoScan {
  id: number;
  title: string;
  thumbnail: string;
  confidence: number;
  isFake: boolean;
}

const dummyData: VideoScan[] = [
  {
    id: 1,
    title: 'Celebrity Speech Clip',
    thumbnail: '/images/thumb1.jpg',
    confidence: 92,
    isFake: true,
  },
  {
    id: 2,
    title: 'News Anchor Segment',
    thumbnail: '/images/thumb2.jpg',
    confidence: 15,
    isFake: false,
  },
  {
    id: 3,
    title: 'Political Debate Highlights',
    thumbnail: '/images/thumb3.jpg',
    confidence: 80,
    isFake: true,
  },
];

const Trending: React.FC = () => {
  return (
    <section className="max-w-5xl mx-auto p-4 space-y-6">
      <h2 className="text-3xl font-bold text-primary">Trending Deepfake Scans</h2>
      <ul className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {dummyData.map(({ id, title, thumbnail, confidence, isFake }) => (
          <li key={id} className="border border-secondary rounded overflow-hidden shadow hover:shadow-lg transition">
            <img src={thumbnail} alt={title} className="w-full h-40 object-cover" />
            <div className="p-4 space-y-2">
              <h3 className="text-xl font-semibold">{title}</h3>
              <p>Confidence: {confidence}%</p>
              <span
                className={`inline-block px-3 py-1 rounded text-sm font-semibold ${
                  isFake ? 'bg-error text-background' : 'bg-success text-background'
                }`}
              >
                {isFake ? 'Suspected Fake' : 'Verified'}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Trending;
