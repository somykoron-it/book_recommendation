import PrivateRoute from "@/components/context.js/PrivateRoute";
import NotificationPage from "@/components/Notification/NotificationPage";

const page = () => {
  return (
    <PrivateRoute>
      <NotificationPage />
    </PrivateRoute>
  );
};

export default page;
