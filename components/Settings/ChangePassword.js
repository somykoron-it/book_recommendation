"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Get user ID from localStorage
      const userId = localStorage.getItem("UserId");

      if (!userId) {
        toast.error("User not authenticated. Please log in again.");
        setIsLoading(false);
        return;
      }

      // 🧠 Basic validations
      if (!currentPassword || !newPassword || !confirmPassword) {
        toast.error("Please fill in all fields");
        setIsLoading(false);
        return;
      }

      if (newPassword.length < 6) {
        toast.error("New password must be at least 6 characters long");
        setIsLoading(false);
        return;
      }

      if (newPassword !== confirmPassword) {
        toast.error("New passwords do not match");
        setIsLoading(false);
        return;
      }

      // ✅ Send request to your backend API
      const res = await fetch("/api/auth/user/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          currentPassword,
          newPassword,
        }),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success(result.message || "Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(result.message || "Failed to change password");
      }
    } catch (error) {
      console.error("Password change error:", error);
      toast.error("An error occurred while changing password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
        Change Password
      </h3>

      <form className="space-y-6" onSubmit={handlePasswordChange}>
        {/* Current Password */}
        <div>
          <Label
            htmlFor="current_password"
            className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2"
          >
            Current Password
          </Label>
          <Input
            id="current_password"
            type="password"
            placeholder="Enter your current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>

        {/* New Password + Confirm */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label
              htmlFor="new_password"
              className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2"
            >
              New Password
            </Label>
            <Input
              id="new_password"
              type="password"
              placeholder="Enter a new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
            />
            <p className="text-xs text-gray-500 mt-1">
              Must be at least 6 characters long
            </p>
          </div>

          <div>
            <Label
              htmlFor="confirm_password"
              className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2"
            >
              Confirm New Password
            </Label>
            <Input
              id="confirm_password"
              type="password"
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={
              isLoading || !currentPassword || !newPassword || !confirmPassword
            }
            className="bg-primary text-white font-bold py-3 px-6 rounded-md hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Changing Password..." : "Change Password"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
