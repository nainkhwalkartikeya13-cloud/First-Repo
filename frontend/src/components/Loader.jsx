const Loader = ({ size = "md", text = "" }) => {
  const sizes = {
    sm: "h-6 w-6 border-2",
    md: "h-12 w-12 border-4",
    lg: "h-16 w-16 border-4",
  };
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`animate-spin rounded-full ${sizes[size]} border-gray-200 dark:border-gray-700 border-t-gray-900 dark:border-t-indigo-400`} />
      {text && <p className="text-sm text-gray-400 dark:text-gray-500 font-medium animate-pulse">{text}</p>}
    </div>
  );
};

export default Loader;
