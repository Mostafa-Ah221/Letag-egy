import { Link } from 'react-router-dom';

export default function NavCart() {
  return (
    <nav className="bg-Neutral p-4 rounded">
      <ul className=" space-x-4 flex justify-center">
        <li><Link to="/cartlayout/" className="text-slate-800 font-semibold hover:text-primary duration-200 text-2xl ">الدفع</Link></li>
        {/* <li><Link to="/cartlayout/payment" className="text-slate-800 hover:text-primary duration-200">الدفع</Link></li> */}
      </ul>
    </nav>
  );
}
