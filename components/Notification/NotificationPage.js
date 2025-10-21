// app/notification/page.jsx
"use client";
import { useState, useEffect } from "react";

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();

    // Polling every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch("/api/notifications", {
        headers: {
          "x-user-id": localStorage.getItem("UserId"),
        },
      });

      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllAsRead = () => {
    // Implement mark all as read logic (e.g., API call)
    console.log("Mark all as read");
  };

  const handleClearAll = () => {
    // Implement clear all logic (e.g., API call)
    setNotifications([]);
  };

  if (loading) {
    return (
      <main className="flex-1 px-10 py-8 bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-4xl">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 min-h-[90dvh]">
      <div className="">
        {/* Header */}
        <div className="mb-8 flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Notifications
          </h1>
          <div className="flex gap-2">
            <button
              onClick={handleMarkAllAsRead}
              className="rounded-lg bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-500/20 dark:bg-blue-500/20 dark:hover:bg-blue-500/30 transition-colors cursor-pointer"
            >
              Mark all as read
            </button>
            <button
              onClick={handleClearAll}
              className="rounded-lg bg-red-500/10 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-500/20 dark:bg-red-500/20 dark:hover:bg-red-500/30 transition-colors cursor-pointer"
            >
              Clear all
            </button>
          </div>
        </div>

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <div className="text-center py-16 text-gray-500 dark:text-gray-400">
            No notifications yet
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="flex items-center justify-between rounded-lg bg-background-light  p-4 shadow-sm dark:bg-gray-800 transition-all hover:shadow-md cursor-pointer hover:bg-background-light/80"
              >
                {/* Left: Avatar + Content */}
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    {notification.sender.avatar ? (
                      <div
                        className="h-12 w-12 rounded-full bg-cover bg-center"
                        style={{
                          backgroundImage: `url(${notification.sender.avatar})`,
                        }}
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10 text-blue-600 dark:bg-blue-500/20">
                        <span className="text-lg font-semibold">
                          {notification.sender.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Message & Time */}
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      {notification.sender.username}{" "}
                      <span className="font-normal">
                        {notification.message}
                      </span>
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(notification.date).toLocaleDateString()} at{" "}
                      {new Date(notification.date).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>

                {/* Right: Status Dot */}
                <div
                  className={`h-2.5 w-2.5 rounded-full ${
                    notification.type === "follow"
                      ? "bg-green-500"
                      : "bg-blue-500"
                  }`}
                ></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default NotificationPage;
