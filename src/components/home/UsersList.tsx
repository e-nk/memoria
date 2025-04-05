// components/home/UsersList.tsx
import React from 'react';
import UserCard from './UserCard';

interface UserProps {
  _id: string;
  name: string;
  username: string;
  email: string;
}

interface UsersListProps {
  users: UserProps[];
}

const UsersList = ({ users }: UsersListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {users.map((user) => (
        <UserCard key={user._id} user={user} />
      ))}
    </div>
  );
};

export default UsersList;