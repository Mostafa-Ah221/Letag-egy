import { Link } from 'react-router-dom';

export default function NavCart() {
  return (
    <nav className="bg-Neutral p-4 rounded">
      <ul className="flex space-x-4">
        <li><Link to="/cartlayout/" className="text-slate-800 hover:text-primary duration-200 ml-2">العنوان</Link></li>
        <li><Link to="/cartlayout/shipping" className="text-slate-800 hover:text-primary duration-200">الشحن</Link></li>
        <li><Link to="/cartlayout/payment" className="text-slate-800 hover:text-primary duration-200">الدفع</Link></li>
      </ul>
    </nav>
  );
}
