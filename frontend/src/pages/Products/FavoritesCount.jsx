import { useSelector } from "react-redux";

const FavoritesCount = () => {
  const favorites = useSelector((state) => state.favorites);
  const favoriteCount = favorites.length;

  return (
    <div className={`absolute -top-2 -right-2 `}>
      {favoriteCount > 0 && (
        <span className="w-5 h-5 flex items-center justify-center text-xs font-bold text-white bg-gray-900 dark:bg-indigo-500 rounded-full">
          {favoriteCount}
        </span>
      )}
    </div>
  );
};

export default FavoritesCount;
