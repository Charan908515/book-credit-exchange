
import { NavBar } from "@/components/NavBar";

const Profile = () => {
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
                      <label className="text-sm font-medium">Full Name</label>
                      <div className="mt-1 p-2 border rounded-md">John Doe</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <div className="mt-1 p-2 border rounded-md">john.doe@example.com</div>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Address</label>
                    <div className="mt-1 p-2 border rounded-md">123 Book St, Reading, CA 90210</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-card rounded-lg border p-6">
                <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Email Notifications</label>
                    <div className="mt-1 flex items-center">
                      <input type="checkbox" checked className="rounded border-gray-300" />
                      <span className="ml-2">Receive notifications for book requests</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Account Privacy</label>
                    <div className="mt-1 flex items-center">
                      <input type="checkbox" checked className="rounded border-gray-300" />
                      <span className="ml-2">Show my profile to other members</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-card rounded-lg border p-6">
                <h2 className="text-xl font-semibold mb-4">Profile Summary</h2>
                <div className="space-y-4">
                  <div>
                    <span className="text-sm font-medium">Member Since</span>
                    <div className="mt-1">January 15, 2023</div>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Books Shared</span>
                    <div className="mt-1">12</div>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Books Received</span>
                    <div className="mt-1">8</div>
                  </div>
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
