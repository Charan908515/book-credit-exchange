
import { BookType } from "@/types/book";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BookListItemProps {
  book: BookType;
  onRequest: (id: string) => void;
  actionLabel?: string;
}

export function BookListItem({ book, onRequest, actionLabel = "Request Book" }: BookListItemProps) {
  const navigate = useNavigate();

  const handleItemClick = () => {
    navigate(`/book/${book.id}`);
  };

  const handleRequestClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when clicking the button
    onRequest(book.id);
  };

  return (
    <div 
      className="flex items-center gap-4 p-4 border rounded-md bg-card hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleItemClick}
    >
      <div className="relative h-20 aspect-[2/3] flex-shrink-0">
        {/* Reader count badge */}
        <div className="absolute top-0 right-0 z-10 bg-book-burgundy text-white px-2 py-0.5 rounded-bl-lg flex items-center gap-1 shadow-md text-xs">
          <Users size={12} />
          <span>{book.readCount || 0}</span>
        </div>
        
        {book.coverUrl ? (
          <img
            src={book.coverUrl}
            alt={`Cover of ${book.title}`}
            className="h-full w-full object-cover rounded-sm"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-book-beige text-book-brown/60 rounded-sm">
            No cover
          </div>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="font-bold truncate">{book.title}</h3>
        <p className="text-sm text-muted-foreground">{book.author}</p>
        <div className="flex flex-wrap gap-1 my-1">
          {book.genres.slice(0, 2).map((genre) => (
            <Badge key={genre} variant="outline" className="text-xs">
              {genre}
            </Badge>
          ))}
          {book.genres.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{book.genres.length - 2} more
            </Badge>
          )}
        </div>
      </div>
      
      <div className="flex flex-col items-end gap-2">
        <div className="flex items-center justify-end gap-3">
          <span className="text-sm">{book.condition}</span>
          <span className="font-medium">{book.creditValue} Credits</span>
        </div>
        <Button 
          variant="default" 
          size="sm"
          onClick={handleRequestClick}
        >
          {actionLabel}
        </Button>
      </div>
    </div>
  );
}
