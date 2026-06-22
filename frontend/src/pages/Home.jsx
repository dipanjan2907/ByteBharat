import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faFire,
  faLightbulb,
  faLayerGroup,
  faPlay,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await axios.get("http://localhost:5000/api/auth/me", { headers });

        const { token: newToken, user: userData } = res.data;
        if (newToken) {
          sessionStorage.setItem("token", newToken);
        }
        if (userData) {
          sessionStorage.setItem("user", JSON.stringify(userData));
          setUser(userData);
        }
      } catch (err) {
        console.error("Fetch user error:", err);
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate]);

  const userName = user?.name || user?.username || "Learner";

  return (
    <div className="w-full max-w-7xl mx-auto px-6 sm:px-12 pb-12 flex flex-col items-center">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full mt-10 md:mt-20 mb-16 text-center md:text-left flex flex-col items-center md:items-start"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-bold mb-6 backdrop-blur-sm">
          Welcome back, {userName}
        </div>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 max-w-3xl drop-shadow-lg">
          What will you{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600">
            learn today?
          </span>
        </h1>
        <p className="text-lg text-slate-400 mt-6 max-w-2xl font-medium leading-relaxed">
          Dive into bite-sized knowledge. Pick up where you left off or discover
          something completely new to master today.
        </p>
      </motion.div>

      {/* Cards Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <DashboardCard
          icon={faChartLine}
          title="Continue Learning"
          description="Resume your journey in Advanced React Patterns."
          color="from-emerald-500 to-teal-400"
          glowColor="group-hover:bg-emerald-500/20"
          onClick={() => navigate("/feed")}
        />
        <DashboardCard
          icon={faFire}
          title="Trending Today"
          description="See what the ByteBharat community is watching."
          color="from-orange-500 to-amber-400"
          glowColor="group-hover:bg-orange-500/20"
          onClick={() => navigate("/feed")}
        />
        <DashboardCard
          icon={faUpload}
          title="Upload Reel"
          description="Share your knowledge in a 9:16 short-form video."
          color="from-blue-500 to-indigo-400"
          glowColor="group-hover:bg-blue-500/20"
          onClick={() => navigate("/upload")}
        />
        <DashboardCard
          icon={faLayerGroup}
          title="Quick Categories"
          description="Browse by topic: Frontend, Backend, AI, and more."
          color="from-purple-500 to-fuchsia-400"
          glowColor="group-hover:bg-purple-500/20"
          onClick={() => navigate("/explore")}
        />
      </motion.div>
    </div>
  );
};

const DashboardCard = ({
  icon,
  title,
  description,
  color,
  glowColor,
  onClick,
}) => {
  return (
    <motion.div
      variants={itemVariants}
      onClick={onClick}
      className="group relative p-8 rounded-3xl bg-[#0f0f0f]/80 border border-white/5 hover:border-white/10 hover:bg-[#151515]/90 transition-all duration-500 overflow-hidden backdrop-blur-xl flex flex-col items-start cursor-pointer hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/50"
    >
      {/* Background Hover Glow */}
      <div
        className={`absolute -top-10 -right-10 w-40 h-40 rounded-full blur-[80px] transition-colors duration-500 pointer-events-none bg-transparent ${glowColor}`}
      ></div>

      {/* Icon Container */}
      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500 relative z-10">
        <FontAwesomeIcon
          icon={icon}
          className={`text-xl text-transparent bg-clip-text bg-gradient-to-br ${color} drop-shadow-md`}
          style={{ color: "white" }} // Override text-transparent for FontAwesome fallback
        />
        <div
          className={`absolute inset-0 rounded-2xl opacity-20 bg-gradient-to-br ${color}`}
        ></div>
      </div>

      <h3 className="text-xl font-bold text-white mb-2 relative z-10">
        {title}
      </h3>
      <p className="text-sm text-slate-400 leading-relaxed font-medium relative z-10 flex-1">
        {description}
      </p>

      {/* Footer Action */}
      <div className="mt-6 flex items-center gap-2 text-xs font-bold text-slate-300 group-hover:text-white transition-colors relative z-10">
        Explore <FontAwesomeIcon icon={faPlay} className="text-[10px]" />
      </div>
    </motion.div>
  );
};

export default Home;
