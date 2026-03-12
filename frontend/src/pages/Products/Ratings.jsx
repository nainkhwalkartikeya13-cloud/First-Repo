import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";

const Ratings = ({ value, text, color = "#212A2C" }) => {
  const fullStars = Math.floor(value || 0);
  const halfStars = (value || 0) - fullStars >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStars;

  return (
    <div className="flex items-center gap-px">
      {[...Array(fullStars)].map((_, index) => (
        <FaStar key={`full-${index}`} style={{ color }} size={14} />
      ))}

      {halfStars === 1 && <FaStarHalfAlt style={{ color }} size={14} />}

      {[...Array(emptyStars)].map((_, index) => (
        <FaRegStar key={`empty-${index}`} className="text-gray-300" size={14} />
      ))}

      {text && (
        <span className="text-[13px] text-[#767676] ml-2">
          {text}
        </span>
      )}
    </div>
  );
};

export default Ratings;
