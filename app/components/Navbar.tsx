import { Link, useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";

const Navbar = () => {
  const navigate = useNavigate();
  const { auth } = usePuterStore();

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/auth");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="flex flex-col">
        <p className="text-lg font-semibold tracking-[0.18em] text-slate-100">
          HIRELENS
        </p>
        <p className="text-xs text-slate-400">Resume intelligence dashboard</p>
      </Link>
      <div className="flex items-center gap-3">
        {auth.isAuthenticated && (
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
          >
            Log out
          </button>
        )}
        <Link to="/upload" className="primary-button w-fit px-4 py-2 text-sm">
          New Review
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
