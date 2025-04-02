
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { NavBar } from "@/components/NavBar";
import { BookType } from "@/types/book";
import { BookCard } from "@/components/BookCard";
import { BookListItem } from "@/components/BookListItem";
import { Button } from "@/components/ui/button";
import { ViewToggle } from "@/components/ViewToggle";
import { AddBookForm } from "@/components/AddBookForm";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { bookApi } from "@/services/api";

const MyBooks = () => {
  const [myBooks, setMyBooks] = useState<BookType[]>([]);
  const [isAddingBook, setIsAddingBook] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!user) {
      toast.error("Please sign in to access your books");
      navigate("/login");
      return;
    }

    // Fetch user's books
    const fetchUserBooks = async () => {
      try {
        setIsLoading(true);
        const userBooks = await bookApi.getUserBooks(user._id);
        
        if (userBooks && userBooks.length > 0) {
          console.log("User's books:", userBooks);
          setMyBooks(userBooks);
        } else {
          console.log("No user books found");
          setMyBooks([]);
        }
      } catch (error) {
        console.error("Error fetching user books:", error);
        toast.error("Failed to fetch your books. Please try again later.");
        setMyBooks([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserBooks();
  }, [user, navigate]);

  // If not authenticated, don't render the content
  if (!user) {
    return null;
  }

  const handleAddBook = async (book: BookType) => {
    try {
      const newBook = { 
        ...book,
        addedAt: new Date(),
        ownerId: user._id, // Ensure ownerId is set
        isAvailable: true  // Make sure book is available by default
      };
      
      const addedBook = await bookApi.addBook(newBook);
      setMyBooks((prev) => [...prev, addedBook]);
      setIsAddingBook(false);
      
      toast.success("Book added successfully");
    } catch (error) {
      console.error("Error adding book:", error);
      toast.error("Failed to add book. Please try again.");
    }
  };

  const handleRemoveBook = async (bookId: string) => {
    try {
      await bookApi.deleteBook(bookId);
      
      setMyBooks((prev) => prev.filter((book) => book.id !== bookId));
      toast.success("Book removed successfully");
    } catch (error) {
      console.error("Error removing book:", error);
      toast.error("Failed to remove book. Please try again.");
    }
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
          <AddBookForm onAddBook={handleAddBook} />
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-muted-foreground">Loading your books...</p>
          </div>
        ) : myBooks.length > 0 ? (
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
