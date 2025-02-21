'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminSwitch() {
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const adminMode = localStorage.getItem('adminMode') === 'true';
    setIsAdmin(adminMode);
  }, []);

  const toggleAdmin = () => {
    const newMode = !isAdmin;
    setIsAdmin(newMode);
    localStorage.setItem('adminMode', newMode);
    router.push(newMode ? '/admin' : '/');
  };

  return (
    <div className="flex items-center space-x-2">
      <span className={`text-sm ${!isAdmin ? 'font-bold' : ''}`}>User</span>
      <button
        onClick={toggleAdmin}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          isAdmin ? 'bg-blue-600' : 'bg-gray-200'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            isAdmin ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
      <span className={`text-sm ${isAdmin ? 'font-bold' : ''}`}>Admin</span>
    </div>
  );
} 