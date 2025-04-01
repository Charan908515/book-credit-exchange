
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

// For demo purposes - in a real app, this would be fetched from API
const getBookById = (id: string): BookType | undefined => {
  const allBooks = [
    ...initialBooks,
    ...initialMyBooks,
    ...initialRequestedBooks,
    ...initialIncomingRequests
  ];
  
  return allBooks.find(book => book.id === id);
};

// Sample data for books (imported from other components for demo)
const initialBooks: BookType[] = [
  {
    id: "1",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    genres: ["Fiction", "Classic", "Coming-of-age"],
    condition: "Good",
    creditValue: 2,
    coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=687&auto=format&fit=crop",
    addedAt: new Date(2023, 9, 15),
    readCount: 42,
    publishedDate: "July 11, 1960",
    description: "To Kill a Mockingbird is a novel by Harper Lee published in 1960. It was immediately successful, winning the Pulitzer Prize, and has become a classic of modern American literature. The plot and characters are loosely based on Lee's observations of her family, her neighbors and an event that occurred near her hometown of Monroeville, Alabama, in 1936, when she was ten."
  },
  {
    id: "2",
    title: "1984",
    author: "George Orwell",
    genres: ["Fiction", "Dystopian", "Classics"],
    condition: "Very Good",
    creditValue: 3,
    coverUrl: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=687&auto=format&fit=crop",
    addedAt: new Date(2023, 10, 5),
    readCount: 29,
    publishedDate: "June 8, 1949",
    description: "1984 is a dystopian novel by English novelist George Orwell. It was published on 8 June 1949 as Orwell's ninth and final book completed in his lifetime. The story was mostly written at Barnhill, a farmhouse on the Scottish island of Jura, at a time when Orwell was suffering from tuberculosis."
  }
];

const initialMyBooks: BookType[] = [
  {
    id: "m1",
    title: "The Lord of the Rings",
    author: "J.R.R. Tolkien",
    genres: ["Fantasy", "Adventure"],
    condition: "Very Good",
    creditValue: 3,
    coverUrl: "https://images.unsplash.com/photo-1513001900722-370f803f498d?q=80&w=687&auto=format&fit=crop",
    addedAt: new Date(2023, 8, 10),
    publishedDate: "July 29, 1954",
    description: "The Lord of the Rings is an epic high-fantasy novel by English author and scholar J. R. R. Tolkien. Set in Middle-earth, intended to be Earth at some distant time in the past, the story began as a sequel to Tolkien's 1937 children's book The Hobbit, but eventually developed into a much larger work."
  }
];

const initialRequestedBooks: BookType[] = [
  {
    id: "r1",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    genres: ["Fiction", "Classic"],
    condition: "Good",
    creditValue: 2,
    coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=687&auto=format&fit=crop",
    status: "Pending Approval",
    publishedDate: "July 11, 1960",
    description: "To Kill a Mockingbird is a novel by Harper Lee published in 1960. It was immediately successful, winning the Pulitzer Prize, and has become a classic of modern American literature."
  }
];

const initialIncomingRequests: BookType[] = [
  {
    id: "i1",
    title: "The Lord of the Rings",
    author: "J.R.R. Tolkien",
    genres: ["Fantasy", "Adventure"],
    condition: "Very Good",
    creditValue: 3,
    coverUrl: "https://images.unsplash.com/photo-1513001900722-370f803f498d?q=80&w=687&auto=format&fit=crop",
    requestedBy: "Jane Smith",
    requestedByEmail: "jane.smith@example.com",
    publishedDate: "July 29, 1954",
    description: "The Lord of the Rings is an epic high-fantasy novel by English author and scholar J. R. R. Tolkien. Set in Middle-earth, intended to be Earth at some distant time in the past."
  }
];

const BookDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<BookType | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      // In a real app, this would be an API call
      const fetchedBook = getBookById(id);
      setBook(fetchedBook);
      setLoading(false);
      
      if (!fetchedBook) {
        toast.error("Book not found");
        navigate("/");
      }
    }
  }, [id, navigate]);

  const handleRequestBook = () => {
    if (!user) {
      toast.error("Please sign in to request books");
      navigate("/login");
      return;
    }
    
    if (!book) return;
    
    toast.success(`Successfully requested "${book.title}"`);
    navigate("/requests");
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
                      <p className="font-medium">{formatDistanceToNow(book.addedAt, { addSuffix: true })}</p>
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
            
            {!book.status && !book.requestedBy && (
              <Button 
                onClick={handleRequestBook}
                className="w-full md:w-auto"
              >
                Request This Book
              </Button>
            )}
            
            {book.status && (
              <div className="mt-4 p-3 bg-muted rounded-md">
                <p className="font-medium">Status: <span className={book.status === "Approved" ? "text-green-600" : "text-amber-600"}>{book.status}</span></p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookDetails;
