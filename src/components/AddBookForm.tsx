
import { useState } from "react";
import { BookPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { toast } from "sonner";

const bookConditions = [
  "Like New", 
  "Very Good", 
  "Good", 
  "Fair", 
  "Poor"
];

export function AddBookForm({ onAddBook }: { onAddBook: (bookData: any) => void }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genres: "",
    condition: "Good",
    creditValue: 1,
    coverUrl: "",
    description: "",
    publishedDate: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!formData.title || !formData.author) {
      toast.error("Please fill in all required fields");
      return;
    }

    const bookData = {
      ...formData,
      genres: formData.genres.split(",").map(genre => genre.trim()).filter(Boolean),
      id: crypto.randomUUID()
    };

    onAddBook(bookData);
    setFormData({
      title: "",
      author: "",
      genres: "",
      condition: "Good",
      creditValue: 1,
      coverUrl: "",
      description: "",
      publishedDate: ""
    });
    setOpen(false);
    toast.success("Book added successfully");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <BookPlus className="h-5 w-5" />
          Add Book
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a Book to Exchange</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="author">Author *</Label>
            <Input
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="publishedDate">Published Date</Label>
            <Input
              id="publishedDate"
              name="publishedDate"
              value={formData.publishedDate}
              onChange={handleChange}
              placeholder="e.g. 2020 or January 2020"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter a brief description of the book"
              className="min-h-[100px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="genres">Genres (comma separated)</Label>
            <Input
              id="genres"
              name="genres"
              value={formData.genres}
              onChange={handleChange}
              placeholder="Fiction, Mystery, Romance"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="coverUrl">Cover Image URL</Label>
            <Input
              id="coverUrl"
              name="coverUrl"
              value={formData.coverUrl}
              onChange={handleChange}
              placeholder="https://example.com/book-cover.jpg"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="condition">Condition</Label>
              <Select 
                value={formData.condition} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, condition: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  {bookConditions.map(condition => (
                    <SelectItem key={condition} value={condition}>{condition}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="creditValue">Credit Value</Label>
              <Input
                id="creditValue"
                name="creditValue"
                type="number"
                min="1"
                max="5"
                value={formData.creditValue}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Book</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
