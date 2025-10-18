// SettingsUi.jsx
import ProfileInfo from "./ProfileInfo";
import ChangePassword from "./ChangePassword";

const SettingsUi = () => {
  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex-grow">
      <div>
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900 dark:text-white">
          Account Settings
        </h2>
        <div className="space-y-12">
          <ProfileInfo />
          <ChangePassword />
        </div>
      </div>
    </main>
  );
};

export default SettingsUi;
