import PrivateRoute from "@/components/context.js/PrivateRoute";
import Recommendation from "@/components/Recommendation/Recommendation";

const page = () => {
  return (
    <PrivateRoute>
      <Recommendation />
    </PrivateRoute>
  );
};

export default page;
