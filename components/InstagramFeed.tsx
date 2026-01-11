'use client';

import { useEffect, useState } from 'react';

interface InstagramPost {
  id: string;
  caption: string;
  media_type: string;
  media_url: string;
  permalink: string;
  timestamp: string;
}

interface InstagramFeedData {
  username: string;
  posts: InstagramPost[];
}

interface InstagramFeedProps {
  clientId: string;
}

export default function InstagramFeed({ clientId }: InstagramFeedProps) {
  const [feedData, setFeedData] = useState<InstagramFeedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFeed() {
      try {
        console.log('[InstagramFeed Component] Fetching feed for clientId:', clientId);
        const response = await fetch(`/api/instagram/feed/${clientId}`);

        if (!response.ok) {
          const errorData = await response.json();
          console.error('[InstagramFeed Component] API error:', errorData);
          throw new Error(errorData.error || 'Failed to fetch Instagram feed');
        }

        const data = await response.json();
        console.log('[InstagramFeed Component] Received data:', data);
        console.log('[InstagramFeed Component] Number of posts:', data.posts?.length);

        // Log each post URL with full details
        data.posts?.forEach((post: InstagramPost, index: number) => {
          console.log(`[InstagramFeed Component] === POST ${index + 1} FULL DATA ===`);
          console.log('[InstagramFeed Component] id:', post.id);
          console.log('[InstagramFeed Component] media_type:', post.media_type);
          console.log('[InstagramFeed Component] media_url:', post.media_url);
          console.log('[InstagramFeed Component] permalink:', post.permalink);
          console.log('[InstagramFeed Component] caption:', post.caption?.substring(0, 100));
          console.log('[InstagramFeed Component] Full post object:', post);
          console.log('[InstagramFeed Component] === END POST DATA ===\n');
        });

        setFeedData(data);
      } catch (err) {
        console.error('[InstagramFeed Component] Error fetching feed:', err);
        setError(err instanceof Error ? err.message : 'Failed to load Instagram feed');
      } finally {
        setLoading(false);
      }
    }

    fetchFeed();
  }, [clientId]);

  if (loading) {
    return (
      <section className="bg-[#1B365D] py-16">
        <div className="container mx-auto px-4">
          <div className="text-center text-white">Loading Instagram feed...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-[#1B365D] py-16">
        <div className="container mx-auto px-4">
          <div className="text-center text-white">
            <p className="text-red-400">Error loading Instagram feed:</p>
            <p className="text-sm mt-2">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (!feedData) {
    return null; // Hide section if no data
  }

  return (
    <section className="bg-[#1B365D] py-16">
      <div className="container mx-auto px-4">
        {/* Header with Instagram icon and handle */}
        <div className="flex items-center justify-center gap-4 mb-8">
          {/* Instagram Icon */}
          <svg
            className="w-12 h-12"
            fill="#C4A25A"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>

          {/* Username */}
          <a
            href={`https://instagram.com/${feedData.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-serif text-4xl md:text-5xl text-white hover:text-[#C4A25A] transition-colors"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            @{feedData.username}
          </a>
        </div>

        {/* Horizontal scrolling posts */}
        <div className="relative">
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
            {feedData.posts.map((post, index) => {
              console.log(`[InstagramFeed Component] Rendering post ${index + 1}`);
              console.log(`  - ID: ${post.id}`);
              console.log(`  - img src: ${post.media_url}`);
              console.log(`  - href (permalink): ${post.permalink}`);
              console.log(`  - caption: ${post.caption?.substring(0, 50) || '(no caption)'}`);
              return (
                <a
                  key={post.id}
                  href={post.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 w-80 snap-start group"
                >
                  <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-800">
                    {/* media_url is already transformed by API: thumbnail_url for videos, media_url for images */}
                    <img
                      src={post.media_url}
                      alt={post.caption || 'Instagram post'}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                      crossOrigin="anonymous"
                      onLoad={() => {
                        console.log(`[InstagramFeed] Image loaded successfully for post ${post.id}`);
                      }}
                      onError={(e) => {
                        console.error('[InstagramFeed] Failed to load image:', post.media_url, 'for post:', post.id);
                        e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="320" height="320"%3E%3Crect width="320" height="320" fill="%23374151"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%239CA3AF" font-family="sans-serif" font-size="14"%3EImage unavailable%3C/text%3E%3C/svg%3E';
                      }}
                    />
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <svg
                          className="w-12 h-12 text-white"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  {/* Caption preview */}
                  {post.caption && (
                    <p className="mt-2 text-sm text-white line-clamp-2">
                      {post.caption}
                    </p>
                  )}
                </a>
              );
            })}
          </div>
        </div>

        {/* Custom styles for hiding scrollbar */}
        <style jsx>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </div>
    </section>
  );
}
