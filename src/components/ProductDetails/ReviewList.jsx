import { FaStar } from "react-icons/fa6";

export default function ReviewList({ reviews, language }) {
  return reviews && reviews.length > 0 ? (
    <div className="h-80 overflow-auto">
      {reviews.map((review) => (
        <div key={review.id} className="p-4 bg-gray-50 rounded-md mb-2">
          <h4 className="font-semibold">{review.name}</h4>
          <p className="text-gray-600">{review.comment}</p>
          <ul className="rate flex gap-1 mt-1">
            {[...Array(5)].map((_, i) => (
              <li
                key={i}
                className={i < review.rating ? "text-orange-500" : "text-gray-300"}
              >
                <FaStar />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  ) : (
    <div className="text-center text-gray-500 mt-4 h-80">
      {language === "ar" ? "لا توجد تقييمات بعد" : "No reviews yet"}
    </div>
  );
}
