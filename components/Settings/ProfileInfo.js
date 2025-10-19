"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";

const ProfileInfo = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState("");

  // Access localStorage only on the client
  useEffect(() => {
    const storedUserId = localStorage.getItem("UserId");
    const storedUser = localStorage.getItem("user");
    const storedEmail = localStorage.getItem("userEmail");
    const storedAvatar = localStorage.getItem("userAvatar");

    if (storedUser) setUserName(storedUser);
    if (storedEmail) setEmail(storedEmail);
    if (storedAvatar) setAvatar(storedAvatar);
    if (storedUserId) setUserId(storedUserId);
  }, []);

  // Fetch current user info from backend
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUserId = localStorage.getItem("UserId");

        if (!storedUserId) {
          console.log("No user ID found in localStorage");
          return;
        }

        const res = await fetch(`/api/auth/user/me?userId=${storedUserId}`);
        const data = await res.json();

        if (res.ok) {
          setUserName(data.user.username || "");
          setEmail(data.user.email || "");
          setAvatar(data.user.avatar || "");
          setUserId(storedUserId);

          // Keep localStorage updated for quick reloads
          localStorage.setItem("user", data.user.username || "");
          localStorage.setItem("userEmail", data.user.email || "");
          localStorage.setItem("userAvatar", data.user.avatar || "");
          localStorage.setItem("UserId", storedUserId);
        } else {
          toast.error(data.message || "Failed to load profile");
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        toast.error("Error loading profile data");
      }
    };

    fetchUser();
  }, []);

  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const storedUserId = localStorage.getItem("UserId");

      if (!storedUserId) {
        toast.error("User not authenticated. Please log in again.");
        setIsLoading(false);
        return;
      }

      const updateData = { userId: storedUserId };
      if (newUsername && newUsername !== userName)
        updateData.username = newUsername;
      if (newEmail && newEmail !== email) updateData.email = newEmail;
      if (avatar && !avatar.startsWith("blob:")) updateData.avatar = avatar;

      // Check if there are any changes besides userId
      const hasChanges = Object.keys(updateData).length > 1;

      if (!hasChanges) {
        toast.error("No changes detected");
        setIsLoading(false);
        return;
      }

      const res = await fetch("/api/auth/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success(result.message || "Profile updated successfully");

        // Update local and state data
        if (updateData.username) {
          setUserName(updateData.username);
          localStorage.setItem("user", updateData.username);
          setNewUsername("");
        }
        if (updateData.email) {
          setEmail(updateData.email);
          localStorage.setItem("userEmail", updateData.email);
          setNewEmail("");
        }
        if (updateData.avatar) {
          setAvatar(updateData.avatar);
          localStorage.setItem("userAvatar", updateData.avatar);
        }

        // Update with the full user object from response if available
        if (result.user) {
          setUserName(result.user.username || "");
          setEmail(result.user.email || "");
          setAvatar(result.user.avatar || "");

          localStorage.setItem("user", result.user.username || "");
          localStorage.setItem("userEmail", result.user.email || "");
          localStorage.setItem("userAvatar", result.user.avatar || "");
        }
      } else {
        toast.error(result.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Error updating profile");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle avatar preview (temporary only)
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setAvatar(previewUrl);
      toast.info("Avatar preview added. Upload feature coming soon!");
    }
  };

  // Clear form fields
  const clearFormFields = () => {
    setNewUsername("");
    setNewEmail("");
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
        Profile Information
      </h3>

      {/* Avatar Section */}
      <div className="flex items-center gap-6 mb-6">
        <div className="relative">
          <div
            className="w-24 h-24 rounded-full bg-cover bg-center border-2 border-gray-300 dark:border-gray-600"
            style={{
              backgroundImage: `url('${
                avatar ||
                "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              }')`,
            }}
          ></div>
          <Label
            htmlFor="profile_picture"
            className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-2 cursor-pointer hover:bg-blue-700 transition-all duration-200"
          >
            <span className="material-symbols-outlined text-sm">edit</span>
            <Input
              className="hidden"
              id="profile_picture"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
            />
          </Label>
        </div>

        <div className="space-y-2">
          <div>
            <Label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
              Username
            </Label>
            <p className="text-lg text-gray-900 dark:text-white">
              {userName || "Not set"}
            </p>
          </div>
          <div>
            <Label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
              Email
            </Label>
            <p className="text-lg text-gray-900 dark:text-white">
              {email || "Not set"}
            </p>
          </div>
        </div>
      </div>

      {/* Update Form */}
      <form onSubmit={handleProfileUpdate} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
              Update Username
            </Label>
            <Input
              placeholder={userName || "e.g., @janedoe"}
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <Label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
              Update Email
            </Label>
            <Input
              placeholder={email || "e.g., jane.doe@example.com"}
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={clearFormFields}
            disabled={isLoading}
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Clear
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-primary text-white font-bold py-3 px-6 rounded-md hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Updating..." : "Update Profile"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfileInfo;
