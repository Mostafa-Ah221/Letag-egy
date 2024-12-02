
export default function InfoOrder() {
  return (
    <div className="summary-wrapper bg-white p-4">
      <h3 className="text-lg font-semibold mb-4">معلومات الطلب</h3>
      <div className="order-details mb-4">
        <div className="flex justify-between">
          <span>المجموع الفرعي</span>
          <span>EGP 13,555.00</span>
        </div>
        <div className="flex justify-between">
          <span>المجموع الكلي</span>
          <span>EGP 13,555.00</span>
        </div>
      </div>
      <hr className="my-4" />
      <button className="btn-primary w-full py-2 text-white bg-primary rounded">
        العودة إلى عربة التسوق
      </button>
    </div>
  );
}
