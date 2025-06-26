import { useAuth } from "@/contexts/AuthContext";
import { signOutUser } from "@/services/authService";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Home, LogIn, LogOut, LayoutDashboard, Menu, X } from "lucide-react";
import { useState } from 'react';

export function Header() {
  const { user, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOutUser();
      setMobileMenuOpen(false); // Close menu after sign out
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className='bg-white border-b border-gray-200 py-4'>
      <div className='container mx-auto px-4 flex justify-between items-center'>
        <Link href='/' className='flex items-center space-x-2'>
          <Image 
            src='/betclic-1liga-logotyp-pion-rgb-mcd4q2gm.png' 
            alt='Betclic 1 Liga Logo' 
            width={200} 
            height={80} 
            className='h-16 w-auto' 
          />
        </Link>

        {/* Mobile menu button */}
        <button 
          className='md:hidden flex items-center text-gray-700 focus:outline-none' 
          onClick={toggleMobileMenu}
          aria-label='Toggle menu'
        >
          {mobileMenuOpen ? (
            <X className='h-6 w-6' />
          ) : (
            <Menu className='h-6 w-6' />
          )}
        </button>

        {/* Desktop navigation */}
        <nav className='hidden md:flex items-center space-x-4'>
          <Link href='/' className='flex items-center text-gray-600 hover:text-blue-600'>
            <Home className='h-5 w-5 mr-1' />
            <span>Home</span>
          </Link>

          {!loading && (
            <>
              {user ? (
                <>
                  <Link href='/dashboard' className='flex items-center text-gray-600 hover:text-blue-600'>
                    <LayoutDashboard className='h-5 w-5 mr-1' />
                    <span>Dashboard</span>
                  </Link>
                  <Button variant='ghost' onClick={handleSignOut} className='flex items-center text-gray-600 hover:text-blue-600'>
                    <LogOut className='h-5 w-5 mr-1' />
                    <span>Sign Out</span>
                  </Button>
                </>
              ) : (
                <Link href='/auth/login' className='flex items-center text-gray-600 hover:text-blue-600'>
                  <LogIn className='h-5 w-5 mr-1' />
                  <span>Sign In</span>
                </Link>
              )}
            </>
          )}
        </nav>
      </div>

      {/* Mobile navigation */}
      <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'} transition-all duration-300 ease-in-out`}>
        <nav className='flex flex-col space-y-4 mt-4 px-4 pb-4 border-t border-gray-200 pt-4'>
          <Link 
            href='/' 
            className='flex items-center text-gray-600 hover:text-blue-600 py-2'
            onClick={() => setMobileMenuOpen(false)}
          >
            <Home className='h-5 w-5 mr-2' />
            <span>Home</span>
          </Link>

          {!loading && (
            <>
              {user ? (
                <>
                  <Link 
                    href='/dashboard' 
                    className='flex items-center text-gray-600 hover:text-blue-600 py-2'
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <LayoutDashboard className='h-5 w-5 mr-2' />
                    <span>Dashboard</span>
                  </Link>
                  <Button 
                    variant='ghost' 
                    onClick={handleSignOut} 
                    className='flex items-center text-gray-600 hover:text-blue-600 justify-start p-0 py-2'
                  >
                    <LogOut className='h-5 w-5 mr-2' />
                    <span>Sign Out</span>
                  </Button>
                </>
              ) : (
                <Link 
                  href='/auth/login' 
                  className='flex items-center text-gray-600 hover:text-blue-600 py-2'
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <LogIn className='h-5 w-5 mr-2' />
                  <span>Sign In</span>
                </Link>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
