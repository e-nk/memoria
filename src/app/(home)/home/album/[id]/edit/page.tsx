"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useAuth } from '@/context/AuthContext';
import { useAlbums } from '@/hooks/useAlbums';
import Container from '@/components/layouts/Container';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2, Lock, Globe } from 'lucide-react';

export default function AlbumEditPage() {
  const params = useParams();
  const router = useRouter();
  const albumId = params.id as string;
  const { userId } = useAuth();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  // Fetch album data
  const album = useQuery(api.albums.getAlbumById, { albumId });
  
  // Determine if the current user is the album owner
  const isOwner = album && userId ? album.userId === userId : false;
  
  const { updateAlbum } = useAlbums();
  
  // Initialize form values when album data is loaded
  useEffect(() => {
    if (album) {
      setTitle(album.title || '');
      setDescription(album.description || '');
      setCategory(album.category || '');
      setIsPublic(album.isPublic);
      setLoading(false);
    }
  }, [album]);
  
  // Handle unauthorized access
  useEffect(() => {
    if (!loading && album && !isOwner) {
      setError('You do not have permission to edit this album');
      // Redirect back to album view page after a delay
      setTimeout(() => {
        router.push(`/home/album/${albumId}`);
      }, 2000);
    }
  }, [loading, album, isOwner, albumId, router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!album || !isOwner) return;
    
    try {
      setIsSaving(true);
      setError('');
      
      const success = await updateAlbum({
        albumId: album._id,
        title: title.trim(),
        description: description.trim() || undefined,
        category: category.trim() || undefined,
        isPublic,
      });
      
      if (success) {
        // Navigate back to the album view
        router.push(`/home/album/${albumId}`);
      } else {
        setError('Failed to update album');
      }
    } catch (err) {
      console.error('Error updating album:', err);
      setError(err instanceof Error ? err.message : 'Failed to update album');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-8">
        <Container>
          <div className="flex justify-center items-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-photo-indigo"></div>
          </div>
        </Container>
      </div>
    );
  }

  if (error || !album) {
    return (
      <div className="py-8">
        <Container>
          <div className="py-12 text-center">
            <h2 className="text-xl font-semibold text-photo-secondary mb-2">
              {error || 'Album not found'}
            </h2>
            <p className="text-photo-secondary/70">
              The requested album could not be loaded.
            </p>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-8">
      <Container boxed>
        <div className="mb-6">
          <Link 
            href={`/home/album/${albumId}`} 
            className="inline-flex items-center gap-2 text-photo-secondary/70 hover:text-photo-secondary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Album</span>
          </Link>
          
          <h1 className="text-2xl font-bold text-photo-secondary mt-4">Edit Album</h1>
        </div>
        
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-photo-secondary/80 mb-1" htmlFor="title">
              Album Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-photo-primary border border-photo-secondary/20 rounded-lg text-photo-secondary focus:outline-none focus:ring-1 focus:ring-photo-indigo"
              placeholder="Enter album title"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-photo-secondary/80 mb-1" htmlFor="description">
              Description (optional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-photo-primary border border-photo-secondary/20 rounded-lg text-photo-secondary focus:outline-none focus:ring-1 focus:ring-photo-indigo resize-none"
              placeholder="Add a description"
              rows={4}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-photo-secondary/80 mb-1" htmlFor="category">
              Category (optional)
            </label>
            <input
              id="category"
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 bg-photo-primary border border-photo-secondary/20 rounded-lg text-photo-secondary focus:outline-none focus:ring-1 focus:ring-photo-indigo"
              placeholder="e.g., Vacation, Family, Nature"
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
          
          <div className="pt-4 flex items-center justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-photo-indigo to-photo-violet text-photo-secondary rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </Container>
    </div>
  );
}