import { Link } from "react-router";

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/" className="flex flex-col">
        <p className="text-lg font-semibold tracking-[0.18em] text-slate-100">
          HIRELENS
        </p>
        <p className="text-xs text-slate-400">Resume intelligence dashboard</p>
      </Link>
      <Link to="/upload" className="primary-button w-fit px-4 py-2 text-sm">
        New Review
      </Link>
    </nav>
  );
};

export default Navbar;
