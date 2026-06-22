import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInfoCircle,
  faArrowLeft,
  faFire,
  faHeart,
  faPlay,
  faCompass,
  faLock,
  faChartBar,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const VERSION = "1.3.0";

const CHANGELOG = [
  {
    version: "1.3.0",
    date: "June 19, 2026",
    type: "minor",
    title: "Settings & Gesture Engine",
    description:
      "Introduced fully functional user settings, mobile navigation bar, and advanced swipe/hold gestures for clean-view video playback.",
    icon: faLock,
    color: "from-purple-500 to-indigo-500",
    features: [
      "User settings dashboard: Edit profile details (Name, Username, Email), change password securely, and toggle preferences.",
      "Mute Playback Preference: Save a preference (Default Video Muted) in local storage to automatically mute/unmute reels in the feed.",
      "Hold-to-Hide UI Gesture: Long-pressing on a video on mobile automatically pauses it and fades out overlays for a clean viewport, resuming play on release.",
      "Mobile Navigation Bar: Bottom fixed navigation bar to easily jump between Home, Feed, and Explore pages on smartphones.",
      "Danger Zone Actions: Allow users to permanently delete their account and associated reel uploads.",
    ],
  },
  {
    version: "1.2.0",
    date: "June 19, 2026",
    type: "major",
    title: "Categories & Streak Engine",
    description:
      "Introduced quick categories filtering for customized learning topics and a daily learning streak engine to motivate daily progress.",
    icon: faFire,
    color: "from-amber-500 to-orange-500",
    features: [
      "Quick Categories Search: Filter reels instantly by clicking presets like #dsa, #frontend, #react, or using the input search bar.",
      "Hover-to-Play Previews: Muted autoplay previews for reels on the Explore grid when hovered.",
      "Immersive Fullscreen Modal: Tap a reel in Explore to watch it in a 9:16 fullscreen container with controls.",
      "Daily Learning Streak: A gamified engine tracked by the backend to count consecutive active days, displayed via a glowing flame icon in the navbar.",
    ],
  },
  {
    version: "1.1.0",
    date: "June 18, 2026",
    type: "minor",
    title: "Interactive Engagement & Creator Analytics",
    description:
      "Added core interaction tracking so users can express appreciation and uploader accounts can see counts.",
    icon: faHeart,
    color: "from-red-500 to-pink-500",
    features: [
      "Stateful Likes: Users can like/unlike videos, saving the state across page refreshes and rewatches.",
      "View Count Tracking: Reels automatically count views when watched for a threshold period.",
      "Creator Dashboard: Uploaders see exactly how many views and likes their videos have garnered.",
    ],
  },
  {
    version: "1.0.0",
    date: "June 17, 2026",
    type: "major",
    title: "Initial Launch (ByteBharat)",
    description:
      "Launched ByteBharat as a premium short-form video learning platform.",
    icon: faPlay,
    color: "from-orange-500 to-orange-700",
    features: [
      "TikTok-style vertical scrolling feed with snap controls.",
      "Secure user authentication (registration/login/logout).",
      "Multiparts video upload with metadata (title, tags) stored locally.",
    ],
  },
];

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 relative min-h-screen text-slate-100 font-sans">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 cursor-pointer group"
      >
        <FontAwesomeIcon
          icon={faArrowLeft}
          className="group-hover:-translate-x-1 transition-transform"
        />
        Back
      </button>

      {/* Header */}
      <div className="flex flex-col items-center text-center mb-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center shadow-lg shadow-orange-500/20 mb-6"
        >
          <FontAwesomeIcon
            icon={faInfoCircle}
            className="text-slate-950 text-2xl"
          />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-black tracking-tight text-white mb-2"
        >
          About ByteBharat
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-orange-400 font-bold tracking-widest text-xs"
        >
          <span className=" uppercase">Current Version: </span>
          <span className="text-sm max-w-xl mt-4 tracking-wider leading-relaxed">
            v{VERSION}
          </span>
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-slate-400 text-sm max-w-xl mt-4 leading-relaxed"
        >
          ByteBharat is a micro-learning hub built to turn screen time into
          learning progress. By combining the engagement of short-form vertical
          video with developer-focused topics, we make acquiring technical
          skills fast, gamified, and effective.
        </motion.p>
      </div>

      {/* Version Details & Roadmap Timeline */}
      <div className="relative border-l-2 border-slate-800 ml-4 md:ml-8 pl-8 md:pl-12 flex flex-col gap-16">
        {CHANGELOG.map((log, idx) => (
          <motion.div
            key={log.version}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="relative"
          >
            {/* Timeline Dot with Icon */}
            <div
              className={`absolute -left-[53px] md:-left-[69px] top-1 w-10 h-10 rounded-xl bg-gradient-to-br ${log.color} border border-black flex items-center justify-center text-slate-950 shadow-md`}
            >
              <FontAwesomeIcon icon={log.icon} className="text-sm" />
            </div>

            {/* Header info */}
            <div className="flex flex-wrap items-baseline gap-3 mb-3">
              <span
                className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded border 
                ${
                  log.type === "major"
                    ? "bg-orange-500/10 border-orange-500/30 text-orange-400"
                    : "bg-slate-800 border-slate-700 text-slate-400"
                }`}
              >
                {log.type}
              </span>
              <h3 className="text-xl font-bold text-white">{log.title}</h3>
              <span className="text-xs text-slate-500 font-bold ml-auto">
                {log.date} (v{log.version})
              </span>
            </div>

            <p className="text-slate-400 text-sm mb-4 leading-relaxed">
              {log.description}
            </p>

            {/* Features list */}
            <div className="bg-[#111111]/40 border border-white/5 rounded-2xl p-5 shadow-inner">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Key Additions
              </h4>
              <ul className="flex flex-col gap-2.5">
                {log.features.map((feature, fIdx) => (
                  <li
                    key={fIdx}
                    className="text-sm text-slate-300 flex items-start gap-2.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 shrink-0"></span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer / Contact */}
      <div className="border-t border-slate-900 mt-20 pt-8 text-center text-xs font-semibold tracking-wider uppercase">
        <span className="text-slate-500">
          ByteBharat Learning Platform • Crafted with{" "}
          <span className="text-red-400">❤️</span> in{" "}
        </span>

        <span
          className="
    bg-gradient-to-r
    from-orange-400
    via-white
    to-green-400
    bg-clip-text
    text-transparent
    font-bold
    tracking-wide
    transition-all
    duration-300
    hover:brightness-110
    hover:drop-shadow-[0_0_8px_rgba(251,146,60,0.35)]
  "
        >
          Bharat
        </span>
      </div>
    </div>
  );
};

export default About;
