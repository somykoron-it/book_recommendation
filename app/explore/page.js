import BookListUi from "@/components/Book/BookListUi";
import PrivateRoute from "@/components/context.js/PrivateRoute";


// This is a Server Component by default
export default function HomePage() {
  return (
    <PrivateRoute>
      <BookListUi />
    </PrivateRoute>
  );
}
