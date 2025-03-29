
export interface BookType {
  id: string;
  title: string;
  author: string;
  genres: string[];
  condition: string;
  creditValue: number;
  coverUrl: string;
  status?: string;
  requestedBy?: string;
  addedAt?: Date;
  readCount?: number;
}
