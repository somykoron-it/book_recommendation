import Image from "next/image";

// components/BookCard.jsx
const NewBookCard = ({ book, onBookClick }) => {
  return (
    <div
      className="flex flex-col gap-2 group cursor-pointer"
      onClick={() => onBookClick && onBookClick(book)}
    >
      <div className="w-full bg-center bg-no-repeat aspect-[3/4] bg-cover rounded-lg overflow-hidden shadow-md border border-slate-200 dark:border-slate-700">
        <Image
          width={100}
          height={100}
          alt={`Book cover: ${book.title}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          src={book.coverImageUrl}
        />
      </div>
      <div>
        <p className="font-semibold text-slate-900 dark:text-white text-sm leading-tight line-clamp-2">
          {book.title}
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {book.author}
        </p>
      </div>
    </div>
  );
};

export default NewBookCard;
