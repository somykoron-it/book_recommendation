import PrivateRoute from "@/components/context.js/PrivateRoute";
import UsersBooks from "../../components/UserBooks/UsersBooks";

const page = () => {
  return (
    <PrivateRoute>
      <UsersBooks />
    </PrivateRoute>
  );
};

export default page;
