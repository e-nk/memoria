import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PhotoHeader from '@/components/photo/PhotoHeader';

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }) => {
    return <a href={href}>{children}</a>;
  };
});

describe('PhotoHeader', () => {
  const mockPhoto = {
    _id: 'photo1',
    albumId: 'album1',
    userId: 'user1',
    title: 'Beach Sunset',
    imageUrl: '/images/sunset.jpg',
    thumbnailUrl: '/images/sunset-thumb.jpg',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  
  const mockAlbum = {
    _id: 'album1',
    userId: 'user1',
    title: 'Vacation Photos',
    isPublic: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();
  
  beforeEach(() => {
    mockOnEdit.mockClear();
    mockOnDelete.mockClear();
  });
  
  test('renders photo information correctly', () => {
    render(
      <PhotoHeader 
        photo={mockPhoto}
        album={mockAlbum}
        isOwner={false}
        isEditing={false}
      />
    );
    
    expect(screen.getByText(/Back to Album/i)).toBeInTheDocument();
    expect(screen.getByText(/Photo #/i)).toBeInTheDocument();
    expect(screen.getByText(/From album:/i)).toBeInTheDocument();
    expect(screen.getByText('Vacation Photos')).toBeInTheDocument();
  });
  
  test('shows edit and delete buttons when user is owner', () => {
    render(
      <PhotoHeader 
        photo={mockPhoto}
        album={mockAlbum}
        isOwner={true}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        isEditing={false}
      />
    );
    
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });
  
  test('does not show edit and delete buttons when user is not owner', () => {
    render(
      <PhotoHeader 
        photo={mockPhoto}
        album={mockAlbum}
        isOwner={false}
        isEditing={false}
      />
    );
    
    expect(screen.queryByText('Edit')).not.toBeInTheDocument();
    expect(screen.queryByText('Delete')).not.toBeInTheDocument();
  });
  
  test('does not show edit and delete buttons when in editing mode', () => {
    render(
      <PhotoHeader 
        photo={mockPhoto}
        album={mockAlbum}
        isOwner={true}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        isEditing={true}
      />
    );
    
    expect(screen.queryByText('Edit')).not.toBeInTheDocument();
    expect(screen.queryByText('Delete')).not.toBeInTheDocument();
  });
  
  test('calls onEdit when edit button is clicked', () => {
    render(
      <PhotoHeader 
        photo={mockPhoto}
        album={mockAlbum}
        isOwner={true}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        isEditing={false}
      />
    );
    
    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);
    
    expect(mockOnEdit).toHaveBeenCalledTimes(1);
  });
  
  test('calls onDelete when delete button is clicked', () => {
    render(
      <PhotoHeader 
        photo={mockPhoto}
        album={mockAlbum}
        isOwner={true}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        isEditing={false}
      />
    );
    
    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);
    
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });
});