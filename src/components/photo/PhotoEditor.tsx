// components/photo/PhotoEditor.tsx
import React, { useState } from 'react';
import { Save, X, Tag } from 'lucide-react';

interface PhotoEditorProps {
  initialTitle: string;
  initialDescription: string;
  initialTags: string[];
  onSave: (title: string, description?: string, tags?: string[]) => void;
  onCancel: () => void;
  isLoading: boolean;
}

const PhotoEditor = ({ 
  initialTitle, 
  initialDescription, 
  initialTags,
  onSave, 
  onCancel, 
  isLoading 
}: PhotoEditorProps) => {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [tagsInput, setTagsInput] = useState(initialTags.join(', '));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Trim and validate title
    const trimmedTitle = title.trim();
    if (trimmedTitle.length === 0) {
      alert('Please enter a title for the photo');
      return;
    }
    
    // Process tags
    const tags = tagsInput
      ? tagsInput.split(',')
          .map(tag => tag.trim())
          .filter(tag => tag.length > 0)
      : [];
    
    onSave(
      trimmedTitle, 
      description.trim() || undefined, 
      tags.length > 0 ? tags : undefined
    );
  };

  return (
    <div className="mt-6 bg-photo-secondary/5 backdrop-blur-sm border border-photo-secondary/10 rounded-xl p-4">
      <h3 className="text-lg font-medium text-photo-secondary mb-3">Edit Photo Details</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label 
              htmlFor="photo-title" 
              className="block text-sm font-medium text-photo-secondary/80 mb-1"
            >
              Title
            </label>
            <input
              id="photo-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-photo-primary border border-photo-secondary/20 text-photo-secondary focus:border-photo-indigo focus:outline-none focus:ring-1 focus:ring-photo-indigo"
              placeholder="Enter photo title"
              disabled={isLoading}
            />
          </div>
          
          <div>
            <label 
              htmlFor="photo-description" 
              className="block text-sm font-medium text-photo-secondary/80 mb-1"
            >
              Description (optional)
            </label>
            <textarea
              id="photo-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-photo-primary border border-photo-secondary/20 text-photo-secondary focus:border-photo-indigo focus:outline-none focus:ring-1 focus:ring-photo-indigo"
              placeholder="Add a description"
              rows={3}
              disabled={isLoading}
            />
          </div>
          
          <div>
            <label 
              htmlFor="photo-tags" 
              className="block text-sm font-medium text-photo-secondary/80 mb-1"
            >
              Tags (optional)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Tag className="h-4 w-4 text-photo-secondary/50" />
              </div>
              <input
                id="photo-tags"
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full pl-10 pr-3 py-2 rounded-lg bg-photo-primary border border-photo-secondary/20 text-photo-secondary focus:border-photo-indigo focus:outline-none focus:ring-1 focus:ring-photo-indigo"
                placeholder="nature, vacation, family (comma separated)"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-photo-secondary/20 text-photo-secondary/80 hover:text-photo-secondary hover:bg-photo-secondary/5 transition-colors"
            disabled={isLoading}
          >
            <span className="flex items-center gap-2">
              <X className="h-4 w-4" />
              Cancel
            </span>
          </button>
          
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-photo-indigo hover:bg-photo-indigo/90 text-photo-secondary transition-colors"
            disabled={isLoading}
          >
            <span className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save Changes
            </span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default PhotoEditor;