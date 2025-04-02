
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { NavBar } from "@/components/NavBar";
import { BookType } from "@/types/book";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BookOpen, Calendar, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { bookApi } from "@/services/api";

const BookDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<BookType | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const fetchBook = async () => {
        try {
          setLoading(true);
          const fetchedBook = await bookApi.getBook(id);
          
          if (fetchedBook) {
            setBook(fetchedBook);
          } else {
            toast.error("Book not found");
            navigate("/");
          }
        } catch (error) {
          console.error("Error fetching book details:", error);
          toast.error("Failed to load book details");
          navigate("/");
        } finally {
          setLoading(false);
        }
      };
      
      fetchBook();
    }
  }, [id, navigate]);

  const handleRequestBook = async () => {
    if (!user) {
      toast.error("Please sign in to request books");
      navigate("/login");
      return;
    }
    
    if (!book) return;
    
    if (user.credits < book.creditValue) {
      toast.error("Not enough credits to request this book");
      return;
    }
    
    try {
      await bookApi.updateBook(book.id, { isAvailable: false });
      toast.success(`Successfully requested "${book.title}"`);
      navigate("/requests");
    } catch (error) {
      console.error("Error requesting book:", error);
      toast.error("Failed to request book. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-1 container py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          </div>
        </main>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-1 container py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Book not found</h1>
            <Button 
              variant="link" 
              onClick={() => navigate("/")}
              className="mt-4"
            >
              Return to homepage
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-1 container py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="aspect-[2/3] w-full max-w-[300px] mx-auto md:mx-0 mb-6 md:mb-0">
              {book.coverUrl ? (
                <img
                  src={book.coverUrl}
                  alt={`Cover of ${book.title}`}
                  className="w-full h-full object-cover rounded-lg shadow-md"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted rounded-lg">
                  <BookOpen size={48} className="text-muted-foreground" />
                </div>
              )}
            </div>
          </div>
          
          <div className="md:col-span-2">
            <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
            <div className="flex items-center text-muted-foreground mb-4">
              <User className="h-4 w-4 mr-1" /> 
              <span>{book.author}</span>
              
              {book.publishedDate && (
                <>
                  <span className="mx-2">•</span>
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{book.publishedDate}</span>
                </>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {book.genres.map((genre) => (
                <Badge key={genre} variant="secondary">
                  {genre}
                </Badge>
              ))}
            </div>
            
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Condition</p>
                    <p className="font-medium">{book.condition}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Credit Value</p>
                    <p className="font-medium">{book.creditValue} credits</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Read Count</p>
                    <p className="font-medium">{book.readCount || 0}</p>
                  </div>
                  {book.addedAt && (
                    <div>
                      <p className="text-sm text-muted-foreground">Added</p>
                      <p className="font-medium">{formatDistanceToNow(new Date(book.addedAt), { addSuffix: true })}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {book.description && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-3">Description</h2>
                <p className="text-muted-foreground leading-relaxed">{book.description}</p>
              </div>
            )}
            
            {book.isAvailable !== false && user && book.ownerId !== user._id && (
              <Button 
                onClick={handleRequestBook}
                className="w-full md:w-auto"
              >
                Request This Book
              </Button>
            )}
            
            {!book.isAvailable && (
              <div className="mt-4 p-3 bg-muted rounded-md">
                <p className="font-medium">Status: <span className="text-amber-600">Not Available</span></p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookDetails;
