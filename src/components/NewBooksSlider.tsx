
import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { BookType } from "@/types/book";
import { BookCard } from "./BookCard";
import { useAuth } from "@/contexts/AuthContext";

interface NewBooksSliderProps {
  books: BookType[];
  onRequestBook: (id: string) => void;
}

export function NewBooksSlider({ books, onRequestBook }: NewBooksSliderProps) {
  const [api, setApi] = useState<any>(null);
  const { user } = useAuth();

  // Sort books by addedAt date (newest first)
  const sortedBooks = [...books].sort((a, b) => {
    const dateA = a.addedAt ? new Date(a.addedAt).getTime() : 0;
    const dateB = b.addedAt ? new Date(b.addedAt).getTime() : 0;
    return dateB - dateA;
  });

  // Take the 6 most recent books, excluding the current user's books
  const recentBooks = sortedBooks
    .filter(book => !user || book.ownerId !== user._id)
    .slice(0, 6);

  // Set up auto-sliding
  useEffect(() => {
    if (!api) return;

    // Start a timer that advances the carousel every 5 seconds
    const autoPlayInterval = setInterval(() => {
      api.scrollNext();
    }, 5000);

    // Clear the timer when component unmounts
    return () => clearInterval(autoPlayInterval);
  }, [api]);

  if (recentBooks.length === 0) {
    return null;
  }

  return (
    <div className="py-6">
      <h2 className="text-2xl font-serif font-bold mb-4">Newly Added Books</h2>
      <Carousel className="w-full" setApi={setApi} opts={{ loop: true }}>
        <CarouselContent>
          {recentBooks.map((book) => (
            <CarouselItem key={book.id} className="sm:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <BookCard book={book} onRequest={onRequestBook} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex justify-end gap-2 mt-4">
          <CarouselPrevious className="relative static left-0 right-0 translate-y-0" />
          <CarouselNext className="relative static left-0 right-0 translate-y-0" />
        </div>
      </Carousel>
    </div>
  );
}
