import React, { useState } from 'react';
import { Save, X } from 'lucide-react';

interface PhotoEditorProps {
  initialTitle: string;
  onSave: (newTitle: string) => void;
  onCancel: () => void;
  isLoading: boolean;
}

const PhotoEditor = ({ initialTitle, onSave, onCancel, isLoading }: PhotoEditorProps) => {
  const [title, setTitle] = useState(initialTitle);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Trim and validate title
    const trimmedTitle = title.trim();
    if (trimmedTitle.length === 0) {
      alert('Please enter a title for the photo');
      return;
    }
    
    onSave(trimmedTitle);
  };

  return (
    <div className="mt-6 bg-photo-secondary/5 backdrop-blur-sm border border-photo-secondary/10 rounded-xl p-4">
      <h3 className="text-lg font-medium text-photo-secondary mb-3">Edit Photo Title</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <textarea
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-photo-primary border border-photo-secondary/20 text-photo-secondary focus:border-photo-indigo focus:outline-none focus:ring-1 focus:ring-photo-indigo"
            placeholder="Enter photo title"
            rows={3}
            disabled={isLoading}
          />
        </div>
        
        <div className="flex items-center justify-end gap-3">
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