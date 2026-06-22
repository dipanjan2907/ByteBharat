import React, { useState, useEffect, useRef } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import {
  faBell,
  faUser,
  faCog,
  faSignOutAlt,
  faFire,
  faInfoCircle,
  faHome,
  faPlay,
  faCompass,
  faTrash,
  faBellSlash,
} from "@fortawesome/free-solid-svg-icons";

const NAV_LINKS = [
  { path: "/home", label: "Home", icon: faHome },
  { path: "/feed", label: "Feed", icon: faPlay },
  { path: "/explore", label: "Explore", icon: faCompass },
];

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const notificationsRef = useRef(null);
  const [user, setUser] = useState(null);

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) return;
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await axios.get(`${apiUrl}/api/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(res.data);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  // Fetch on mount and set polling interval
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) return;

    fetchNotifications();

    const interval = setInterval(() => {
      fetchNotifications();
    }, 15000); // Poll every 15 seconds

    return () => clearInterval(interval);
  }, [location.pathname]);

  const handleDeleteNotification = async (id, e) => {
    e.stopPropagation();
    try {
      const token = sessionStorage.getItem("token");
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      await axios.delete(`${apiUrl}/api/notifications/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(prev => prev.filter(n => n._id !== id));
    } catch (err) {
      console.error("Failed to delete notification:", err);
    }
  };

  const handleClearAllNotifications = async (e) => {
    e.stopPropagation();
    try {
      const token = sessionStorage.getItem("token");
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      await axios.delete(`${apiUrl}/api/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications([]);
    } catch (err) {
      console.error("Failed to clear notifications:", err);
    }
  };

  // Load user from sessionStorage on mount/updates & enforce security
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const storedUser = sessionStorage.getItem("user");

    if (!token || !storedUser) {
      navigate("/login");
      return;
    }

    // Set cached user first
    try {
      setUser(JSON.parse(storedUser));
    } catch (e) {
      console.error(e);
    }

    // Fetch latest user details to sync streak count
    const fetchLatestUser = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
        const res = await axios.get(`${apiUrl}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const updatedUser = res.data.user;
        sessionStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
      } catch (err) {
        console.error("Token verification failed:", err);
        // If unauthorized (401), clear session and redirect
        if (err.response && err.response.status === 401) {
          sessionStorage.removeItem("token");
          sessionStorage.removeItem("user");
          navigate("/login");
        }
      }
    };

    fetchLatestUser();
  }, [location, navigate]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsDropdownOpen(false);
    setIsNotificationsOpen(false);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      await axios.post(`${apiUrl}/api/auth/logout`);
    } catch (err) {
      console.error("Logout error:", err);
    }
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    navigate("/");
  };

  const name = user?.name || "Learner";
  const username = user?.username || "learner";
  const email = user?.email || "learner@bytebharat.com";
  const avatarLetter = name.charAt(0).toUpperCase();

  const isFeedPage = location.pathname === "/feed";

  return (
    <div className={`bg-[#050505] text-slate-100 font-sans selection:bg-orange-500/30 relative flex flex-col ${
      isFeedPage ? "h-[100dvh] overflow-hidden w-full" : "min-h-[100dvh] overflow-x-hidden"
    }`}>
      {/* Background Floating Blobs */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-600/10 blur-[120px] rounded-full mix-blend-screen"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-amber-600/10 blur-[140px] rounded-full mix-blend-screen"></div>
      </div>

      {/* Floating Glass Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 px-4 sm:px-8 py-4 pointer-events-none">
        <div className="max-w-7xl mx-auto h-16 rounded-2xl bg-[#0a0a0a]/70 backdrop-blur-xl border border-white/5 shadow-2xl flex items-center justify-between px-4 sm:px-6 pointer-events-auto">
          {/* Left: Logo & Tagline */}
          <Link to="/home" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center shadow-lg shadow-orange-500/20 transition-transform duration-300 group-hover:scale-105">
              <span className="text-slate-950 font-black text-xl">B</span>
            </div>
            <div className="hidden sm:flex flex-col leading-none">
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
                ByteBharat
              </h1>
              <p className="text-[10px] text-slate-500 tracking-widest uppercase mt-0.5">
                Learn • Scroll • Grow
              </p>
            </div>
          </Link>

          {/* Center: Navigation Links */}
          <div className="hidden md:flex items-center gap-2 bg-white/5 rounded-full p-1.5 border border-white/5">
            {NAV_LINKS.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className="relative px-6 py-2 rounded-full text-sm font-semibold transition-colors duration-300 z-10"
                >
                  <span
                    className={`relative z-10 ${
                      isActive ? "text-white" : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {link.label}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 bg-white/10 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.05)] border border-white/10"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right: Actions & Profile */}
          <div className="flex items-center gap-3 sm:gap-5">
            {/* Streak Counter */}
            {user?.streakCount !== undefined && user.streakCount > 0 && (
              <div 
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.05)] select-none hover:scale-105 transition-all duration-300 cursor-help"
                title={`${user.streakCount} Day Learning Streak! Keep it active by visiting daily.`}
              >
                <FontAwesomeIcon icon={faFire} className="text-amber-500 animate-pulse drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                <span className="text-sm font-black tracking-tight">{user.streakCount}</span>
              </div>
            )}

            {/* Notifications Dropdown Container */}
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-colors group cursor-pointer focus:outline-none"
              >
                <FontAwesomeIcon icon={faBell} className="text-lg group-hover:rotate-12 transition-transform" />
                {notifications.length > 0 && (
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-orange-500 rounded-full border-2 border-[#0a0a0a] animate-pulse"></span>
                )}
              </button>

              <AnimatePresence>
                {isNotificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl bg-[#111111]/90 backdrop-blur-2xl border border-white/10 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.7)] overflow-hidden z-50"
                  >
                    <div className="p-4 border-b border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-white text-xs sm:text-sm">Notifications</h3>
                        {notifications.length > 0 && (
                          <span className="px-2 py-0.5 text-[10px] font-bold bg-orange-500 text-slate-950 rounded-full leading-none">
                            {notifications.length}
                          </span>
                        )}
                      </div>
                      {notifications.length > 0 && (
                        <button
                          onClick={handleClearAllNotifications}
                          className="text-xs text-orange-400 hover:text-orange-300 font-bold transition-colors cursor-pointer"
                        >
                          Clear All
                        </button>
                      )}
                    </div>

                    <div className="max-h-[300px] overflow-y-auto divide-y divide-white/5 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-track]:bg-transparent">
                      {notifications.length === 0 ? (
                        <div className="p-8 flex flex-col items-center justify-center text-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-slate-500">
                            <FontAwesomeIcon icon={faBellSlash} className="text-lg" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-300">All Caught Up!</p>
                            <p className="text-[10px] text-slate-500 mt-1">No new notifications at the moment.</p>
                          </div>
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif._id}
                            onClick={() => {
                              setIsNotificationsOpen(false);
                              if (notif.reel) {
                                navigate(`/feed?reelId=${notif.reel}`);
                              } else {
                                navigate("/feed");
                              }
                            }}
                            className="p-4 flex gap-3 hover:bg-white/5 transition-colors cursor-pointer group relative"
                          >
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500/20 to-amber-400/20 border border-orange-500/30 flex items-center justify-center text-orange-400 text-xs shrink-0 font-bold">
                              {notif.sender?.charAt(0).toUpperCase() || "N"}
                            </div>
                            <div className="flex-1 min-w-0 pr-6">
                              <p className="text-xs font-semibold text-slate-200 leading-normal break-words">
                                {notif.message}
                              </p>
                              <span className="text-[10px] text-slate-500 font-medium mt-1 inline-block">
                                {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <button
                              onClick={(e) => handleDeleteNotification(notif._id, e)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer"
                              title="Delete notification"
                            >
                              <FontAwesomeIcon icon={faTrash} className="text-xs" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Dropdown Container */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-10 h-10 rounded-full overflow-hidden border-2 border-transparent hover:border-orange-500/50 transition-colors shadow-lg cursor-pointer focus:outline-none"
              >
                <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-white font-bold">
                  {avatarLetter}
                </div>
              </button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute right-0 mt-3 w-64 rounded-2xl bg-[#111111]/90 backdrop-blur-2xl border border-white/10 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.7)] overflow-hidden z-50"
                  >
                    <div className="p-4 border-b border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center text-slate-950 font-bold text-xl shadow-inner">
                          {avatarLetter}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-white text-sm">{name}</span>
                          <span className="text-xs text-slate-400">@{username}</span>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-slate-500 truncate">
                        {email}
                      </div>
                    </div>

                    <div className="p-2 flex flex-col gap-1">
                      <Link to="/profile" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer">
                        <FontAwesomeIcon icon={faUser} className="w-4" />
                        Profile
                      </Link>
                      <Link to="/settings" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer">
                        <FontAwesomeIcon icon={faCog} className="w-4" />
                        Settings
                      </Link>
                      <Link to="/about" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer">
                        <FontAwesomeIcon icon={faInfoCircle} className="w-4" />
                        About Platform
                      </Link>
                    </div>

                    <div className="p-2 border-t border-white/5">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer"
                      >
                        <FontAwesomeIcon icon={faSignOutAlt} className="w-4" />
                        Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Container */}
      <main className={`relative z-10 flex-1 w-full flex flex-col ${
        isFeedPage ? "pt-24 pb-[72px] md:pb-0 overflow-hidden" : "pt-24 pb-[80px] md:pb-8"
      }`}>
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-[#050505]/95 backdrop-blur-xl border-t border-white/10 z-50 flex justify-around items-center px-2 py-3 pb-safe shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        {NAV_LINKS.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${isActive ? "text-orange-400 scale-110" : "text-slate-500 hover:text-slate-300"}`}
            >
              <FontAwesomeIcon icon={link.icon} className="text-xl" />
              <span className="text-[10px] font-bold tracking-wide">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Layout;
