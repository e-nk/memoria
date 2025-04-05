"use client";

import { useEffect, useState } from 'react';
import Container from '@/components/layouts/Container';
import ExploreHeader from '@/components/explore/ExploreHeader';
import ExploreGrid from '@/components/explore/ExploreGrid';

interface PhotoProps {
  id: number;
  albumId: number;
  title: string;
  url: string;
  thumbnailUrl: string;
}

export default function ExplorePage() {
  const [photos, setPhotos] = useState<PhotoProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 20;

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        setLoading(true);
        
        // Get a random starting point to simulate exploration
        const start = Math.floor(Math.random() * 4500) + 1;
        
        const response = await fetch(`https://jsonplaceholder.typicode.com/photos?_start=${start}&_limit=${limit}`);
        const data = await response.json();
        
        setPhotos(data);
        setHasMore(data.length === limit);
      } catch (error) {
        console.error('Error fetching photos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  const loadMore = async () => {
    try {
      setLoading(true);
      
      const nextPage = page + 1;
      const start = Math.floor(Math.random() * 4500) + 1;
      
      const response = await fetch(`https://jsonplaceholder.typicode.com/photos?_start=${start}&_limit=${limit}`);
      const data = await response.json();
      
      setPhotos(prev => [...prev, ...data]);
      setPage(nextPage);
      setHasMore(data.length === limit);
    } catch (error) {
      console.error('Error fetching more photos:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-8">
      <Container>
        <ExploreHeader />
        
        <div className="mt-8">
          {photos.length === 0 && loading ? (
            <div className="flex justify-center items-center py-24">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-photo-indigo"></div>
            </div>
          ) : (
            <>
              <ExploreGrid photos={photos} />
              
              <div className="mt-8 flex justify-center">
                <button
                  onClick={loadMore}
                  disabled={loading || !hasMore}
                  className="px-6 py-3 rounded-lg bg-photo-secondary/5 hover:bg-photo-secondary/10 text-photo-secondary/80 hover:text-photo-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-photo-indigo"></div>
                      Loading...
                    </span>
                  ) : hasMore ? (
                    'Load More Photos'
                  ) : (
                    'No More Photos'
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </Container>
    </div>
  );
}