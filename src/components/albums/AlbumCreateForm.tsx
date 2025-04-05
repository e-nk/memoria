"use client";

import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useAuth } from '@/context/AuthContext';
import { X, Plus, Lock, Globe, Loader2 } from 'lucide-react';

interface AlbumCreateFormProps {
  onAlbumCreated: () => void;
  onCancel: () => void;
}

const AlbumCreateForm = ({ onAlbumCreated, onCancel }: AlbumCreateFormProps) => {
  const { userId } = useAuth();
  const createAlbum = useMutation(api.albums.createAlbum);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Please enter an album title');
      return;
    }
    
    if (!userId) {
      setError('You must be logged in to create an album');
      return;
    }
    
    try {
			setIsSubmitting(true);
			setError('');
			
			// Create album in Convex and get the returned ID
			const albumId = await createAlbum({
				userId,
				title: title.trim(),
				description: description.trim() || undefined,
				category: category.trim() || undefined,
				isPublic,
			});
			
			console.log("Created album with ID:", albumId); // Add this to debug
			
			// Notify parent component
			onAlbumCreated();
    } catch (error) {
      console.error('Error creating album:', error);
      setError(error instanceof Error ? error.message : 'Failed to create album');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="bg-photo-secondary/5 backdrop-blur-sm border border-photo-secondary/10 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-photo-secondary">Create New Album</h3>
        <button
          onClick={onCancel}
          className="p-1 rounded-full hover:bg-photo-secondary/10 text-photo-secondary/70 hover:text-photo-secondary transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="album-title"
            className="block text-sm font-medium text-photo-secondary/80 mb-1"
          >
            Album Title*
          </label>
          <input
            id="album-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 bg-photo-primary border border-photo-secondary/20 rounded-lg text-photo-secondary focus:outline-none focus:ring-1 focus:ring-photo-indigo"
            placeholder="My Vacation Photos"
            required
          />
        </div>
        
        <div>
          <label
            htmlFor="album-description"
            className="block text-sm font-medium text-photo-secondary/80 mb-1"
          >
            Description (optional)
          </label>
          <textarea
            id="album-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 bg-photo-primary border border-photo-secondary/20 rounded-lg text-photo-secondary focus:outline-none focus:ring-1 focus:ring-photo-indigo resize-none"
            placeholder="Add a description for your album"
            rows={3}
          />
        </div>
        
        <div>
          <label
            htmlFor="album-category"
            className="block text-sm font-medium text-photo-secondary/80 mb-1"
          >
            Category (optional)
          </label>
          <input
            id="album-category"
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 bg-photo-primary border border-photo-secondary/20 rounded-lg text-photo-secondary focus:outline-none focus:ring-1 focus:ring-photo-indigo"
            placeholder="e.g. Vacation, Family, Nature"
          />
        </div>
        
        <div>
          <span className="block text-sm font-medium text-photo-secondary/80 mb-2">
            Privacy
          </span>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="privacy"
                checked={isPublic}
                onChange={() => setIsPublic(true)}
                className="sr-only"
              />
              <div className={`p-2 rounded-lg flex items-center gap-2 ${
                isPublic ? 'bg-photo-indigo/20 text-photo-indigo' : 'bg-photo-secondary/5 text-photo-secondary/70'
              }`}>
                <Globe className="h-4 w-4" />
                <span>Public</span>
              </div>
            </label>
            
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="privacy"
                checked={!isPublic}
                onChange={() => setIsPublic(false)}
                className="sr-only"
              />
              <div className={`p-2 rounded-lg flex items-center gap-2 ${
                !isPublic ? 'bg-photo-indigo/20 text-photo-indigo' : 'bg-photo-secondary/5 text-photo-secondary/70'
              }`}>
                <Lock className="h-4 w-4" />
                <span>Private</span>
              </div>
            </label>
          </div>
        </div>
        
        {error && (
          <div className="p-3 bg-red-500/10 text-red-500 rounded-lg">
            {error}
          </div>
        )}
        
        <div className="flex justify-end pt-2 gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-photo-secondary/20 text-photo-secondary/70 hover:text-photo-secondary hover:bg-photo-secondary/5 transition-colors"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-photo-indigo to-photo-violet text-photo-secondary rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Creating...</span>
              </>
            ) : (
              <>
                <Plus className="h-5 w-5" />
                <span>Create Album</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AlbumCreateForm;