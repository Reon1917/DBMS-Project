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
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="text-xl font-bold text-gray-800">
                  Makeup Service
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      pathname === link.href
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-4">
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
                  placeholder="Enter Customer ID"
                  className="px-3 py-1 border rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="px-3 py-1 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  Search
                </button>
              </form>
              <ModeSwitcher />
              <AdminSwitch />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>

      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} Makeup Service. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
} 