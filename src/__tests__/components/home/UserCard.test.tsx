import React from 'react';
import { render, screen } from '@testing-library/react';
import UserCard from '@/components/home/UserCard';

// Mock the necessary dependencies
jest.mock('convex/react', () => ({
  useQuery: jest.fn(() => 5), // Mock 5 albums for this user
}));

jest.mock('next/link', () => {
  return ({ children, href }) => {
    return <a href={href}>{children}</a>;
  };
});

describe('UserCard', () => {
  const mockUser = {
    _id: 'user1',
    name: 'John Doe',
    username: 'johndoe',
    email: 'john@example.com',
  };
  
  test('renders user information correctly', () => {
    render(<UserCard user={mockUser} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('@johndoe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });
  
  test('renders album count correctly', () => {
    render(<UserCard user={mockUser} />);
    
    // We mocked 5 albums above
    expect(screen.getByText('5 Albums')).toBeInTheDocument();
  });
  
  test('renders singular album text when only one album', () => {
    // Override the mock to return 1 album
    jest.spyOn(require('convex/react'), 'useQuery').mockImplementation(() => 1);
    
    render(<UserCard user={mockUser} />);
    
    expect(screen.getByText('1 Album')).toBeInTheDocument();
  });
  
  test('links to the correct user profile page', () => {
    const { container } = render(<UserCard user={mockUser} />);
    
    const link = container.querySelector('a');
    expect(link).toHaveAttribute('href', '/home/user/user1');
  });
});