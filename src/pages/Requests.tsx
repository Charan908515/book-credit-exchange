
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { NavBar } from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { requestApi } from "@/services/api";

// Define Request type
interface RequestType {
  _id: string;
  bookId: {
    _id: string;
    title: string;
    author: string;
    genres: string[];
    condition: string;
    creditValue: number;
    coverUrl: string;
    description: string;
  };
  requesterId: {
    _id: string;
    username: string;
    email: string;
  };
  ownerId: {
    _id: string;
    username: string;
    email: string;
  };
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  meetupDetails: string;
  createdAt: string;
  updatedAt: string;
}

const RequestCard = ({ 
  request, 
  actions, 
  isOutgoing = false 
}: { 
  request: RequestType, 
  actions?: React.ReactNode, 
  isOutgoing?: boolean 
}) => {
  const book = request.bookId;
  const requestUser = isOutgoing ? request.ownerId : request.requesterId;
  
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
          <span className={`text-sm font-medium ${
            request.status === "approved" ? "text-green-600" : 
            request.status === "rejected" ? "text-red-600" : "text-amber-600"
          }`}>
            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
          </span>
        </div>
        <div className="mt-1">
          {isOutgoing ? (
            <span className="text-sm">Owned by: <span className="font-medium">{requestUser.username}</span></span>
          ) : (
            <span className="text-sm">Requested by: <span className="font-medium">{requestUser.username}</span></span>
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
  const [incomingRequests, setIncomingRequests] = useState<RequestType[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<RequestType[]>([]);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [meetupDetails, setMeetupDetails] = useState("");
  const [showMeetupDialog, setShowMeetupDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!user) {
      toast.error("Please sign in to access your requests");
      navigate("/login");
      return;
    }

    const fetchRequests = async () => {
      try {
        setIsLoading(true);
        // Fetch both incoming and outgoing requests in parallel
        const [incoming, outgoing] = await Promise.all([
          requestApi.getIncomingRequests(user._id),
          requestApi.getOutgoingRequests(user._id)
        ]);
        
        setIncomingRequests(incoming || []);
        setOutgoingRequests(outgoing || []);
      } catch (error) {
        console.error("Error fetching requests:", error);
        toast.error("Failed to fetch requests. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequests();
  }, [user, navigate]);

  // If not authenticated, don't render the content
  if (!user) {
    return null;
  }

  const handleCancelRequest = async (requestId: string) => {
    try {
      await requestApi.cancelRequest(requestId);
      setOutgoingRequests(prev => prev.filter(req => req._id !== requestId));
      toast.success("Request cancelled successfully");
    } catch (error) {
      console.error("Error cancelling request:", error);
      toast.error("Failed to cancel request. Please try again.");
    }
  };

  const handleOpenApprovalDialog = (requestId: string) => {
    setSelectedRequestId(requestId);
    setMeetupDetails("");
    setShowMeetupDialog(true);
  };

  const handleSendMeetupDetails = async () => {
    if (!selectedRequestId || !meetupDetails.trim()) {
      toast.error("Please enter the meetup details");
      return;
    }

    try {
      const updatedRequest = await requestApi.updateRequest(selectedRequestId, {
        status: 'approved',
        meetupDetails: meetupDetails
      });
      
      // Update the request in the list
      setIncomingRequests(prev => prev.map(req => 
        req._id === selectedRequestId ? updatedRequest : req
      ));
      
      toast.success(`Request approved and meetup details sent to ${updatedRequest.requesterId.username}`);
      
      // Close the dialog
      setShowMeetupDialog(false);
      setSelectedRequestId(null);
    } catch (error) {
      console.error("Error approving request:", error);
      toast.error("Failed to approve request. Please try again.");
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      await requestApi.updateRequest(requestId, { status: 'rejected' });
      // Remove the request from the incoming list
      setIncomingRequests(prev => prev.filter(req => req._id !== requestId));
      toast.success("Request rejected successfully");
    } catch (error) {
      console.error("Error rejecting request:", error);
      toast.error("Failed to reject request. Please try again.");
    }
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
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <p className="text-muted-foreground">Loading your requests...</p>
              </div>
            ) : outgoingRequests.length > 0 ? (
              <div className="space-y-4">
                {outgoingRequests.map((request) => (
                  <RequestCard 
                    key={request._id}
                    request={request}
                    isOutgoing={true}
                    actions={
                      request.status === "pending" ? (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleCancelRequest(request._id)}
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
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <p className="text-muted-foreground">Loading your requests...</p>
              </div>
            ) : incomingRequests.length > 0 ? (
              <div className="space-y-4">
                {incomingRequests.map((request) => (
                  <RequestCard 
                    key={request._id}
                    request={request}
                    actions={
                      request.status === "pending" ? (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleRejectRequest(request._id)}
                          >
                            <X className="mr-1 h-4 w-4" />
                            Reject
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-green-600 hover:text-green-600"
                            onClick={() => handleOpenApprovalDialog(request._id)}
                          >
                            <Check className="mr-1 h-4 w-4" />
                            Approve
                          </Button>
                        </>
                      ) : null
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

      {/* Meetup Details Dialog */}
      <Dialog open={showMeetupDialog} onOpenChange={setShowMeetupDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Book Request</DialogTitle>
            <DialogDescription>
              Please provide details about when and where you will give the book to the requester.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Textarea
              value={meetupDetails}
              onChange={(e) => setMeetupDetails(e.target.value)}
              placeholder="When and where you will give the book"
              className="min-h-[100px]"
            />
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowMeetupDialog(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSendMeetupDetails}
              disabled={!meetupDetails.trim()}
            >
              Send Details & Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Requests;
