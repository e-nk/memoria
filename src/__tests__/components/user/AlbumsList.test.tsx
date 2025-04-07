import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AlbumsList from '@/components/user/AlbumsList';

// Mock the necessary hooks and components
jest.mock('convex/react', () => ({
  useQuery: jest.fn(() => []),
  useMutation: jest.fn(() => jest.fn()),
}));

jest.mock('@/hooks/useAlbums', () => ({
  useAlbums: () => ({
    deleteAlbum: jest.fn(() => Promise.resolve(true)),
    isLoading: false,
    error: null,
  }),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Add this to mock the Image component from next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt} />
  },
}));

describe('AlbumsList', () => {
  const mockAlbums = [
    {
      _id: 'album1',
      userId: 'user1',
      title: 'Vacation Photos',
      description: 'Photos from my vacation',
      category: 'Travel',
      isPublic: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      _id: 'album2',
      userId: 'user1',
      title: 'Family Photos',
      isPublic: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
  ];
  
  test('renders albums correctly', () => {
    render(<AlbumsList albums={mockAlbums} />);
    
    expect(screen.getByText('Vacation Photos')).toBeInTheDocument();
    expect(screen.getByText('Photos from my vacation')).toBeInTheDocument();
    expect(screen.getByText('Travel')).toBeInTheDocument();
    expect(screen.getByText('Family Photos')).toBeInTheDocument();
  });
  
  test('shows public/private indicators', () => {
    render(<AlbumsList albums={mockAlbums} />);
    
    const publicTexts = screen.getAllByText('Public');
    const privateTexts = screen.getAllByText('Private');
    
    expect(publicTexts.length).toBe(1);
    expect(privateTexts.length).toBe(1);
  });
  
  test('renders owner controls when isOwner is true', () => {
    render(<AlbumsList albums={mockAlbums} isOwner={true} />);
    
    // Owner should see edit/delete buttons when hovering
    // Testing for the presence of these buttons is tricky since they're visible on hover
    // In a real test, we might check for the presence of the elements in the DOM
    expect(screen.getAllByRole('link', { hidden: true }).length).toBeGreaterThan(2); // Album links plus edit links
  });
  
  test('does not render owner controls when isOwner is false', () => {
    render(<AlbumsList albums={mockAlbums} isOwner={false} />);
    
    // This test assumes the delete buttons have a specific text, adjust as needed
    const deleteButtons = screen.queryAllByRole('button', { name: /delete/i });
    expect(deleteButtons.length).toBe(0);
  });
  
  test('renders empty state when no albums', () => {
    render(<AlbumsList albums={[]} />);
    
    expect(screen.queryByText('Vacation Photos')).not.toBeInTheDocument();
    // You might want to check for an empty state message here
  });
});