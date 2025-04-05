import React from 'react';
import Link from 'next/link';
import { User, Image } from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

interface UserProps {
  _id: string;
  name: string;
  username: string;
  email: string;
}

interface UserCardProps {
  user: UserProps;
}

const UserCard = ({ user }: UserCardProps) => {
  // Safely fetch the album count for this user
  const albumCount = useQuery(
    api.albums.getAlbumCountByUser,
    { userId: user._id as Id<"users"> }
  ) || 0;
  
  return (
    <Link 
      href={`/home/user/${user._id}`}
      className="bg-photo-secondary/5 backdrop-blur-sm border border-photo-secondary/10 rounded-xl p-4 hover:bg-photo-secondary/10 transition-colors"
    >
      <div className="flex items-start gap-3">
        <div className="bg-gradient-to-br from-photo-indigo to-photo-violet rounded-full p-3 text-photo-secondary">
          <User className="h-6 w-6" />
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-photo-secondary">{user.name}</h3>
          <p className="text-photo-secondary/70 text-sm">@{user.username}</p>
          <p className="text-photo-secondary/60 text-sm mt-1">{user.email}</p>
          
          <div className="mt-3 flex items-center gap-2 text-photo-secondary/70">
            <Image className="h-4 w-4" />
            <span className="text-sm">{albumCount} Album{albumCount !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default UserCard;