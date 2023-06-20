import { BsStar, BsStarFill, BsStarHalf } from "react-icons/bs";
const StarRating = ({ rating, starSize }) => {
    const maxRating = 100;
    const maxStars = 5;
    const filledStars = Math.floor((rating / maxRating) * maxStars);
    const hasHalfStar = (rating / maxRating) * maxStars - filledStars >= 0.5;

    const remainingStars = maxStars - filledStars - (hasHalfStar ? 1 : 0);


    return (
        <div className="flex items-center">
            {Array.from({ length: filledStars }, (_, index) => (
                <BsStarFill size={starSize} key={index} className="text-yellow-500" />
            ))}
            {hasHalfStar && <BsStarHalf size={starSize} className="text-yellow-500" />}
            {remainingStars > 0 ? (Array.from({ length: remainingStars }, (_, index) => (
                <BsStar size={starSize} key={index + filledStars} className="text-gray-500" />
            ))
            ): null}
            
        </div>
    );
};
export default StarRating;