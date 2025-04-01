
import { Book as BookIcon, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookType } from "@/types/book";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface BookCardProps {
  book: BookType;
  onRequest: (id: string) => void;
  actionLabel?: string;
}

export function BookCard({ book, onRequest, actionLabel = "Request Book" }: BookCardProps) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/book/${book.id}`);
  };

  const handleRequestClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when clicking the button
    onRequest(book.id);
  };

  return (
    <Card 
      className="book-card flex flex-col h-full overflow-hidden shadow-lg cursor-pointer hover:shadow-xl transition-all" 
      onClick={handleCardClick}
    >
      {/* Reader count notch */}
      <div className="relative">
        <div className="absolute top-0 right-0 z-10 bg-book-burgundy text-white px-3 py-1 rounded-bl-lg flex items-center gap-1 shadow-md">
          <Users size={16} />
          <span className="text-sm font-medium">{book.readCount || 0}</span>
        </div>
        
        <div className="book-cover mb-3">
          {book.coverUrl ? (
            <img
              src={book.coverUrl}
              alt={`Cover of ${book.title}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-40 flex items-center justify-center bg-book-beige text-book-brown/60">
              <BookIcon size={48} />
            </div>
          )}
        </div>
      </div>
      
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-lg font-bold line-clamp-2 mb-1">{book.title}</h3>
        <p className="text-sm text-muted-foreground mb-2">{book.author}</p>
        <div className="flex flex-wrap gap-1 mb-3">
          {book.genres.map((genre) => (
            <Badge key={genre} variant="outline" className="text-xs">
              {genre}
            </Badge>
          ))}
        </div>
        <div className="mt-auto">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm">Credits: {book.creditValue}</span>
            <span className="text-sm">{book.condition}</span>
          </div>
          <Button 
            variant="default" 
            className="w-full"
            onClick={handleRequestClick}
          >
            {actionLabel}
          </Button>
        </div>
      </div>
    </Card>
  );
}
