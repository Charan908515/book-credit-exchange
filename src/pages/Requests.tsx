
import { useState } from "react";
import { NavBar } from "@/components/NavBar";
import { BookType } from "@/types/book";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, X } from "lucide-react";

// Sample data for requested and pending books
const initialRequestedBooks: BookType[] = [
  {
    id: "r1",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    genres: ["Fiction", "Classic"],
    condition: "Good",
    creditValue: 2,
    coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=687&auto=format&fit=crop",
    status: "Pending Approval"
  },
  {
    id: "r2",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    genres: ["Romance", "Classic"],
    condition: "Very Good",
    creditValue: 3,
    coverUrl: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=692&auto=format&fit=crop",
    status: "Approved"
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
    requestedBy: "Jane Smith"
  }
];

const RequestCard = ({ book, actions }: { book: BookType, actions?: React.ReactNode }) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 border rounded-lg p-4 bg-card">
      <div className="w-full md:w-24 h-32 flex-shrink-0">
        <img 
          src={book.coverUrl} 
          alt={book.title}
          className="w-full h-full object-cover rounded-md"
        />
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-semibold">{book.title}</h3>
        <p className="text-muted-foreground">{book.author}</p>
        <div className="flex flex-wrap gap-1 mt-1">
          {book.genres.map((genre) => (
            <span 
              key={genre} 
              className="text-xs bg-muted px-2 py-1 rounded-full"
            >
              {genre}
            </span>
          ))}
        </div>
        <div className="mt-2 flex justify-between items-center">
          <div>
            <span className="text-sm">Condition: <span className="font-medium">{book.condition}</span></span>
            <span className="ml-4 text-sm">Credits: <span className="font-medium">{book.creditValue}</span></span>
          </div>
          {book.status && (
            <span className={`text-sm font-medium ${
              book.status === "Approved" ? "text-green-600" : "text-amber-600"
            }`}>
              {book.status}
            </span>
          )}
          {book.requestedBy && (
            <span className="text-sm">Requested by: <span className="font-medium">{book.requestedBy}</span></span>
          )}
        </div>
        {actions && (
          <div className="mt-3 flex justify-end gap-2">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

const Requests = () => {
  const [requestedBooks, setRequestedBooks] = useState<BookType[]>(initialRequestedBooks);
  const [incomingRequests, setIncomingRequests] = useState<BookType[]>(initialIncomingRequests);

  const handleCancelRequest = (bookId: string) => {
    setRequestedBooks((prev) => prev.filter((book) => book.id !== bookId));
  };

  const handleApproveRequest = (bookId: string) => {
    setIncomingRequests((prev) => prev.filter((book) => book.id !== bookId));
  };

  const handleRejectRequest = (bookId: string) => {
    setIncomingRequests((prev) => prev.filter((book) => book.id !== bookId));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-1 container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Book Requests</h1>
          <p className="text-muted-foreground">
            Manage your outgoing and incoming book requests
          </p>
        </div>
        
        <Tabs defaultValue="outgoing">
          <TabsList className="mb-6">
            <TabsTrigger value="outgoing">Outgoing Requests</TabsTrigger>
            <TabsTrigger value="incoming">Incoming Requests</TabsTrigger>
          </TabsList>
          
          <TabsContent value="outgoing">
            {requestedBooks.length > 0 ? (
              <div className="space-y-4">
                {requestedBooks.map((book) => (
                  <RequestCard 
                    key={book.id}
                    book={book}
                    actions={
                      book.status === "Pending Approval" ? (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleCancelRequest(book.id)}
                        >
                          Cancel Request
                        </Button>
                      ) : null
                    }
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 border rounded-lg bg-card">
                <p className="text-muted-foreground mb-4">You haven't requested any books yet</p>
                <Button variant="outline" asChild>
                  <a href="/">Browse Books</a>
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="incoming">
            {incomingRequests.length > 0 ? (
              <div className="space-y-4">
                {incomingRequests.map((book) => (
                  <RequestCard 
                    key={book.id}
                    book={book}
                    actions={
                      <>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleRejectRequest(book.id)}
                        >
                          <X className="mr-1 h-4 w-4" />
                          Reject
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-green-600 hover:text-green-600"
                          onClick={() => handleApproveRequest(book.id)}
                        >
                          <Check className="mr-1 h-4 w-4" />
                          Approve
                        </Button>
                      </>
                    }
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 border rounded-lg bg-card">
                <p className="text-muted-foreground mb-4">You don't have any incoming requests</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Requests;
