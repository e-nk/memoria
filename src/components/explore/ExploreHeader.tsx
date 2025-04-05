// components/explore/ExploreHeader.tsx
import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface ExploreHeaderProps {
  onSearch: (query: string) => void;
  searchQuery: string;
}

const ExploreHeader = ({ onSearch, searchQuery }: ExploreHeaderProps) => {
  const [inputValue, setInputValue] = useState(searchQuery);
  
  // Update input value when search query changes
  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);
  
  // Handle search submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(inputValue.trim());
  };
  
  // Clear search
  const clearSearch = () => {
    setInputValue('');
    onSearch('');
  };
  
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold text-photo-secondary">
          Explore <span className="bg-clip-text text-transparent bg-gradient-to-r from-photo-blue to-photo-pink">Photos</span>
        </h1>
        <p className="text-photo-secondary/70 mt-2">
          Discover amazing photos from our community
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="relative max-w-lg">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-photo-secondary/50">
          <Search className="h-5 w-5" />
        </div>
        
        <input 
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Search photos by title, description, or tags..."
          className="w-full pl-10 pr-10 py-3 rounded-lg bg-photo-primary border border-photo-secondary/20 text-photo-secondary focus:border-photo-indigo focus:outline-none focus:ring-1 focus:ring-photo-indigo"
        />
        
        {inputValue && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-photo-secondary/50 hover:text-photo-secondary transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </form>
    </div>
  );
};

export default ExploreHeader;