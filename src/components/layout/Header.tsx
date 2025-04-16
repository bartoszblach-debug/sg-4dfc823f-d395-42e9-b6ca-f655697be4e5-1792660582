import { useAuth } from "@/contexts/AuthContext";
import { signOutUser } from "@/services/authService";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, LogIn, LogOut, User } from "lucide-react";

export function Header() {
  const { user, loading } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOutUser();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold text-blue-600">LinkShort</span>
        </Link>

        <nav className="flex items-center space-x-4">
          <Link href="/" className="flex items-center text-gray-600 hover:text-blue-600">
            <Home className="h-5 w-5 mr-1" />
            <span>Home</span>
          </Link>

          {!loading && (
            <>
              {user ? (
                <>
                  <Link href="/dashboard" className="flex items-center text-gray-600 hover:text-blue-600">
                    <User className="h-5 w-5 mr-1" />
                    <span>Dashboard</span>
                  </Link>
                  <Button variant="ghost" onClick={handleSignOut} className="flex items-center text-gray-600 hover:text-blue-600">
                    <LogOut className="h-5 w-5 mr-1" />
                    <span>Sign Out</span>
                  </Button>
                </>
              ) : (
                <Link href="/auth/login" className="flex items-center text-gray-600 hover:text-blue-600">
                  <LogIn className="h-5 w-5 mr-1" />
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