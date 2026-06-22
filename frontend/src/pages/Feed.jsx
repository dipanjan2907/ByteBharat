import React, { useState, useEffect } from "react";
import VideoCard from "../components/VideoCard";
import { Link, useLocation } from "react-router-dom";
import { FeedSkeleton } from "../components/Skeletons";

const Feed = () => {
  const location = useLocation();
  // Global mute state, initialized from user preferences
  const [isGlobalMuted, setIsGlobalMuted] = useState(() => {
    return localStorage.getItem("defaultMuted") === "true";
  });
  const [reels, setReels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReels = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await fetch("http://localhost:5000/api/reels", { headers });
        const data = await response.json();

        // Check if there is a reelId query parameter
        const searchParams = new URLSearchParams(location.search);
        const reelId = searchParams.get("reelId");

        let sortedReels = data;
        if (reelId) {
          const index = data.findIndex((r) => r._id === reelId);
          if (index !== -1) {
            const targetReel = data[index];
            const remaining = data.filter((r) => r._id !== reelId);
            sortedReels = [targetReel, ...remaining];
          }
        }

        setReels(sortedReels);
      } catch (error) {
        console.error("Error fetching reels:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReels();
  }, [location.search]);

  const toggleGlobalMute = () => {
    setIsGlobalMuted((prev) => !prev);
  };

  return (
    <div className="w-full h-full flex-1 overflow-hidden flex flex-col">
      {/* Feed Container */}
      <div className="w-full flex-1 overflow-y-scroll snap-y snap-mandatory scroll-smooth relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        {isLoading ? (
          <FeedSkeleton />
        ) : (
          reels.map((reel) => (
            <VideoCard
              key={reel._id}
              id={reel._id}
              videoSrc={reel.videoUrl}
              title={reel.title}
              username={reel.username || reel.creator || "Anonymous"}
              profilePic={reel.profilePic}
              likes={reel.likes}
              comments={reel.comments}
              isMuted={isGlobalMuted}
              toggleMute={toggleGlobalMute}
              tags={reel.tags}
              hasLiked={reel.hasLiked}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Feed;
