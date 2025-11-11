import PrivateRoute from "@/components/context.js/PrivateRoute";
import SettingsUi from "@/components/Settings/SettingsUi";

const page = () => {
  return (
    <PrivateRoute>
      <SettingsUi />
    </PrivateRoute>
  );
};

export default page;
