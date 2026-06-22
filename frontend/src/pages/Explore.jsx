import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import ActionButtons from "../components/ActionButtons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faEye,
  faHeart,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { ReelsGridSkeleton } from "../components/Skeletons";

const CATEGORIES = [
  "dsa",
  "database",
  "frontend",
  "backend",
  "react",
  "python",
  "javascript",
  "sql",
];

const Explore = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [reels, setReels] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedReel, setSelectedReel] = useState(null);

  // Fetch reels when activeCategory changes
  useEffect(() => {
    const fetchReels = async () => {
      setIsLoading(true);
      try {
        const token = sessionStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

        // Pass tag query if activeCategory is set
        const url = activeCategory
          ? `${apiUrl}/api/reels?tag=${activeCategory}`
          : `${apiUrl}/api/reels`;

        const res = await axios.get(url, { headers });
        setReels(res.data);
      } catch (error) {
        console.error("Error fetching reels:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReels();
  }, [activeCategory]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setActiveCategory(searchTerm.trim().toLowerCase());
    } else {
      setActiveCategory(""); // clear search
    }
  };

  const handleCategoryClick = (category) => {
    if (activeCategory === category) {
      setActiveCategory("");
      setSearchTerm("");
    } else {
      setActiveCategory(category);
      setSearchTerm(category);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative min-h-screen">
      {/* Header & Search */}
      <div className="flex flex-col items-center mb-12">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-linear-to-r from-orange-400 to-amber-500 mb-6 text-center"
        >
          Explore Topics
        </motion.h1>

        <motion.form
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSearch}
          className="w-full max-w-2xl relative"
        >
          <div className="relative flex items-center">
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-6 text-slate-400 text-lg"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search topics (e.g. dsa, database, frontend, backend...)"
              className="w-full pl-14 pr-32 py-4 bg-[#111111]/80 backdrop-blur-md border border-white/10 rounded-full text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all text-lg shadow-xl"
            />
            <button
              type="submit"
              className="absolute right-2 px-6 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black font-bold rounded-full transition-all cursor-pointer"
            >
              Search
            </button>
          </div>
        </motion.form>

        {/* Quick Categories */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mt-8 max-w-3xl"
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`px-5 py-2 rounded-full text-sm font-bold border transition-all cursor-pointer shadow-md
                ${
                  activeCategory === cat
                    ? "bg-orange-500/20 border-orange-500 text-orange-400 scale-105"
                    : "bg-[#111111]/50 border-white/5 text-slate-300 hover:border-white/20 hover:text-white"
                }`}
            >
              #{cat}
            </button>
          ))}
        </motion.div>
      </div>

      {/* Results Section */}
      <div className="mb-6 flex justify-between items-end">
        <h2 className="text-xl font-bold text-white border-l-4 border-orange-500 pl-3">
          {activeCategory
            ? `Results for "${activeCategory}"`
            : "Trending Reels"}
        </h2>
        <span className="text-slate-500 text-sm font-medium">
          {reels.length} found
        </span>
      </div>

      {isLoading ? (
        <ReelsGridSkeleton count={10} />
      ) : reels.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-[#111111]/50 backdrop-blur-sm border border-white/5 rounded-3xl p-16 text-center flex flex-col items-center"
        >
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
            <FontAwesomeIcon
              icon={faSearch}
              className="text-3xl text-slate-600"
            />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">No reels found</h3>
          <p className="text-slate-400 max-w-md">
            We couldn't find any content matching your search. Try a different
            topic or be the first to upload a reel for{" "}
            <span className="text-orange-400 font-semibold">
              #{activeCategory}
            </span>
            !
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6"
        >
          {reels.map((reel) => (
            <HoverVideoCard
              key={reel._id}
              reel={reel}
              onClick={() => setSelectedReel(reel)}
            />
          ))}
        </motion.div>
      )}

      {/* Full Screen Viewer Modal */}
      {selectedReel && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md md:p-4">
          <button
            onClick={() => setSelectedReel(null)}
            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all z-50 font-bold text-xl cursor-pointer"
          >
            &times;
          </button>
          <div className="relative w-full h-full md:h-auto md:max-w-[400px] md:aspect-[9/16] bg-[#050505] md:rounded-3xl overflow-hidden shadow-2xl md:border md:border-white/10">
            <video
              src={selectedReel.videoUrl}
              autoPlay
              loop
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 bg-black/60 px-3 py-1.5 rounded-full backdrop-blur-md text-white text-xs font-bold border border-white/10">
              @{selectedReel.creator}
            </div>
            <ActionButtons
              id={selectedReel._id}
              likes={selectedReel.likes}
              comments={selectedReel.comments}
              hasLiked={selectedReel.hasLiked}
              className="absolute right-4 bottom-20 z-20 scale-90 origin-bottom-right"
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Extracted Component for Hover-to-Play functionality
const HoverVideoCard = ({ reel, onClick }) => {
  const videoRef = useRef(null);

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.play().catch((e) => console.log("Play interrupted", e));
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -5 }}
      transition={{ duration: 0.2 }}
      className="group relative bg-black rounded-2xl overflow-hidden aspect-[9/16] shadow-lg border border-white/10 cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      <video
        ref={videoRef}
        src={reel.videoUrl}
        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
        muted
        loop
        playsInline
      />

      {/* Play Icon - disappears on hover */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:opacity-0 transition-opacity duration-300">
        <div className="w-12 h-12 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/10">
          <FontAwesomeIcon icon={faPlay} className="text-white ml-1 text-lg" />
        </div>
      </div>

      {/* Info Gradient */}
      <div className="absolute bottom-0 left-0 w-full p-4 pt-16 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none transition-transform duration-300 transform group-hover:translate-y-1">
        <p className="text-white text-sm font-bold line-clamp-2 mb-2 leading-tight">
          {reel.title}
        </p>

        <div className="flex items-center justify-between text-slate-300 text-[10px] font-bold mt-2">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <FontAwesomeIcon icon={faEye} className="text-slate-400" />
              <span>{reel.views || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <FontAwesomeIcon icon={faHeart} className="text-red-400" />
              <span>{reel.likes || 0}</span>
            </div>
          </div>
          <span className="text-orange-400">@{reel.creator}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default Explore;
