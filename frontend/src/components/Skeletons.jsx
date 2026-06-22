import React from "react";

// 1. Feed Page Skeleton
export const FeedSkeleton = () => {
  return (
    <div className="relative w-full h-full flex justify-center items-center bg-[#050505] md:bg-transparent snap-start shrink-0 overflow-hidden md:py-6 md:px-4">
      <div className="flex items-stretch md:items-end justify-center gap-6 w-full h-full md:max-h-[calc(100vh-120px)] md:max-w-full">
        {/* Mock Video Card */}
        <div className="relative w-full h-full md:w-[400px] md:aspect-[9/16] bg-white/5 rounded-none md:rounded-[32px] border border-white/5 overflow-hidden flex-shrink-0 animate-pulse">
          {/* Top Mute Mock */}
          <div className="absolute top-6 right-4 w-10 h-10 rounded-full bg-white/10" />
          
          {/* Bottom Info Overlay Mock */}
          <div className="absolute bottom-0 left-0 w-full p-6 pr-20 pt-32 bg-gradient-to-t from-black/80 to-transparent flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10" />
              <div className="w-24 h-4 rounded-md bg-white/10" />
              <div className="w-16 h-7 rounded-full bg-white/10" />
            </div>
            <div className="w-3/4 h-4 rounded-md bg-white/10" />
            <div className="w-1/2 h-3 rounded-md bg-white/10" />
          </div>
          
          {/* Mobile Action Buttons Overlay Mock */}
          <div className="md:hidden absolute right-4 bottom-20 flex flex-col gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="w-11 h-11 rounded-full bg-white/10" />
                <div className="w-6 h-2 rounded bg-white/10" />
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Side Panels Mock */}
        <div className="hidden md:flex flex-col justify-end gap-6 h-full w-[320px] py-4">
          <div className="bg-[#111111]/80 border border-white/5 rounded-3xl p-5 flex flex-col gap-4 animate-pulse">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-white/10" />
                <div className="flex flex-col gap-2">
                  <div className="w-20 h-4 rounded bg-white/10" />
                  <div className="w-12 h-3 rounded bg-white/10" />
                </div>
              </div>
              <div className="w-16 h-7 rounded-full bg-white/10" />
            </div>
            <div className="border-t border-white/5 pt-4 flex flex-col gap-2">
              <div className="w-1/3 h-3 rounded bg-white/10" />
              <div className="w-full h-12 rounded bg-white/10" />
            </div>
          </div>
          
          <div className="bg-[#111111]/80 border border-white/5 rounded-3xl p-5 flex items-center justify-around h-24 animate-pulse">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-11 h-11 rounded-full bg-white/10" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// 2. Explore Page / Reels Grid Skeleton
export const ReelsGridSkeleton = ({ count = 10 }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
      {[...Array(count)].map((_, i) => (
        <div 
          key={i} 
          className="relative bg-white/5 border border-white/5 rounded-2xl aspect-[9/16] overflow-hidden animate-pulse flex flex-col justify-end p-4 gap-3 shadow-lg"
        >
          <div className="w-3/4 h-4 rounded bg-white/10" />
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-white/10" />
            <div className="w-16 h-3 rounded bg-white/10" />
          </div>
        </div>
      ))}
    </div>
  );
};

// 3. Profile Page Skeleton
export const ProfileSkeleton = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full py-8">
      {/* Profile Header Mock */}
      <div className="bg-[#111111]/80 border border-white/5 rounded-3xl p-8 mb-10 shadow-2xl flex flex-col sm:flex-row items-center sm:items-start gap-8 animate-pulse">
        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-white/10 shrink-0" />
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-3 w-full sm:w-auto">
          <div className="w-48 h-8 rounded-lg bg-white/10" />
          <div className="w-24 h-4 rounded bg-white/10" />
          <div className="w-36 h-4 rounded bg-white/10 mb-2" />
          <div className="w-12 h-6 rounded bg-white/10" />
        </div>
      </div>

      {/* Grid Mock */}
      <div className="w-28 h-6 rounded bg-white/5 border border-white/5 mb-6 animate-pulse" />
      <ReelsGridSkeleton count={5} />
    </div>
  );
};
