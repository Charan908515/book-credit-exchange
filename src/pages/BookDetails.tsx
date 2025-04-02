
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { NavBar } from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { BookType } from "@/types/book";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { bookApi, requestApi } from "@/services/api";

const BookDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<BookType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRequesting, setIsRequesting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookDetails = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const bookData = await bookApi.getBook(id);
        
        if (!bookData) {
          toast.error("Book not found");
          navigate("/");
          return;
        }
        
        setBook(bookData);
      } catch (error) {
        console.error("Error fetching book details:", error);
        toast.error("Failed to fetch book details");
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookDetails();
  }, [id, navigate]);

  const handleRequestBook = async () => {
    if (!user) {
      toast.error("Please sign in to request books");
      navigate("/login");
      return;
    }

    if (!book) return;

    // Check if user is requesting their own book
    if (book.ownerId === user._id) {
      toast.error("You cannot request your own book");
      return;
    }

    try {
      setIsRequesting(true);
      await requestApi.createRequest(book.id, user._id);
      toast.success("Book requested successfully");
      navigate("/requests");
    } catch (error: any) {
      console.error("Error requesting book:", error);
      const errorMessage = error.response?.data?.message || "Failed to request book";
      toast.error(errorMessage);
    } finally {
      setIsRequesting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-1 container py-8 flex justify-center items-center">
          <p className="text-muted-foreground">Loading book details...</p>
        </main>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-1 container py-8 flex justify-center items-center">
          <p className="text-muted-foreground">Book not found</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-1 container py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Book Cover */}
          <div className="col-span-1">
            <div className="aspect-[2/3] overflow-hidden rounded-lg">
              <img 
                src={book.coverUrl || "https://via.placeholder.com/300x450?text=No+Cover"} 
                alt={book.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          {/* Book Details */}
          <div className="col-span-1 md:col-span-2">
            <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
            <p className="text-xl text-muted-foreground mb-4">by {book.author}</p>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {book.genres.map((genre) => (
                <span 
                  key={genre} 
                  className="bg-muted px-3 py-1 rounded-full text-sm"
                >
                  {genre}
                </span>
              ))}
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <span className="text-muted-foreground block">Condition</span>
                <span className="font-medium">{book.condition}</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Credit Value</span>
                <span className="font-medium">{book.creditValue}</span>
              </div>
              {book.readCount !== undefined && (
                <div>
                  <span className="text-muted-foreground block">Read Count</span>
                  <span className="font-medium">{book.readCount}</span>
                </div>
              )}
              {book.publishedDate && (
                <div>
                  <span className="text-muted-foreground block">Published</span>
                  <span className="font-medium">{book.publishedDate}</span>
                </div>
              )}
            </div>
            
            {book.description && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-2">Description</h2>
                <p className="text-muted-foreground">{book.description}</p>
              </div>
            )}
            
            {/* Request Button */}
            {user && user._id !== book.ownerId && (
              <Button 
                className="w-full md:w-auto" 
                disabled={isRequesting || !book.isAvailable}
                onClick={handleRequestBook}
              >
                {isRequesting ? "Requesting..." : "Request Book"}
              </Button>
            )}
            
            {!book.isAvailable && (
              <p className="text-destructive mt-2">This book is currently unavailable</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookDetails;
