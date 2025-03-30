
import { useEffect, useState } from "react";
import { NavBar } from "@/components/NavBar";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { userApi } from "@/services/api";

interface Transaction {
  _id: string;
  type: string;
  bookId: string;
  bookTitle: string;
  date: string;
}

const Profile = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  
  useEffect(() => {
    // Redirect if not logged in
    if (!isLoading && !user) {
      toast.error("Please login to view your profile");
      navigate("/login");
      return;
    }
    
    // Fetch user's transaction history
    if (user) {
      const fetchTransactions = async () => {
        try {
          setTransactionsLoading(true);
          const data = await userApi.getUserTransactions(user._id);
          setTransactions(data || []);
        } catch (error) {
          console.error("Failed to fetch transactions:", error);
        } finally {
          setTransactionsLoading(false);
        }
      };
      
      fetchTransactions();
    }
  }, [user, isLoading, navigate]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <div className="flex-1 flex items-center justify-center">
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return null; // Will redirect in useEffect
  }
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-1 container py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Profile</h1>
            <p className="text-muted-foreground">
              Manage your account information and preferences
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <div className="bg-card rounded-lg border p-6">
                <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Username</label>
                      <div className="mt-1 p-2 border rounded-md">{user.username}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <div className="mt-1 p-2 border rounded-md">{user.email}</div>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Account Status</label>
                    <div className="mt-1 p-2 border rounded-md flex items-center gap-2">
                      <span className={`inline-block w-2 h-2 rounded-full ${user.isAdmin ? "bg-amber-500" : "bg-green-500"}`}></span>
                      <span>{user.isAdmin ? "Administrator" : "Regular User"}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-card rounded-lg border p-6">
                <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
                {transactionsLoading ? (
                  <p>Loading transaction history...</p>
                ) : transactions.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Date</th>
                          <th className="text-left py-2">Book</th>
                          <th className="text-left py-2">Transaction Type</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.map((transaction) => (
                          <tr key={transaction._id} className="border-b">
                            <td className="py-2">{formatDate(transaction.date)}</td>
                            <td className="py-2">{transaction.bookTitle}</td>
                            <td className="py-2">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                transaction.type === "shared" 
                                  ? "bg-blue-100 text-blue-800" 
                                  : "bg-green-100 text-green-800"
                              }`}>
                                {transaction.type === "shared" ? "Shared" : "Received"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-muted-foreground">No transaction history found.</p>
                )}
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-card rounded-lg border p-6">
                <h2 className="text-xl font-semibold mb-4">Profile Summary</h2>
                <div className="space-y-4">
                  <div>
                    <span className="text-sm font-medium">Member Since</span>
                    <div className="mt-1">{user.createdAt ? formatDate(user.createdAt) : "Not available"}</div>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Credits Balance</span>
                    <div className="mt-1 flex items-center">
                      <span className="text-2xl font-bold text-book-burgundy">{user.credits}</span>
                      <span className="ml-1 text-sm text-muted-foreground">credits</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-card rounded-lg border p-6">
                <h2 className="text-xl font-semibold mb-4">Account Actions</h2>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    Change Password
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Email Preferences
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive">
                    Delete Account
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
