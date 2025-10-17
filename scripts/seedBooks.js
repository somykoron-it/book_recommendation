// scripts/seedBooks.js
import mongoose from "mongoose";
import Book from "../models/Book.js";

const MONGODB_URI =
  "mongodb+srv://cocshishir:nurMongodb015@cluster0.an9ml.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const books = [
  {
    title: "The Silent Patient",
    author: "Alex Michaelides",
    genres: ["Thriller", "Mystery"],
    summary:
      "A psychological thriller about a woman who shoots her husband and then stops speaking.",
    averageRating: 4.3,
    coverImageUrl: "https://example.com/silent-patient.jpg",
    publicationDate: new Date("2019-02-05"),
    isbn: "9781250301697",
  },
  {
    title: "Educated",
    author: "Tara Westover",
    genres: ["Memoir", "Nonfiction"],
    summary:
      "A memoir about a woman who grows up in a strict and abusive household in rural Idaho but escapes to learn about the world through education.",
    averageRating: 4.7,
    coverImageUrl: "https://example.com/educated.jpg",
    publicationDate: new Date("2018-02-18"),
    isbn: "9780399590504",
  },
  {
    title: "Atomic Habits",
    author: "James Clear",
    genres: ["Self-Help", "Personal Development"],
    summary:
      "A practical guide to building good habits and breaking bad ones through small, consistent changes.",
    averageRating: 4.8,
    coverImageUrl: "https://example.com/atomic-habits.jpg",
    publicationDate: new Date("2018-10-16"),
    isbn: "9780735211292",
  },
  {
    title: "The Alchemist",
    author: "Paulo Coelho",
    genres: ["Fiction", "Philosophical"],
    summary:
      "A novel about a shepherd named Santiago who dreams of finding a treasure and discovers his personal legend.",
    averageRating: 4.6,
    coverImageUrl: "https://example.com/alchemist.jpg",
    publicationDate: new Date("1988-04-25"),
    isbn: "9780061122415",
  },
  {
    title: "Where the Crawdads Sing",
    author: "Delia Owens",
    genres: ["Fiction", "Mystery"],
    summary:
      "A coming-of-age story of a young girl in the marshes of North Carolina, intertwined with a murder mystery.",
    averageRating: 4.5,
    coverImageUrl: "https://example.com/where-crawdads-sing.jpg",
    publicationDate: new Date("2018-08-14"),
    isbn: "9780735219113",
  },
  {
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    genres: ["Nonfiction", "History"],
    summary:
      "An exploration of the history of humankind, from the Stone Age to the modern era.",
    averageRating: 4.6,
    coverImageUrl: "https://example.com/sapiens.jpg",
    publicationDate: new Date("2014-09-04"),
    isbn: "9780062316097",
  },
  {
    title: "The Night Circus",
    author: "Erin Morgenstern",
    genres: ["Fantasy", "Romance"],
    summary:
      "A magical tale of two young illusionists bound in a mysterious competition within a traveling circus.",
    averageRating: 4.4,
    coverImageUrl: "https://example.com/night-circus.jpg",
    publicationDate: new Date("2011-09-13"),
    isbn: "9780385534635",
  },
  {
    title: "1984",
    author: "George Orwell",
    genres: ["Dystopian", "Fiction"],
    summary:
      "A classic dystopian novel about a totalitarian regime and the struggle for freedom and truth.",
    averageRating: 4.7,
    coverImageUrl: "https://example.com/1984.jpg",
    publicationDate: new Date("1949-06-08"),
    isbn: "9780451524935",
  },
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    genres: ["Fiction", "Classic"],
    summary:
      "A story of wealth, love, and the American Dream set in the Roaring Twenties.",
    averageRating: 4.4,
    coverImageUrl: "https://example.com/great-gatsby.jpg",
    publicationDate: new Date("1925-04-10"),
    isbn: "9780743273565",
  },
  {
    title: "Becoming",
    author: "Michelle Obama",
    genres: ["Memoir", "Nonfiction"],
    summary:
      "A memoir by the former First Lady of the United States, chronicling her life and experiences.",
    averageRating: 4.8,
    coverImageUrl: "https://example.com/becoming.jpg",
    publicationDate: new Date("2018-11-13"),
    isbn: "9781524763138",
  },
  {
    title: "Dune",
    author: "Frank Herbert",
    genres: ["Science Fiction", "Adventure"],
    summary:
      "A science fiction epic about political intrigue and survival on the desert planet Arrakis.",
    averageRating: 4.6,
    coverImageUrl: "https://example.com/dune.jpg",
    publicationDate: new Date("1965-08-01"),
    isbn: "9780441172719",
  },
  {
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    genres: ["Fantasy", "Adventure"],
    summary:
      "A fantasy novel about Bilbo Baggins' unexpected adventure with dwarves and a dragon.",
    averageRating: 4.7,
    coverImageUrl: "https://example.com/hobbit.jpg",
    publicationDate: new Date("1937-09-21"),
    isbn: "9780547928227",
  },
  {
    title: "Circe",
    author: "Madeline Miller",
    genres: ["Fantasy", "Mythology"],
    summary:
      "A retelling of the life of Circe, a powerful witch from Greek mythology.",
    averageRating: 4.5,
    coverImageUrl: "https://example.com/circe.jpg",
    publicationDate: new Date("2018-04-10"),
    isbn: "9780316556347",
  },
  {
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    genres: ["Nonfiction", "Psychology"],
    summary:
      "An exploration of how humans think, with insights into fast and slow decision-making processes.",
    averageRating: 4.5,
    coverImageUrl: "https://example.com/thinking-fast-slow.jpg",
    publicationDate: new Date("2011-10-25"),
    isbn: "9780374533557",
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    genres: ["Romance", "Classic"],
    summary:
      "A romantic novel about Elizabeth Bennet and her evolving relationship with Mr. Darcy.",
    averageRating: 4.6,
    coverImageUrl: "https://example.com/pride-prejudice.jpg",
    publicationDate: new Date("1813-01-28"),
    isbn: "9780141439518",
  },
  {
    title: "The Book Thief",
    author: "Markus Zusak",
    genres: ["Historical Fiction", "Young Adult"],
    summary:
      "A story set in Nazi Germany, narrated by Death, about a young girl who finds solace in stealing books.",
    averageRating: 4.7,
    coverImageUrl: "https://example.com/book-thief.jpg",
    publicationDate: new Date("2005-03-14"),
    isbn: "9780375842207",
  },
  {
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    genres: ["Fiction", "Classic"],
    summary:
      "A coming-of-age story about Holden Caulfield's struggles with identity and alienation.",
    averageRating: 4.3,
    coverImageUrl: "https://example.com/catcher-rye.jpg",
    publicationDate: new Date("1951-07-16"),
    isbn: "9780316769488",
  },
  {
    title: "A Man Called Ove",
    author: "Fredrik Backman",
    genres: ["Fiction", "Contemporary"],
    summary:
      "A heartwarming story about a grumpy old man whose life changes through unexpected friendships.",
    averageRating: 4.6,
    coverImageUrl: "https://example.com/man-called-ove.jpg",
    publicationDate: new Date("2014-07-15"),
    isbn: "9781476738024",
  },
  {
    title: "The Road",
    author: "Cormac McCarthy",
    genres: ["Post-Apocalyptic", "Fiction"],
    summary:
      "A bleak tale of a father and son surviving in a post-apocalyptic world.",
    averageRating: 4.4,
    coverImageUrl: "https://example.com/the-road.jpg",
    publicationDate: new Date("2006-09-26"),
    isbn: "9780307387899",
  },
  {
    title: "Born a Crime",
    author: "Trevor Noah",
    genres: ["Memoir", "Nonfiction"],
    summary:
      "A memoir by comedian Trevor Noah about growing up in apartheid South Africa.",
    averageRating: 4.8,
    coverImageUrl: "https://example.com/born-crime.jpg",
    publicationDate: new Date("2016-11-15"),
    isbn: "9780399588174",
  },
  {
    title: "The Martian",
    author: "Andy Weir",
    genres: ["Science Fiction", "Adventure"],
    summary:
      "A gripping tale of an astronaut stranded on Mars, fighting to survive against all odds.",
    averageRating: 4.7,
    coverImageUrl: "https://example.com/the-martian.jpg",
    publicationDate: new Date("2014-02-11"),
    isbn: "9780804139021",
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    genres: ["Fiction", "Classic"],
    summary:
      "A story of racial injustice and the loss of innocence in a small Southern town.",
    averageRating: 4.8,
    coverImageUrl: "https://example.com/to-kill-mockingbird.jpg",
    publicationDate: new Date("1960-07-11"),
    isbn: "9780446310789",
  },
  {
    title: "The Seven Husbands of Evelyn Hugo",
    author: "Taylor Jenkins Reid",
    genres: ["Fiction", "Romance"],
    summary:
      "A glamorous tale of a Hollywood star and the secrets of her seven marriages.",
    averageRating: 4.5,
    coverImageUrl: "https://example.com/evelyn-hugo.jpg",
    publicationDate: new Date("2017-06-13"),
    isbn: "9781501139239",
  },
  {
    title: "Man’s Search for Meaning",
    author: "Viktor E. Frankl",
    genres: ["Nonfiction", "Philosophy"],
    summary:
      "A memoir and psychological exploration of finding purpose in the face of suffering.",
    averageRating: 4.7,
    coverImageUrl: "https://example.com/mans-search-meaning.jpg",
    publicationDate: new Date("1946-06-01"),
    isbn: "9780807014295",
  },
];

async function seedBooks() {
  try {
    console.log("🔗 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected successfully!");

    console.log("🧹 Clearing old data...");
    await Book.deleteMany({});

    console.log("📚 Inserting new books...");
    await Book.insertMany(books);

    console.log(`✅ Successfully inserted ${books.length} books!`);
  } catch (error) {
    console.error("❌ Error seeding books:", error);
  } finally {
    mongoose.connection.close();
  }
}

seedBooks();
