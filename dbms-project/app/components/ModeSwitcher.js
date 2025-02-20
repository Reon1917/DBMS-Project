'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ModeSwitcher() {
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedMode = localStorage.getItem('isAdmin');
    setIsAdmin(storedMode === 'true');
  }, []);

  const toggleMode = () => {
    const newMode = !isAdmin;
    setIsAdmin(newMode);
    localStorage.setItem('isAdmin', newMode.toString());
    
    // Redirect to appropriate homepage
    router.push(newMode ? '/admin' : '/');
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={toggleMode}
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
          isAdmin 
            ? 'bg-red-500 hover:bg-red-600 text-white' 
            : 'bg-blue-500 hover:bg-blue-600 text-white'
        }`}
      >
        {isAdmin ? 'Switch to User Mode' : 'Switch to Admin Mode'}
      </button>
    </div>
  );
} 