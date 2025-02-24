'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ModeSwitcher from './ModeSwitcher';
import AdminSwitch from './AdminSwitch';

export default function Layout({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const storedMode = localStorage.getItem('isAdmin');
    setIsAdmin(storedMode === 'true');
  }, []);

  const userLinks = [
    { href: '/', label: 'Home' },
    { href: '/services', label: 'Services' },
    { href: '/appointment', label: 'Book Appointment' },
  ];

  const adminLinks = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/services', label: 'Services' },
    { href: '/admin/appointments', label: 'Appointments' },
    { href: '/admin/employees', label: 'Employees' },
  ];

  const links = isAdmin ? adminLinks : userLinks;

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="text-xl font-bold text-gray-800">
                  Cosplay Service
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link href="/services" className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300">
                  Services
                </Link>
                <Link href="/appointment" className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300">
                  Reserve Appointment
                </Link>
                {isAdmin && (
                  <>
                    <Link href="/admin/appointments" className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300">
                      Manage Appointments
                    </Link>
                    <Link href="/admin/services" className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300">
                      Manage Services
                    </Link>
                    <Link href="/admin/employees" className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300">
                      Manage Employees
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {isAdmin && (
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    const custId = e.target.custId.value;
                    if (custId) {
                      window.location.href = `/customer-appointments/${custId}`;
                    }
                  }}
                  className="flex items-center"
                >
                  <input
                    type="number"
                    name="custId"
                    placeholder="Customer ID"
                    className="w-24 px-2 py-1 text-sm border rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="px-2 py-1 text-sm bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    Search
                  </button>
                </form>
              )}
              <div className="flex items-center space-x-2 border-l pl-4">
                <span className="text-sm text-gray-600">Mode:</span>
                <button
                  onClick={() => {
                    setIsAdmin(!isAdmin);
                    localStorage.setItem('isAdmin', !isAdmin);
                  }}
                  className={`px-2 py-1 text-sm rounded-md transition-colors ${
                    isAdmin 
                      ? 'bg-purple-100 text-purple-700 hover:bg-purple-200' 
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {isAdmin ? 'Admin' : 'User'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl w-full mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>

      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} Cosplay Makeup Service. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
} 