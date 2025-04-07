import '@testing-library/jest-dom';
import React from 'react';

// Mock the next/router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: {},
      asPath: '',
      push: jest.fn(),
      replace: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn(),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
      isFallback: false,
    };
  },
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
    };
  },
  useParams() {
    return {};
  },
  usePathname() {
    return '';
  },
  useSearchParams() {
    return {
      get: jest.fn(),
    };
  },
}));

// Mock the useAuth hook from @clerk/nextjs
jest.mock('@clerk/nextjs', () => ({
  useAuth: jest.fn(() => ({
    isSignedIn: true,
    isLoaded: true,
  })),
  useUser: jest.fn(() => ({
    user: {
      id: 'user123',
      fullName: 'Test User',
      username: 'testuser',
      emailAddresses: [{ id: 'email123', emailAddress: 'test@example.com' }],
      primaryEmailAddressId: 'email123',
      imageUrl: 'https://example.com/image.png',
    },
    isLoaded: true,
  })),
  // Use React.createElement instead of JSX
  SignInButton: jest.fn(({ children }) => React.createElement('div', null, children)),
  UserButton: jest.fn(() => React.createElement('div', null, 'User Button')),
}));

// Mock custom context
jest.mock('@/context/AuthContext', () => ({
  useAuth: jest.fn(() => ({
    isLoaded: true,
    isAuthenticated: true,
    userId: 'user123',
    userDetails: {
      _id: 'user123',
      name: 'Test User',
      username: 'testuser',
      email: 'test@example.com',
    },
  })),
}));

// This silences console errors during tests (optional)
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
};