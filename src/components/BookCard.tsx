
import { Book as BookIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookType } from "@/types/book";

interface BookCardProps {
  book: BookType;
  onRequest: (id: string) => void;
  actionLabel?: string;
}

export function BookCard({ book, onRequest, actionLabel = "Request Book" }: BookCardProps) {
  return (
    <div className="book-card flex flex-col h-full">
      <div className="book-cover mb-3">
        {book.coverUrl ? (
          <img
            src={book.coverUrl}
            alt={`Cover of ${book.title}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-book-beige text-book-brown/60">
            <BookIcon size={48} />
          </div>
        )}
      </div>
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
          onClick={() => onRequest(book.id)}
        >
          {actionLabel}
        </Button>
      </div>
    </div>
  );
}
