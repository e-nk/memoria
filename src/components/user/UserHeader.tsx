import React from 'react';
import Link from 'next/link';
import { User, Mail, Globe, Phone, Briefcase, ArrowLeft, Image } from 'lucide-react';

interface UserProps {
  id: number;
  name: string;
  username: string;
  email: string;
  phone?: string;
  website?: string;
  company?: {
    name: string;
    catchPhrase?: string;
    bs?: string;
  };
}

interface UserHeaderProps {
  user: UserProps;
  albumCount: number;
}

const UserHeader = ({ user, albumCount }: UserHeaderProps) => {
  return (
    <div>
      <Link 
        href="/home" 
        className="inline-flex items-center gap-2 text-photo-secondary/70 hover:text-photo-secondary transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Users</span>
      </Link>

      <div className="bg-photo-secondary/5 backdrop-blur-sm border border-photo-secondary/10 rounded-xl p-6">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="bg-gradient-to-br from-photo-indigo to-photo-violet rounded-xl p-6 text-photo-secondary">
            <User className="h-12 w-12" />
          </div>
          
          <div className="flex-1 space-y-4">
            <div>
              <h1 className="text-2xl font-bold text-photo-secondary">{user.name}</h1>
              <p className="text-photo-secondary/70">@{user.username}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-photo-secondary/80">
                <Mail className="h-4 w-4" />
                <span>{user.email}</span>
              </div>
              
              {user.phone && (
                <div className="flex items-center gap-2 text-photo-secondary/80">
                  <Phone className="h-4 w-4" />
                  <span>{user.phone}</span>
                </div>
              )}
              
              {user.website && (
                <div className="flex items-center gap-2 text-photo-secondary/80">
                  <Globe className="h-4 w-4" />
                  <span>{user.website}</span>
                </div>
              )}
              
              {user.company && (
                <div className="flex items-center gap-2 text-photo-secondary/80">
                  <Briefcase className="h-4 w-4" />
                  <span>{user.company.name}</span>
                </div>
              )}
            </div>
            
            <div className="pt-2 mt-2 border-t border-photo-secondary/10">
              <div className="flex items-center gap-2 text-photo-secondary">
                <Image className="h-5 w-5" />
                <span className="font-semibold">{albumCount} Album{albumCount !== 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHeader;
