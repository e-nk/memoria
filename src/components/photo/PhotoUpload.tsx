"use client";

import { useState, useRef } from 'react';
import { usePhotoUpload } from '@/utils/uploadUtils';
import { useAuth } from '@/context/AuthContext';
import { Upload, X, Image, Loader2 } from 'lucide-react';

interface PhotoUploadProps {
  albumId: string;
  onUploadComplete: () => void;
	onCancel: () => void;
}

const PhotoUpload = ({ albumId, onUploadComplete }: PhotoUploadProps) => {
  const { userId } = useAuth();
  const { uploadPhoto } = usePhotoUpload();
  
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Handle drag and drop events
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFileSelect(file);
    }
  };
  
  // Handle file selection
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      handleFileSelect(file);
    }
  };
  
  const handleFileSelect = (file: File) => {
    setErrorMessage('');
    
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select an image file');
      return;
    }
    
    setSelectedFile(file);
    setTitle(file.name.split('.')[0]); // Use filename as default title
    
    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  // Remove selected file
  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreview(null);
    setTitle('');
    setDescription('');
    setTags('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Handle upload
  const handleUpload = async () => {
    if (!selectedFile || !userId || !albumId) return;
    
    try {
      setIsUploading(true);
      setErrorMessage('');
      
      // Process tags
      const tagArray = tags
        ? tags.split(',').map((tag) => tag.trim()).filter((tag) => tag.length > 0)
        : undefined;
      
      // Upload to Convex
      await uploadPhoto({
        file: selectedFile,
        albumId,
        userId,
        title: title || selectedFile.name,
        description: description || undefined,
        tags: tagArray,
      });
      
      // Reset form
      handleRemoveFile();
      
      // Notify parent component
      onUploadComplete();
    } catch (error) {
      console.error('Upload error:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to upload photo');
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className="bg-photo-secondary/5 backdrop-blur-sm border border-photo-secondary/10 rounded-xl p-6">
      <h3 className="text-xl font-semibold text-photo-secondary mb-4">Upload Photo</h3>
      
      {!selectedFile ? (
        // Upload area
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragging
              ? 'border-photo-indigo bg-photo-indigo/5'
              : 'border-photo-secondary/20 hover:border-photo-indigo/50 hover:bg-photo-secondary/5'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileInputChange}
          />
          
          <Upload className="h-10 w-10 mx-auto text-photo-secondary/50" />
          <p className="mt-4 text-photo-secondary/80">
            Drag and drop an image here, or click to select
          </p>
          <p className="mt-2 text-photo-secondary/50 text-sm">
            JPEG, PNG, WebP or GIF • Up to 5MB
          </p>
        </div>
      ) : (
        // Preview and upload form
        <div>
          <div className="flex flex-col md:flex-row gap-6">
            {/* Preview */}
            <div className="w-full md:w-1/3 relative">
              <div className="relative aspect-square rounded-lg overflow-hidden bg-photo-secondary/5">
                {preview && (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <button
                onClick={handleRemoveFile}
                className="absolute top-2 right-2 p-1 rounded-full bg-photo-primary/80 text-photo-secondary hover:bg-photo-primary"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Form */}
            <div className="flex-1 space-y-4">
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
                  className="w-full px-3 py-2 bg-photo-primary border border-photo-secondary/20 rounded-lg text-photo-secondary focus:outline-none focus:ring-1 focus:ring-photo-indigo"
                  placeholder="Enter a title for your photo"
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
                  className="w-full px-3 py-2 bg-photo-primary border border-photo-secondary/20 rounded-lg text-photo-secondary focus:outline-none focus:ring-1 focus:ring-photo-indigo resize-none"
                  placeholder="Add a description"
                  rows={3}
                />
              </div>
              
              <div>
                <label
                  htmlFor="photo-tags"
                  className="block text-sm font-medium text-photo-secondary/80 mb-1"
                >
                  Tags (optional)
                </label>
                <input
                  id="photo-tags"
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full px-3 py-2 bg-photo-primary border border-photo-secondary/20 rounded-lg text-photo-secondary focus:outline-none focus:ring-1 focus:ring-photo-indigo"
                  placeholder="Enter tags separated by commas (nature, vacation, family)"
                />
              </div>
            </div>
          </div>
          
          {/* Error message */}
          {errorMessage && (
            <div className="mt-4 p-3 bg-red-500/10 text-red-500 rounded-lg">
              {errorMessage}
            </div>
          )}
          
          {/* Upload button */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleUpload}
              disabled={isUploading}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-photo-indigo to-photo-violet text-photo-secondary rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Image className="h-5 w-5" />
                  <span>Upload Photo</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoUpload;