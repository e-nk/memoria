"use client";

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Container from '@/components/layouts/Container';
import HomeHeader from '@/components/home/HomeHeader';
import UsersList from '@/components/home/UsersList';

export default function HomePage() {
  const { user, isLoaded } = useUser();
  const [users, setUsers] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch users
        const usersResponse = await fetch('https://jsonplaceholder.typicode.com/users');
        const usersData = await usersResponse.json();
        
        // Fetch albums
        const albumsResponse = await fetch('https://jsonplaceholder.typicode.com/albums');
        const albumsData = await albumsResponse.json();
        
        setUsers(usersData);
        setAlbums(albumsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Count albums per user
  const getUserAlbumCount = (userId) => {
    return albums.filter(album => album.userId === userId).length;
  };

  // Add album count to each user
  const usersWithAlbumCount = users.map(user => ({
    ...user,
    albumCount: getUserAlbumCount(user.id)
  }));

  return (
    <div className="py-8">
      <Container>
        <HomeHeader 
          userName={isLoaded ? user?.fullName || user?.username : 'User'}
        />
        
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-photo-secondary mb-4">All Users</h2>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-photo-indigo"></div>
            </div>
          ) : (
            <UsersList users={usersWithAlbumCount} />
          )}
        </div>
      </Container>
    </div>
  );
}