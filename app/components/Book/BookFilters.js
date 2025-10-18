"use client";
import { useState, useEffect } from "react";

const BookFilters = ({ filters, onFiltersChange }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const allGenres = [
    "Fiction",
    "Non-fiction",
    "Fantasy",
    "Science",
    "Biography",
    "Mystery",
    "Romance",
    "History",
  ];

  // Sync local state with props
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleGenreToggle = (genre) => {
    const newGenres = localFilters.genres.includes(genre)
      ? localFilters.genres.filter((g) => g !== genre)
      : [...localFilters.genres, genre];
    const newFilters = { ...localFilters, genres: newGenres };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleYearChange = (index, value) => {
    const newYearRange = [...localFilters.publicationYear];
    newYearRange[index] = parseInt(value);
    if (index === 0 && newYearRange[0] > newYearRange[1])
      newYearRange[1] = newYearRange[0];
    if (index === 1 && newYearRange[1] < newYearRange[0])
      newYearRange[0] = newYearRange[1];
    const newFilters = { ...localFilters, publicationYear: newYearRange };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleRatingChange = (rating) => {
    const newFilters = { ...localFilters, minRating: rating };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const sliderStyle = (() => {
    const yearRange = [1900, new Date().getFullYear()];
    const totalRange = yearRange[1] - yearRange[0];
    const left =
      ((localFilters.publicationYear[0] - yearRange[0]) / totalRange) * 100;
    const width =
      ((localFilters.publicationYear[1] - localFilters.publicationYear[0]) /
        totalRange) *
      100;
    return { left: `${left}%`, width: `${width}%` };
  })();

  return (
    <div className="space-y-8">
      {/* Genre Filter */}
      <div>
        <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
          Genre
        </h3>
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {allGenres.map((genre) => (
            <label
              key={genre}
              className="flex items-center gap-x-3 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={localFilters.genres.includes(genre)}
                onChange={() => handleGenreToggle(genre)}
                className="h-4 w-4 rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-900 dark:text-white">
                {genre}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Publication Year Slider */}
      <div>
        <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
          Publication Year
        </h3>
        <div className="px-2">
          <div className="relative h-2 rounded-full bg-slate-200 dark:bg-slate-800 mb-6">
            <div
              className="absolute h-2 rounded-full bg-blue-500"
              style={sliderStyle}
            ></div>
            <input
              type="range"
              min={1900}
              max={new Date().getFullYear()}
              value={localFilters.publicationYear[0]}
              onChange={(e) => handleYearChange(0, e.target.value)}
              className="absolute top-0 w-full h-2 opacity-0 cursor-pointer"
            />
            <input
              type="range"
              min={1900}
              max={new Date().getFullYear()}
              value={localFilters.publicationYear[1]}
              onChange={(e) => handleYearChange(1, e.target.value)}
              className="absolute top-0 w-full h-2 opacity-0 cursor-pointer"
            />
          </div>
          <div className="flex justify-between text-sm text-slate-900 dark:text-white mt-2">
            <span>{localFilters.publicationYear[0]}</span>
            <span>{localFilters.publicationYear[1]}</span>
          </div>
        </div>
      </div>

      {/* Minimum Rating */}
      <div>
        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
          Minimum Rating
        </h4>
        <div className="flex flex-wrap gap-3">
          {[0, 1, 2, 3, 4, 5].map((rating) => (
            <label key={rating} className="cursor-pointer">
              <input
                className="peer sr-only"
                name="rating"
                type="radio"
                checked={localFilters.minRating === rating}
                onChange={() => handleRatingChange(rating)}
              />
              <div className="rounded px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white peer-checked:bg-blue-500 peer-checked:text-white peer-checked:border-blue-500 transition-colors">
                {rating === 0
                  ? "Any"
                  : rating === 5
                  ? "5 stars"
                  : `${rating}+ star${rating > 1 ? "s" : ""}`}
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookFilters;
