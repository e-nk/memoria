"use client";

import { useEffect, useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import Container from '@/components/layouts/Container';
import ExploreHeader from '@/components/explore/ExploreHeader';
import ExploreGrid from '@/components/explore/ExploreGrid';

export default function ExplorePage() {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Get explore photos from Convex
  const explorePhotos = useQuery(api.photos.getExplorePhotos, { limit: 30 });
  
  // Get search results if there's a search query
  const searchResults = useQuery(
    api.photos.searchPhotos,
    searchQuery ? { searchQuery, limit: 50 } : "skip"
  );
  
  // Determine which photos to display
  const displayPhotos = searchQuery ? (searchResults || []) : (explorePhotos || []);
  
  // Update loading state when data is loaded
  useEffect(() => {
    if ((searchQuery && searchResults !== undefined) || 
        (!searchQuery && explorePhotos !== undefined)) {
      setLoading(false);
    }
  }, [searchQuery, searchResults, explorePhotos]);
  
  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setLoading(true);
  };

  return (
    <div className="py-8">
      <Container>
        <ExploreHeader 
          onSearch={handleSearch} 
          searchQuery={searchQuery}
        />
        
        <div className="mt-8">
          {loading ? (
            <div className="flex justify-center items-center py-24">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-photo-indigo"></div>
            </div>
          ) : displayPhotos.length === 0 ? (
            <div className="bg-photo-secondary/5 backdrop-blur-sm border border-photo-secondary/10 rounded-xl p-8 text-center">
              <p className="text-photo-secondary/70">
                {searchQuery 
                  ? `No photos found matching "${searchQuery}"`
                  : "No photos available for exploration yet"
                }
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-4 px-4 py-2 bg-photo-secondary/10 text-photo-secondary rounded-lg hover:bg-photo-secondary/20 transition-colors"
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <>
              {searchQuery && (
                <div className="mb-6">
                  <p className="text-photo-secondary/70">
                    Found {displayPhotos.length} results for "{searchQuery}"
                    <button
                      onClick={() => setSearchQuery('')}
                      className="ml-2 text-photo-indigo hover:underline"
                    >
                      Clear
                    </button>
                  </p>
                </div>
              )}
              
              <ExploreGrid photos={displayPhotos} />
            </>
          )}
        </div>
      </Container>
    </div>
  );
}