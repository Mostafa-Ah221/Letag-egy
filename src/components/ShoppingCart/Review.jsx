import { useOutletContext } from 'react-router-dom';

export default function Review() {
  const { handleReviewSubmit } = useOutletContext();

  return (
    <div className="p-4 bg-white shadow-md rounded">
      <h2 className="text-xl font-semibold mb-4">مراجعة</h2>
      <button className="btn-primary" onClick={handleReviewSubmit}>إرسال الطلب</button>
    </div>
  );
}
