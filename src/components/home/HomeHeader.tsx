import React from 'react';

interface HomeHeaderProps {
  userName: string;
}

const HomeHeader = ({ userName }: HomeHeaderProps) => {
  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-bold text-photo-secondary">
        Welcome back, <span className="bg-clip-text text-transparent bg-gradient-to-r from-photo-blue to-photo-pink">{userName}</span>
      </h1>
      <p className="text-photo-secondary/70">
        Explore users and their photo albums
      </p>
    </div>
  );
};

export default HomeHeader;