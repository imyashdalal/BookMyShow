import { useEffect, useRef, useState, useCallback } from 'react';
import { useLoggedInUser } from '../../hooks/auth.hooks';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setLocation, setCustomeLocation } from '../../store/slices/locationSlice';
import { clearAuthData } from '../../utils/secureStorage';

const Navbar = () => {
  const { data: user, isLoading } = useLoggedInUser();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const location = useSelector((state) => state.location);
  const [city, setCity] = useState(null);
  const searchCity = useRef("");

  const fetchLocation = useCallback(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude;
      const long = position.coords.longitude;
      fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${long}`
      )
        .then((res) => res.json())
        .then((data) => {
          if (data) {
            setCity(data.address.city);
            dispatch(setLocation({ location: data.address.city }));
          } else {
            console.error("Error fetching location:", data);
          }
        })
        .catch((err) => {
          console.error("Error fetching location:", err);
        });
    });
  }, [dispatch]);

  useEffect(() => {
    if (!location.custome) {
      fetchLocation();
    }
  }, [location.custome, fetchLocation]);

  useEffect(() => {
    if (user) {
      setIsLoggedOut(true);
    }
  }, [isLoading, user]);

  const handleSignIN = () => {
    navigate('/sign-in');
  };

  const toHome = () => {
    navigate('/');
  };

  const toExplore = () => {
    navigate('/explore');
  };

  const handleLogOut = () => {
    clearAuthData();
    setIsLoggedOut(true);
    navigate('/');
    window.location.reload();
  };

  const handleLocation = () => {
    if(!location.custome) return;
    fetchLocation();
  }

  const handleCustomLocation = (city) => {
    dispatch(setCustomeLocation({location: city}));
    setCity(city);
  }

  return (
    <div className="navbar bg-black/80 shadow-md sticky top-0 z-50 text-white backdrop-blur">
      <div className="navbar-start">
        {/* Mobile Menu Dropdown */}
        <div className="dropdown lg:hidden">
          <div tabIndex={0} role="button" className="btn btn-ghost">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-neutral rounded-box z-1 mt-3 w-52 p-2 shadow">
            <li><a onClick={toHome}>Home</a></li>
            <li><a onClick={toExplore}>Explore</a></li>
            <li><a>About</a></li>
          </ul>
        </div>

        {/* Logo */}
        <a className="btn btn-ghost text-xl font-extrabold tracking-wide text-[#00eaff] drop-shadow-[0_0_6px_#00eaff]" onClick={toHome}>
          CineBook
        </a>
      </div>

      {/* Desktop Menu */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 text-white">
          <li><a className="hover:text-[#ff3cac]" onClick={toHome}>Home</a></li>
          <li><a className="hover:text-[#ff3cac]" onClick={toExplore}>Explore</a></li>
          <li><a className="hover:text-[#ff3cac]">About</a></li>
        </ul>
      </div>

      {/* End Section */}
      <div className="navbar-end gap-2">
        {/* Location Dropdown */}
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-sm text-white">{city || location.location || 'Select City'}</span>
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content menu bg-neutral rounded-box z-1 w-52 p-2 shadow">
            <li>
              <div className="form-control">
                <label className="input-group input-group-sm">
                  <input
                    type="text"
                    placeholder="Search city"
                    className="input input-bordered input-sm w-full"
                    onChange={(e) => searchCity.current = e.target.value}
                    onKeyDown={(e) => e.key === 'Enter' && handleCustomLocation(searchCity.current)}
                  />
                  <button
                    className="btn btn-sm btn-square"
                    onClick={() => handleCustomLocation(searchCity.current)}>
                    →
                  </button>
                </label>
              </div>
            </li>
            <li>
              <a onClick={handleLocation}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 11c0 1.105-.895 2-2 2s-2-.895-2-2 .895-2 2-2 2 .895 2 2zm0-7v.01M12 12v6m0 0l-3-3m3 3l3-3" />
                </svg>
                Use Current Location
              </a>
            </li>
          </ul>
        </div>

        {/* User Menu or Sign In */}
        {isLoggedOut ? (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img
                  alt="User avatar"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-neutral rounded-box z-1 mt-3 w-52 p-2 shadow">
              <li>
                <a className="justify-between">
                  Profile
                  <span className="badge">New</span>
                </a>
              </li>
              <li><a onClick={() => navigate('/userDashboard')}>My Bookings</a></li>
              <li><a>Settings</a></li>
              <li><a onClick={handleLogOut}>Logout</a></li>
            </ul>
          </div>
        ) : (
          <button
            className="btn bg-[#ff3cac] text-white border-none hover:bg-[#00eaff] hover:text-[#232946] transition-all"
            onClick={handleSignIN}>
            Sign In
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
