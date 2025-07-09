"use client";

import clsx from "clsx";

function Input({
  type = "text",
  placeholder,
  value,
  onChange,
  required,
  className = "",
  name,
  id,
  disabled,
  autoComplete,
}) {
  return (
    <input
      type={type}
      id={id}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      disabled={disabled}
      autoComplete={autoComplete}
      className={clsx(
        "w-full h-10 px-3 text-sm rounded-md border border-gray-300 transition-all",
        "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
    />
  );
}

export default Input;
