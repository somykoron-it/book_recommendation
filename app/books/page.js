import BookList from "../components/Book/BookList";
import PrivateRoute from "../components/context.js/PrivateRoute";

// This is a Server Component by default
export default function HomePage() {
  return (
    <PrivateRoute>
      <main>
        {/* You can add a welcoming message or hero section here */}
        <BookList />
      </main>
    </PrivateRoute>
  );
}
