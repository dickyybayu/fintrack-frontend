import { NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getCurrentUser } from '../api/auth';

function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    getCurrentUser()
      .then((res) => setUser(res.data))
      .catch((err) => console.error("Gagal ambil user:", err));
  }, []);

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center relative">
        <div className="text-xl font-bold tracking-wide">FinTrack</div>

        <div className="absolute left-1/2 transform -translate-x-1/2 space-x-6 text-sm md:text-base">
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? "text-white font-semibold underline" : "text-white hover:underline"}>Dashboard</NavLink>
          <NavLink to="/transactions" className={({ isActive }) => isActive ? "text-white font-semibold underline" : "text-white hover:underline"}>Transaksi</NavLink>
          <NavLink to="/wallets" className={({ isActive }) => isActive ? "text-white font-semibold underline" : "text-white hover:underline"}>Dompet</NavLink>
        </div>

        <div className="flex items-center space-x-4">
          <NavLink to="/profile" className="w-10 h-10 rounded-full overflow-hidden border-2 border-white">
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=0D8ABC&color=fff`}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </NavLink>

          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
            className="text-sm bg-white text-blue-600 font-semibold px-3 py-1 rounded hover:bg-gray-100 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
