import React, { useRef, useState, useEffect } from "react";
import ActionButtons from "./ActionButtons";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faVolumeMute,
  faVolumeUp,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";

const VideoCard = ({
  id,
  videoSrc,
  title,
  username,
  profilePic,
  likes,
  comments,
  isMuted,
  toggleMute,
  tags = [],
  hasLiked = false,
}) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hideOverlays, setHideOverlays] = useState(false);
  const touchTimeoutRef = useRef(null);
  const longPressedRef = useRef(false);
  const wasPlayingRef = useRef(false);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hoverTime, setHoverTime] = useState(0);
  const [hoverX, setHoverX] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);
  const progressBarRef = useRef(null);
  const progressFillRef = useRef(null);
  const thumbRef = useRef(null);
  const wasPlayingOnDragStart = useRef(false);

  const isSeeking = isHovered || isDragging;

  const formatTime = (time) => {
    if (isNaN(time) || !isFinite(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleSeek = (clientX) => {
    if (!videoRef.current || !progressBarRef.current || !duration) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = clientX - rect.left;
    const width = rect.width;
    const percentage = Math.min(Math.max(clickX / width, 0), 1);
    const newTime = percentage * duration;
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
    setHoverTime(newTime);
    setHoverX(clickX);
    if (progressFillRef.current) {
      progressFillRef.current.style.transform = `scaleX(${percentage})`;
    }
    if (thumbRef.current) {
      thumbRef.current.style.left = `${percentage * 100}%`;
    }
  };

  const handleMouseDown = (e) => {
    e.stopPropagation();
    if (!duration) return;
    setIsDragging(true);
    setShowTooltip(true);
    if (videoRef.current) {
      wasPlayingOnDragStart.current = !videoRef.current.paused;
      videoRef.current.pause();
      setIsPlaying(false);
    }
    handleSeek(e.clientX);

    const handleMouseMove = (moveEvent) => {
      handleSeek(moveEvent.clientX);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setShowTooltip(false);
      if (videoRef.current && wasPlayingOnDragStart.current) {
        videoRef.current.play()
          .then(() => setIsPlaying(true))
          .catch((err) => console.log("Failed to resume playback after seek", err));
      }
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleTouchStartSeek = (e) => {
    e.stopPropagation();
    if (!duration) return;
    setIsDragging(true);
    setShowTooltip(true);
    if (videoRef.current) {
      wasPlayingOnDragStart.current = !videoRef.current.paused;
      videoRef.current.pause();
      setIsPlaying(false);
    }
    handleSeek(e.touches[0].clientX);

    const handleTouchMoveSeek = (moveEvent) => {
      handleSeek(moveEvent.touches[0].clientX);
    };

    const handleTouchEndSeek = () => {
      setIsDragging(false);
      setShowTooltip(false);
      if (videoRef.current && wasPlayingOnDragStart.current) {
        videoRef.current.play()
          .then(() => setIsPlaying(true))
          .catch((err) => console.log("Failed to resume playback after seek", err));
      }
      document.removeEventListener("touchmove", handleTouchMoveSeek);
      document.removeEventListener("touchend", handleTouchEndSeek);
    };

    document.addEventListener("touchmove", handleTouchMoveSeek);
    document.addEventListener("touchend", handleTouchEndSeek);
  };

  const handleProgressBarMouseMove = (e) => {
    if (!progressBarRef.current || !duration) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    const percentage = Math.min(Math.max(x / width, 0), 1);
    setHoverTime(percentage * duration);
    setHoverX(x);
  };

  useEffect(() => {
    let animationFrameId;

    const updateContinuousProgress = () => {
      if (videoRef.current && !isDragging) {
        const current = videoRef.current.currentTime;
        const dur = videoRef.current.duration || duration;
        if (dur) {
          const ratio = current / dur;
          if (progressFillRef.current) {
            progressFillRef.current.style.transform = `scaleX(${ratio})`;
          }
          if (thumbRef.current) {
            thumbRef.current.style.left = `${ratio * 100}%`;
          }
        }
      }
      if (isPlaying && !isDragging) {
        animationFrameId = requestAnimationFrame(updateContinuousProgress);
      }
    };

    if (isPlaying && !isDragging) {
      animationFrameId = requestAnimationFrame(updateContinuousProgress);
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isPlaying, isDragging, duration]);

  const handleTouchStart = () => {
    longPressedRef.current = false;
    if (videoRef.current) {
      wasPlayingRef.current = !videoRef.current.paused;
    }
    touchTimeoutRef.current = setTimeout(() => {
      setHideOverlays(true);
      longPressedRef.current = true;
      if (videoRef.current && !videoRef.current.paused) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }, 350); // 350ms hold to trigger clean view
  };

  const handleTouchEnd = () => {
    if (touchTimeoutRef.current) {
      clearTimeout(touchTimeoutRef.current);
    }
    setHideOverlays(false);
    if (longPressedRef.current) {
      if (videoRef.current && wasPlayingRef.current) {
        videoRef.current.play()
          .then(() => setIsPlaying(true))
          .catch((e) => console.log("Failed to resume playback", e));
      }
    }
  };

  const handleTouchMove = () => {
    // If the user scrolls, cancel the hold-to-hide gesture
    if (touchTimeoutRef.current) {
      clearTimeout(touchTimeoutRef.current);
    }
  };

  const onVideoPress = () => {
    if (longPressedRef.current) {
      longPressedRef.current = false;
      return; // Do not toggle play/pause when releasing a long press
    }
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleToggleMute = (e) => {
    e.stopPropagation();
    toggleMute();
  };

  const hasViewedRef = useRef(false);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.6,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          videoRef.current
            .play()
            .then(() => setIsPlaying(true))
            .catch((e) => console.log("Play failed", e));

          // Increment view count in database
          if (!hasViewedRef.current) {
            hasViewedRef.current = true;
            const token = sessionStorage.getItem("token");
            if (token && id) {
              const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
              axios.post(`${apiUrl}/api/reels/${id}/view`, {}, {
                headers: { Authorization: `Bearer ${token}` }
              }).catch((err) => {
                console.error("Failed to increment views:", err);
                hasViewedRef.current = false; // reset ref if it failed
              });
            }
          }
        } else {
          videoRef.current.pause();
          setIsPlaying(false);
        }
      });
    }, options);

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, [id]);

  return (
    <div className="relative w-full h-full flex justify-center items-center bg-[#050505] md:bg-transparent snap-start snap-always shrink-0 overflow-hidden md:py-6 md:px-4">
      {/* Outer row wrapper to hold Video Card and Side Panel side-by-side on desktop */}
      <div className="flex items-stretch md:items-end justify-center gap-6 w-full h-full md:max-h-[calc(100vh-120px)] md:max-w-full">
        
        {/* 1. Video Card with 9:16 Aspect Ratio on Desktop, Full Bleed on Mobile */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true, amount: 0.3 }}
          className="relative w-full h-full md:w-auto md:aspect-[9/16] bg-[#111111] overflow-hidden md:rounded-[32px] md:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] md:border md:border-white/5 shrink-0"
        >
          <video
            ref={videoRef}
            onClick={onVideoPress}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
            onTouchMove={handleTouchMove}
            onTimeUpdate={(e) => {
              if (!isDragging) {
                setCurrentTime(e.target.currentTime);
              }
              if (!duration && e.target.duration) {
                setDuration(e.target.duration);
              }
            }}
            onLoadedMetadata={(e) => {
              setDuration(e.target.duration);
            }}
            className="w-full h-full object-cover cursor-pointer animate-fade-in"
            loop
            muted={isMuted}
            src={videoSrc}
            playsInline
          ></video>

          {/* Play Icon Overlay (shows when paused) */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                className="w-20 h-20 bg-black/40 rounded-full flex items-center justify-center backdrop-blur-md shadow-2xl"
              >
                <FontAwesomeIcon
                  icon={faPlay}
                  className="text-white text-3xl ml-2 drop-shadow-md"
                />
              </motion.div>
            </div>
          )}

          {/* Top bar with Mute Button */}
          <div className={`absolute top-6 right-4 z-10 transition-opacity duration-300 ${hideOverlays ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
            <button
              onClick={handleToggleMute}
              className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-black/60 transition-all hover:scale-105 cursor-pointer shadow-lg"
            >
              <FontAwesomeIcon
                icon={isMuted ? faVolumeMute : faVolumeUp}
                className="text-white text-lg"
              />
            </button>
          </div>

          {/* MOBILE ONLY OVERLAYS (hidden on desktop / md screen size) */}
          <div className={`md:hidden transition-opacity duration-300 ${hideOverlays ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
            {/* Action Buttons Overlay */}
            <ActionButtons 
              id={id}
              likes={likes} 
              comments={comments} 
              hasLiked={hasLiked}
              className="absolute right-4 bottom-20 z-20" 
            />

            {/* Bottom Info Overlay */}
            <div className="absolute bottom-0 left-0 w-full p-4 pr-20 pb-6 pt-32 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none">
              <div className="flex items-center gap-3 mb-3 pointer-events-auto flex-wrap">
                {profilePic ? (
                  <img
                    src={profilePic}
                    alt={username}
                    className="w-10 h-10 rounded-full border-2 border-white/80 object-cover shadow-[0_0_15px_rgba(255,255,255,0.2)] shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center shadow-[0_0_15px_rgba(234,88,12,0.3)] shrink-0">
                    <FontAwesomeIcon
                      icon={faUserCircle}
                      className="text-white text-2xl"
                    />
                  </div>
                )}
                <h3 className="text-white font-extrabold text-sm drop-shadow-md tracking-wide truncate max-w-[120px]">
                  {username}
                </h3>
                <button className="px-4 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-white text-[11px] font-bold hover:bg-white hover:text-black hover:border-white transition-all shadow-md cursor-pointer tracking-wider uppercase shrink-0">
                  Follow
                </button>
              </div>
              <p className="text-white text-[15px] line-clamp-2 drop-shadow-lg pointer-events-auto leading-relaxed font-medium">
                {title}
              </p>
              {tags && tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2 pointer-events-auto">
                  {tags.map((tag, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-md bg-white/10 text-white text-[10px] font-bold">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Custom Duration Seek Bar */}
          <div
            ref={progressBarRef}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStartSeek}
            onMouseEnter={() => {
              setIsHovered(true);
              setShowTooltip(true);
            }}
            onMouseLeave={() => {
              setIsHovered(false);
              setShowTooltip(false);
            }}
            onMouseMove={handleProgressBarMouseMove}
            className={`absolute bottom-0 left-0 w-full z-30 cursor-pointer flex items-end select-none transition-all duration-200 ${
              hideOverlays ? "opacity-0 pointer-events-none" : "opacity-100"
            } ${isSeeking ? "h-5" : "h-2"}`}
            style={{ touchAction: "none" }}
          >
            {/* Track Background */}
            <div className={`w-full bg-white/20 transition-all duration-200 relative ${isSeeking ? "h-2" : "h-1"}`}>
              {/* Progress Fill */}
              <div
                ref={progressFillRef}
                className="w-full h-full bg-gradient-to-r from-orange-500 via-amber-500 to-orange-400 absolute top-0 left-0 rounded-r-full shadow-[0_0_8px_rgba(249,115,22,0.6)] origin-left"
                style={{ transform: `scaleX(${duration ? currentTime / duration : 0})` }}
              />
              {/* Thumb/Handle */}
              <div
                ref={thumbRef}
                className={`absolute top-1/2 w-3.5 h-3.5 rounded-full bg-white border-2 border-orange-500 shadow-md shadow-orange-500/50 transition-transform duration-200`}
                style={{
                  left: `${duration ? (currentTime / duration) * 100 : 0}%`,
                  transform: `translate(-50%, -50%) scale(${isSeeking ? 1 : 0})`
                }}
              />
            </div>

            {/* Time Tooltip */}
            {showTooltip && duration > 0 && (
              <div
                className="absolute bottom-6 bg-[#111111]/90 backdrop-blur-md text-white text-[11px] font-bold px-2 py-1 rounded-lg border border-white/10 shadow-xl pointer-events-none -translate-x-1/2 flex items-center gap-1.5"
                style={{ left: `${hoverX}px` }}
              >
                <span className="text-orange-400">{formatTime(hoverTime)}</span>
                <span className="text-white/40">/</span>
                <span className="text-white/80">{formatTime(duration)}</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* 2. DESKTOP ONLY SIDEBAR (hidden on mobile, flex-layout on md screens and up) */}
        <div className="hidden md:flex flex-col justify-end gap-6 h-full max-w-[320px] w-[320px] py-4">
          
          {/* Uploader Profile & Reel Info */}
          <div className="bg-[#111111]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-5 shadow-xl flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {profilePic ? (
                  <img
                    src={profilePic}
                    alt={username}
                    className="w-11 h-11 rounded-full border border-white/10 object-cover"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center shadow-lg">
                    <FontAwesomeIcon
                      icon={faUserCircle}
                      className="text-white text-2xl"
                    />
                  </div>
                )}
                <div className="flex flex-col">
                  <h4 className="text-white font-bold text-sm">@{username}</h4>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Creator</span>
                </div>
              </div>
              
              <button className="px-3.5 py-1.5 rounded-full border border-white/10 bg-white/5 text-white text-[10px] font-extrabold hover:bg-white hover:text-black hover:border-white transition-all shadow-md cursor-pointer tracking-wider uppercase">
                Follow
              </button>
            </div>

            <div className="border-t border-white/5 pt-4">
              <h5 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Description</h5>
              <p className="text-slate-200 text-sm leading-relaxed font-medium break-words max-h-36 overflow-y-auto pr-1 select-text scrollbar-thin">
                {title}
              </p>
              {tags && tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-white/5">
                  {tags.map((tag, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-orange-400 text-[10px] font-bold">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons Panel */}
          <div className="bg-[#111111]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-5 shadow-xl">
            <h5 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4 text-center">Interactions</h5>
            <ActionButtons 
              id={id}
              likes={likes} 
              comments={comments} 
              hasLiked={hasLiked}
              className="flex-row justify-around w-full" 
            />
          </div>

        </div>

      </div>
    </div>
  );
};

export default VideoCard;

