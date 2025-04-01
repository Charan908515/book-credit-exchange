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

const initialBooks: BookType[] = [
  {
    id: "1",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    genres: ["Fiction", "Classic", "Coming-of-age"],
    condition: "Good",
    creditValue: 2,
    coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=687&auto=format&fit=crop",
    addedAt: new Date(2023, 9, 15), // Oct 15, 2023
    readCount: 42
  },
  {
    id: "2",
    title: "1984",
    author: "George Orwell",
    genres: ["Fiction", "Dystopian", "Classics"],
    condition: "Very Good",
    creditValue: 3,
    coverUrl: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=687&auto=format&fit=crop",
    addedAt: new Date(2023, 10, 5), // Nov 5, 2023
    readCount: 29
  },
  {
    id: "3",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    genres: ["Romance", "Classic", "Fiction"],
    condition: "Like New",
    creditValue: 4,
    coverUrl: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=692&auto=format&fit=crop",
    addedAt: new Date(2023, 11, 12), // Dec 12, 2023
    readCount: 15
  },
  {
    id: "4",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    genres: ["Fiction", "Classic"],
    condition: "Good",
    creditValue: 2,
    coverUrl: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=687&auto=format&fit=crop",
    addedAt: new Date(2024, 0, 8), // Jan 8, 2024
    readCount: 21
  },
  {
    id: "5",
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    genres: ["Fantasy", "Adventure"],
    condition: "Fair",
    creditValue: 2,
    coverUrl: "https://images.unsplash.com/photo-1629992101753-56d196c8aabb?q=80&w=690&auto=format&fit=crop",
    addedAt: new Date(2024, 1, 20), // Feb 20, 2024
    readCount: 33
  },
  {
    id: "6",
    title: "Harry Potter and the Sorcerer's Stone",
    author: "J.K. Rowling",
    genres: ["Fantasy", "Young Adult"],
    condition: "Good",
    creditValue: 3,
    coverUrl: "https://images.unsplash.com/photo-1626618012641-bfbca5a31239?q=80&w=764&auto=format&fit=crop",
    addedAt: new Date(2024, 2, 5), // Mar 5, 2024
    readCount: 56
  }
];

const initialTransactions: TransactionType[] = [
  {
    id: "t1",
    type: "credit",
    amount: 3,
    description: "Added 'The Lord of the Rings'",
    date: new Date(2023, 5, 15),
    userId: "user1",
  },
  {
    id: "t2",
    type: "debit",
    amount: 2,
    description: "Received 'Dune'",
    date: new Date(2023, 6, 20),
    userId: "user1",
  },
  {
    id: "t3",
    type: "credit",
    amount: 4,
    description: "Added 'The Alchemist'",
    date: new Date(2023, 7, 5),
    userId: "user1",
  },
];

const Index = () => {
  const [books, setBooks] = useState<BookType[]>(initialBooks);
  const [filteredBooks, setFilteredBooks] = useState<BookType[]>(initialBooks);
  const [creditBalance, setCreditBalance] = useState(10);
  const [transactions, setTransactions] = useState<TransactionType[]>(initialTransactions);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setIsLoading(true);
        const fetchedBooks = await bookApi.getAllBooks();
        const filteredBooks = user 
          ? fetchedBooks.filter((book: any) => book.ownerId !== user._id)
          : fetchedBooks;
          
        if (filteredBooks && filteredBooks.length > 0) {
          setBooks(filteredBooks);
          setFilteredBooks(filteredBooks);
        } else {
          console.log("Using initial books data as fallback");
        }
      } catch (error) {
        console.error("Error fetching books:", error);
        toast.error("Failed to fetch books. Using sample data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
    
    if (user) {
      // This would be implemented with a real API call to get user balance
      // For now we use the mock value
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
        addedAt: new Date()
      };
      
      setBooks((prev) => [...prev, newBook]);
      setFilteredBooks((prev) => [...prev, newBook]);
      
      const newTransaction: TransactionType = {
        id: crypto.randomUUID(),
        type: "credit",
        amount: book.creditValue,
        description: `Added '${book.title}'`,
        date: new Date(),
        bookId: book.id,
        userId: user._id,
      };
      
      setTransactions((prev) => [newTransaction, ...prev]);
      setCreditBalance((prev) => prev + book.creditValue);
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
            
            {filteredBooks.length > 0 ? (
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
