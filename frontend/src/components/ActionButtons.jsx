import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import {
  faHeart,
  faComment,
  faShare,
  faBookmark,
} from "@fortawesome/free-solid-svg-icons";

const ActionButtons = ({ id, likes = 0, comments = 0, hasLiked = false, className = "" }) => {
  const [liked, setLiked] = useState(hasLiked);
  const [saved, setSaved] = useState(false);
  const [likesCount, setLikesCount] = useState(likes);

  useEffect(() => {
    setLiked(hasLiked);
  }, [hasLiked]);

  // Sync likesCount if the likes prop changes
  useEffect(() => {
    setLikesCount(likes);
  }, [likes]);

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num;
  };

  const isRow = className.includes("flex-row");

  const handleLikeClick = async (e) => {
    e.stopPropagation();
    const newLikedStatus = !liked;
    setLiked(newLikedStatus);
    setLikesCount((prev) => prev + (newLikedStatus ? 1 : -1));

    const token = sessionStorage.getItem("token");
    if (token && id) {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      try {
        await axios.post(`${apiUrl}/api/reels/${id}/like`, {
          action: newLikedStatus ? "like" : "unlike"
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (err) {
        console.error("Failed to toggle like in database:", err);
        // Rollback on error
        setLiked(!newLikedStatus);
        setLikesCount((prev) => prev - (newLikedStatus ? 1 : -1));
      }
    }
  };

  return (
    <div className={`flex ${isRow ? "flex-row" : "flex-col"} items-center gap-4 ${className}`}>
      <button
        onClick={handleLikeClick}
        className="flex flex-col items-center justify-center gap-1 group cursor-pointer"
      >
        <div className="w-11 h-11 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center group-hover:bg-black/70 transition-all shadow-lg">
          <FontAwesomeIcon
            icon={faHeart}
            className={`text-xl transition-colors ${liked ? "text-red-500 scale-110" : "text-white"}`}
          />
        </div>
        <span className="text-white text-xs font-semibold drop-shadow-md">
          {formatNumber(likesCount)}
        </span>
      </button>

      <button
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col items-center justify-center gap-1 group cursor-pointer"
      >
        <div className="w-11 h-11 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center group-hover:bg-black/70 transition-all shadow-lg">
          <FontAwesomeIcon icon={faComment} className="text-white text-xl" />
        </div>
        <span className="text-white text-xs font-semibold drop-shadow-md">
          {formatNumber(comments)}
        </span>
      </button>

      <button
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col items-center justify-center gap-1 group cursor-pointer"
      >
        <div className="w-11 h-11 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center group-hover:bg-black/70 transition-all shadow-lg">
          <FontAwesomeIcon icon={faShare} className="text-white text-xl" />
        </div>
        <span className="text-white text-xs font-semibold drop-shadow-md">
          Share
        </span>
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          setSaved(!saved);
        }}
        className="flex flex-col items-center justify-center gap-1 group cursor-pointer"
      >
        <div className="w-11 h-11 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center group-hover:bg-black/70 transition-all shadow-lg">
          <FontAwesomeIcon
            icon={faBookmark}
            className={`text-xl transition-colors ${saved ? "text-orange-500 scale-110" : "text-white"}`}
          />
        </div>
      </button>
    </div>
  );
};

export default ActionButtons;
