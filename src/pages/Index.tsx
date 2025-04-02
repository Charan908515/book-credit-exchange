
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BookCard } from "@/components/BookCard";
import { BookListItem } from "@/components/BookListItem";
import { CreditBalance } from "@/components/CreditBalance";
import { AddBookForm } from "@/components/AddBookForm";
import { BookFilter } from "@/components/BookFilter";
import { NavBar } from "@/components/NavBar";
import { NewBooksSlider } from "@/components/NewBooksSlider";
import { ViewToggle } from "@/components/ViewToggle";
import { BookType } from "@/types/book";
import { TransactionType } from "@/types/transaction";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { bookApi, transactionApi } from "@/services/api";

const Index = () => {
  const [books, setBooks] = useState<BookType[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<BookType[]>([]);
  const [creditBalance, setCreditBalance] = useState(0);
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setIsLoading(true);
        const fetchedBooks = await bookApi.getAllBooks();
        
        if (fetchedBooks && fetchedBooks.length > 0) {
          // Only filter out books owned by the current user
          const availableBooks = user 
            ? fetchedBooks.filter((book: BookType) => book.ownerId !== user._id)
            : fetchedBooks;
          
          console.log("Available books for browsing:", availableBooks);
          setBooks(availableBooks);
          setFilteredBooks(availableBooks);
        } else {
          console.log("No available books found");
          setBooks([]);
          setFilteredBooks([]);
        }
      } catch (error) {
        console.error("Error fetching books:", error);
        toast.error("Failed to fetch books. Please try again later.");
        setBooks([]);
        setFilteredBooks([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
    
    if (user) {
      // Update user's credit balance
      setCreditBalance(user.credits || 0);
    }
  }, [user]);

  const handleAddBook = async (book: BookType) => {
    if (!user) {
      toast.error("Please sign in to add books");
      navigate("/login");
      return;
    }

    try {
      const newBook = { 
        ...book,
        addedAt: new Date(),
        ownerId: user._id, // Ensure ownerId is set
        isAvailable: true  // Make sure book is available by default
      };
      
      const addedBook = await bookApi.addBook(newBook);
      
      // Add a success toast
      toast.success(`Successfully added "${addedBook.title}"`);
      
      const newTransaction: TransactionType = {
        id: crypto.randomUUID(),
        type: "credit",
        amount: book.creditValue,
        description: `Added '${book.title}'`,
        date: new Date(),
        bookId: addedBook.id,
        userId: user._id,
      };
      
      setTransactions((prev) => [newTransaction, ...prev]);
      setCreditBalance((prev) => prev + book.creditValue);
      
      // Refresh the book list to include books from all users except current user
      const updatedBooks = await bookApi.getAllBooks();
      const availableBooks = updatedBooks.filter((b: BookType) => b.ownerId !== user._id);
      setBooks(availableBooks);
      setFilteredBooks(availableBooks);
      
    } catch (error) {
      console.error("Error adding book:", error);
      toast.error("Failed to add book.");
    }
  };

  const handleRequestBook = async (bookId: string) => {
    if (!user) {
      toast.error("Please sign in to request books");
      navigate("/login");
      return;
    }
    
    const book = books.find((b) => b.id === bookId);
    
    if (!book) return;
    
    if (creditBalance < book.creditValue) {
      toast.error("Not enough credits to request this book");
      return;
    }

    try {
      await transactionApi.exchangeBook(user._id, bookId);
      
      setCreditBalance((prev) => prev - book.creditValue);
      
      const newTransaction: TransactionType = {
        id: crypto.randomUUID(),
        type: "debit",
        amount: book.creditValue,
        description: `Requested '${book.title}'`,
        date: new Date(),
        bookId: book.id,
        userId: user._id,
      };
      
      setTransactions((prev) => [newTransaction, ...prev]);
      
      setBooks((prev) => prev.filter((b) => b.id !== bookId));
      setFilteredBooks((prev) => prev.filter((b) => b.id !== bookId));
      
      toast.success(`Successfully requested "${book.title}"`);
    } catch (error) {
      console.error("Error requesting book:", error);
      toast.error("Failed to request book. Please try again.");
    }
  };

  const handleFilterChange = (filters: any) => {
    let filtered = [...books];
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(searchTerm) ||
          book.author.toLowerCase().includes(searchTerm)
      );
    }
    
    if (filters.genre && filters.genre !== "all") {
      filtered = filtered.filter((book) =>
        book.genres.some((genre) => 
          genre.toLowerCase() === filters.genre.toLowerCase()
        )
      );
    }
    
    if (filters.condition && filters.condition !== "all") {
      filtered = filtered.filter(
        (book) => book.condition === filters.condition
      );
    }
    
    if (filters.maxCredits) {
      filtered = filtered.filter(
        (book) => book.creditValue <= filters.maxCredits
      );
    }
    
    setFilteredBooks(filtered);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-1 container py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Book Exchange Platform</h1>
            <p className="text-muted-foreground">
              Browse books, exchange with others, and manage your credit balance
            </p>
          </div>
          {user ? (
            <AddBookForm onAddBook={handleAddBook} />
          ) : (
            <Button onClick={() => navigate("/login")} className="bg-book-burgundy hover:bg-book-burgundy/90">
              Sign in to add books
            </Button>
          )}
        </div>
        
        <NewBooksSlider books={books} onRequestBook={handleRequestBook} />
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-8">
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-4">
              <BookFilter onFilterChange={handleFilterChange} />
              <ViewToggle view={viewMode} onChange={setViewMode} />
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <p>Loading books...</p>
              </div>
            ) : filteredBooks.length > 0 ? (
              viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredBooks.map((book) => (
                    <BookCard
                      key={book.id}
                      book={book}
                      onRequest={handleRequestBook}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {filteredBooks.map((book) => (
                    <BookListItem
                      key={book.id}
                      book={book}
                      onRequest={handleRequestBook}
                    />
                  ))}
                </div>
              )
            ) : (
              <div className="flex flex-col items-center justify-center h-64 border rounded-lg bg-card">
                <p className="text-muted-foreground mb-4">No books match your filters</p>
                <button 
                  className="text-primary hover:underline" 
                  onClick={() => handleFilterChange({
                    search: "",
                    genre: "all",
                    condition: "all",
                    maxCredits: 5,
                  })}
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
          
          <div>
            <CreditBalance
              balance={creditBalance}
              recentTransactions={transactions.slice(0, 5)}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
