import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { NavBar } from "@/components/NavBar";
import { userApi, bookApi } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookType } from "@/types/book";
import { toast } from "sonner";

interface UserType {
  _id: string;
  username: string;
  email: string;
  credits: number;
  isAdmin: boolean;
  createdAt: string;
}

export default function Admin() {
  const [activeTab, setActiveTab] = useState("users");

  const {
    data: users,
    isLoading: usersLoading,
    refetch: refetchUsers,
  } = useQuery({
    queryKey: ["users"],
    queryFn: userApi.getAllUsers,
  });

  const {
    data: books,
    isLoading: booksLoading,
    refetch: refetchBooks,
  } = useQuery({
    queryKey: ["books"],
    queryFn: bookApi.getAllBooks,
  });

  const handleToggleAdmin = async (user: UserType) => {
    try {
      await userApi.updateUser(user._id, { isAdmin: !user.isAdmin });
      toast.success(`Admin status updated for ${user.username}`);
      refetchUsers();
    } catch (error) {
      toast.error("Failed to update admin status");
      console.error(error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        await userApi.deleteUser(userId);
        toast.success("User deleted successfully");
        refetchUsers();
      } catch (error) {
        toast.error("Failed to delete user");
        console.error(error);
      }
    }
  };

  const handleDeleteBook = async (bookId: string) => {
    if (confirm("Are you sure you want to delete this book?")) {
      try {
        await bookApi.deleteBook(bookId);
        toast.success("Book deleted successfully");
        refetchBooks();
      } catch (error) {
        toast.error("Failed to delete book");
        console.error(error);
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="container flex-1 py-6">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        <Tabs
          defaultValue="users"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="users">Manage Users</TabsTrigger>
            <TabsTrigger value="books">Manage Books</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="mt-6">
            <div className="rounded-md border">
              <div className="overflow-x-auto">
                {usersLoading ? (
                  <div className="p-8 text-center">Loading users...</div>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="py-3 px-4 text-left">Username</th>
                        <th className="py-3 px-4 text-left">Email</th>
                        <th className="py-3 px-4 text-left">Credits</th>
                        <th className="py-3 px-4 text-left">Admin</th>
                        <th className="py-3 px-4 text-left">Created</th>
                        <th className="py-3 px-4 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users?.map((user: UserType) => (
                        <tr key={user._id} className="border-b">
                          <td className="py-3 px-4">{user.username}</td>
                          <td className="py-3 px-4">{user.email}</td>
                          <td className="py-3 px-4">{user.credits}</td>
                          <td className="py-3 px-4">
                            <Button
                              variant={user.isAdmin ? "default" : "outline"}
                              onClick={() => handleToggleAdmin(user)}
                              size="sm"
                            >
                              {user.isAdmin ? "Admin" : "User"}
                            </Button>
                          </td>
                          <td className="py-3 px-4">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteUser(user._id)}
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="books" className="mt-6">
            <div className="rounded-md border">
              <div className="overflow-x-auto">
                {booksLoading ? (
                  <div className="p-8 text-center">Loading books...</div>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="py-3 px-4 text-left">Title</th>
                        <th className="py-3 px-4 text-left">Author</th>
                        <th className="py-3 px-4 text-left">Condition</th>
                        <th className="py-3 px-4 text-left">Credits</th>
                        <th className="py-3 px-4 text-left">Read Count</th>
                        <th className="py-3 px-4 text-left">Status</th>
                        <th className="py-3 px-4 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {books?.map((book: BookType) => (
                        <tr key={book.id} className="border-b">
                          <td className="py-3 px-4">{book.title}</td>
                          <td className="py-3 px-4">{book.author}</td>
                          <td className="py-3 px-4">{book.condition}</td>
                          <td className="py-3 px-4">{book.creditValue}</td>
                          <td className="py-3 px-4">{book.readCount || 0}</td>
                          <td className="py-3 px-4">{book.status || "Available"}</td>
                          <td className="py-3 px-4">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteBook(book.id)}
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
