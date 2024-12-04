import { useState } from "react";
import { FaStar } from "react-icons/fa6";
import toast from "react-hot-toast";

export default function ReviewForm({ onSubmit, userData, language }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleRating = (value) => setRating(value);

  const handleSubmit = () => {
    if (!rating || !comment.trim() || (!userData && (!name.trim() || !email.trim()))) {
      toast.error(language === "ar" ? "يرجى إكمال جميع الحقول" : "Please complete all fields");
      return;
    }

    const reviewData = {
      rating,
      comment,
      name: userData?.name || name,
      email: userData?.email || email,
    };

    onSubmit(reviewData);
    setRating(0);
    setComment("");
    setName("");
    setEmail("");
  };

  return (
    <div>
      <h3 className="text-2xl font-semibold mb-4">{language === "ar" ? "أضف تقييمك" : "Add Your Review"}</h3>
      <div className="grid grid-cols-12 gap-3">
        <input
          type="text"
          placeholder={language === "ar" ? "الاسم" : "Name"}
          value={userData?.name || name}
          onChange={(e) => !userData && setName(e.target.value)}
          readOnly={!!userData}
          className="border w-full col-span-12 md:col-span-6 outline-none p-2"
        />
        <input
          type="email"
          placeholder={language === "ar" ? "البريد الإلكتروني" : "E-mail"}
          value={userData?.email || email}
          onChange={(e) => !userData && setEmail(e.target.value)}
          readOnly={!!userData}
          className="border w-full col-span-12 md:col-span-6 outline-none p-2"
        />
      </div>
      <textarea
        placeholder={language === "ar" ? "تعليق" : "Comment"}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="border w-full my-3 outline-none p-2"
      ></textarea>
      <ul className="rate flex gap-2 mb-5">
        {[1, 2, 3, 4, 5].map((star) => (
          <li key={star}>
            <FaStar
              onClick={() => handleRating(star)}
              className={`text-3xl cursor-pointer ${star <= rating ? "text-primary" : "text-slate-300"}`}
            />
          </li>
        ))}
      </ul>
      <button
        onClick={handleSubmit}
        className="bg-primary px-2 py-1 text-white mt-3 hover:bg-secondary"
      >
        {language === "ar" ? "أرسل تقييمك" : "Send Review"}
      </button>
    </div>
  );
}
