"use client";
// components/BookFilters.jsx
import { useState, useEffect, useMemo } from "react";

const BookFilters = ({ books, onFiltersChange }) => {
  const [filters, setFilters] = useState({
    genres: [],
    publicationYear: [1900, new Date().getFullYear()],
    minRating: 0,
  });

  const allGenres = useMemo(
    () => [...new Set(books.flatMap((book) => book.genres))].sort(),
    [books]
  );

  // ✅ Memoize yearRange to prevent re-renders
  const yearRange = useMemo(() => {
    return books.reduce(
      (acc, book) => {
        const year = new Date(book.publicationDate).getFullYear();
        return [Math.min(acc[0], year), Math.max(acc[1], year)];
      },
      [new Date().getFullYear(), 1900]
    );
  }, [books]);

  const [localYearRange, setLocalYearRange] = useState(yearRange);

  useEffect(() => {
    setLocalYearRange(yearRange);
    setFilters((prev) => ({
      ...prev,
      publicationYear: yearRange,
    }));
  }, [yearRange]);

  const handleGenreToggle = (genre) => {
    const newGenres = filters.genres.includes(genre)
      ? filters.genres.filter((g) => g !== genre)
      : [...filters.genres, genre];

    const newFilters = { ...filters, genres: newGenres };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleYearChange = (index, value) => {
    const newYearRange = [...localYearRange];
    newYearRange[index] = parseInt(value);

    // Ensure min <= max
    if (index === 0 && newYearRange[0] > newYearRange[1]) {
      newYearRange[1] = newYearRange[0];
    } else if (index === 1 && newYearRange[1] < newYearRange[0]) {
      newYearRange[0] = newYearRange[1];
    }

    setLocalYearRange(newYearRange);

    const newFilters = { ...filters, publicationYear: newYearRange };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleRatingChange = (rating) => {
    const newFilters = { ...filters, minRating: rating };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const calculateSliderPosition = () => {
    const totalRange = yearRange[1] - yearRange[0];
    const left = ((localYearRange[0] - yearRange[0]) / totalRange) * 100;
    const width = ((localYearRange[1] - localYearRange[0]) / totalRange) * 100;
    return { left: `${left}%`, width: `${width}%` };
  };

  const sliderStyle = calculateSliderPosition();

  return (
    <div className="space-y-6">
      {/* Genre Filter */}
      <div>
        <h3 className="font-semibold text-slate-900 dark:text-white mb-3">
          Genre
        </h3>
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {allGenres.map((genre) => (
            <label
              key={genre}
              className="flex items-center gap-x-3 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={filters.genres.includes(genre)}
                onChange={() => handleGenreToggle(genre)}
                className="h-4 w-4 rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-700 dark:text-slate-300">
                {genre}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Publication Year - Slider Style */}
      <div>
        <h3 className="font-semibold text-slate-900 dark:text-white mb-3">
          Publication Year
        </h3>
        <div className="relative h-2 rounded-full bg-slate-200 dark:bg-slate-800 mb-8">
          <div
            className="absolute h-2 rounded-full bg-blue-500"
            style={sliderStyle}
          ></div>

          {/* Min Year Handle */}
          <div
            className="absolute -top-1.5 cursor-pointer"
            style={{ left: sliderStyle.left }}
          >
            <div className="size-5 rounded-full bg-blue-500 border-2 border-white dark:border-slate-900 shadow-md"></div>
            <span className="absolute top-6 left-1/2 -translate-x-1/2 text-xs font-medium text-slate-600 dark:text-slate-400">
              {localYearRange[0]}
            </span>
          </div>

          {/* Max Year Handle */}
          <div
            className="absolute -top-1.5 cursor-pointer"
            style={{ left: `calc(${sliderStyle.left} + ${sliderStyle.width})` }}
          >
            <div className="size-5 rounded-full bg-blue-500 border-2 border-white dark:border-slate-900 shadow-md"></div>
            <span className="absolute top-6 left-1/2 -translate-x-1/2 text-xs font-medium text-slate-600 dark:text-slate-400">
              {localYearRange[1]}
            </span>
          </div>

          {/* Hidden range inputs for dragging */}
          <input
            type="range"
            min={yearRange[0]}
            max={yearRange[1]}
            value={localYearRange[0]}
            onChange={(e) => handleYearChange(0, e.target.value)}
            className="absolute top-0 w-full h-2 opacity-0 cursor-pointer"
          />
          <input
            type="range"
            min={yearRange[0]}
            max={yearRange[1]}
            value={localYearRange[1]}
            onChange={(e) => handleYearChange(1, e.target.value)}
            className="absolute top-0 w-full h-2 opacity-0 cursor-pointer"
          />
        </div>
      </div>

      {/* Minimum Rating - Updated Style */}
      <div>
        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
          Minimum Rating
        </h4>
        <div className="flex flex-wrap gap-2">
          {[0, 1, 2, 3, 4, 5].map((rating) => (
            <label key={rating} className="cursor-pointer">
              <input
                className="peer sr-only"
                name="rating"
                type="radio"
                checked={filters.minRating === rating}
                onChange={() => handleRatingChange(rating)}
              />
              <div className="rounded px-3 py-1 text-sm border border-slate-300 dark:border-slate-700 peer-checked:bg-blue-500 peer-checked:text-white peer-checked:border-blue-500 transition-colors">
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
