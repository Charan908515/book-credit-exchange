
import { Book, User, Bell, Shield, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface NavBarProps {
  isAdmin?: boolean;
}

export function NavBar({ isAdmin = false }: NavBarProps) {
  const { user, logout } = useAuth();
  
  return (
    <header className="border-b bg-card sticky top-0 z-10">
      <div className="container flex justify-between items-center h-16">
        <Link to="/" className="flex items-center gap-2">
          <Book className="h-6 w-6 text-book-burgundy" />
          <span className="font-serif text-xl font-bold">BookExchange</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
            Browse Books
          </Link>
          {user && (
            <>
              <Link to="/my-books" className="text-sm font-medium hover:text-primary transition-colors">
                My Books
              </Link>
              <Link to="/requests" className="text-sm font-medium hover:text-primary transition-colors">
                Requests
              </Link>
            </>
          )}
          {isAdmin && (
            <Link to="/admin" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1">
              <Shield className="h-4 w-4" /> Admin
            </Link>
          )}
        </nav>
        
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-book-burgundy rounded-full"></span>
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link to="/profile" className="w-full">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/my-books" className="w-full">My Books</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/requests" className="w-full">My Requests</Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem>
                      <Link to="/admin" className="w-full flex items-center gap-1">
                        <Shield className="h-4 w-4" /> Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>Log Out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link to="/register">
                  <LogIn className="h-4 w-4 mr-1" />
                  Register
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
