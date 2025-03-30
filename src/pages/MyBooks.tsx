
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { NavBar } from "@/components/NavBar";
import { BookType } from "@/types/book";
import { BookCard } from "@/components/BookCard";
import { BookListItem } from "@/components/BookListItem";
import { Button } from "@/components/ui/button";
import { ViewToggle } from "@/components/ViewToggle";
import { Plus } from "lucide-react";
import { AddBookForm } from "@/components/AddBookForm";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

// Sample data for my books
const initialMyBooks: BookType[] = [
  {
    id: "m1",
    title: "The Lord of the Rings",
    author: "J.R.R. Tolkien",
    genres: ["Fantasy", "Adventure"],
    condition: "Very Good",
    creditValue: 3,
    coverUrl: "https://images.unsplash.com/photo-1513001900722-370f803f498d?q=80&w=687&auto=format&fit=crop",
    addedAt: new Date(2023, 8, 10), // Sep 10, 2023
  },
  {
    id: "m2",
    title: "Dune",
    author: "Frank Herbert",
    genres: ["Science Fiction"],
    condition: "Good",
    creditValue: 2,
    coverUrl: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?q=80&w=687&auto=format&fit=crop",
    addedAt: new Date(2023, 7, 22), // Aug 22, 2023
  },
  {
    id: "m3",
    title: "The Alchemist",
    author: "Paulo Coelho",
    genres: ["Fiction", "Philosophy"],
    condition: "Like New",
    creditValue: 4,
    coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=687&auto=format&fit=crop",
    addedAt: new Date(2024, 1, 15), // Feb 15, 2024
  },
];

const MyBooks = () => {
  const [myBooks, setMyBooks] = useState<BookType[]>(initialMyBooks);
  const [isAddingBook, setIsAddingBook] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!user) {
      toast.error("Please sign in to access your books");
      navigate("/login");
    }
  }, [user, navigate]);

  // If not authenticated, don't render the content
  if (!user) {
    return null;
  }

  const handleAddBook = (book: BookType) => {
    const newBook = { 
      ...book,
      addedAt: new Date() // Add current timestamp
    };
    setMyBooks((prev) => [...prev, newBook]);
    setIsAddingBook(false);
  };

  const handleRemoveBook = (bookId: string) => {
    setMyBooks((prev) => prev.filter((book) => book.id !== bookId));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-1 container py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Books</h1>
            <p className="text-muted-foreground">
              Manage the books you've added to the exchange platform
            </p>
          </div>
          <Button onClick={() => setIsAddingBook(true)} className="bg-book-burgundy hover:bg-book-burgundy/90">
            <Plus className="mr-2 h-4 w-4" /> Add Book
          </Button>
        </div>
        
        {isAddingBook ? (
          <div className="mb-8">
            <AddBookForm 
              onAddBook={handleAddBook}
            />
          </div>
        ) : null}
        
        {myBooks.length > 0 ? (
          <>
            <div className="flex justify-end mb-4">
              <ViewToggle view={viewMode} onChange={setViewMode} />
            </div>
            
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {myBooks.map((book) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    onRequest={handleRemoveBook}
                    actionLabel="Remove"
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {myBooks.map((book) => (
                  <BookListItem
                    key={book.id}
                    book={book}
                    onRequest={handleRemoveBook}
                    actionLabel="Remove"
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 border rounded-lg bg-card">
            <p className="text-muted-foreground mb-4">You haven't added any books yet</p>
            <Button onClick={() => setIsAddingBook(true)} variant="outline">
              Add Your First Book
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default MyBooks;
