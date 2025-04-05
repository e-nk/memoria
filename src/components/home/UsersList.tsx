import React from 'react';
import Link from 'next/link';
import { User, UserPlus, Image } from 'lucide-react';

interface UserProps {
  id: number;
  name: string;
  username: string;
  email: string;
  albumCount: number;
}

interface UsersListProps {
  users: UserProps[];
}

const UsersList = ({ users }: UsersListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {users.map((user) => (
        <Link 
          href={`/home/user/${user.id}`} 
          key={user.id} 
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
                <span className="text-sm">{user.albumCount} Album{user.albumCount !== 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default UsersList;