'use client';

import React, { useState } from 'react';

export default function GolfCourseTracker() {
  const [showGuide, setShowGuide] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  const [courseData] = useState({
    name: "Pelican Hill Golf Club (Ocean South)",
    phone: "(949) 467-6800",
    website: "https://www.pelicanhill.com",
    baseGreenFee: 315,
    cartFee: 0,
    aerationDate: "October 12, 2026",
    stimp: 11.2,
    conditions: {
      teeBoxes: 4.5,
      fairways: 4.7,
      rough: 3.8,
      bunkers: 4.2
    },
    lastUpdated: "2 hours ago"
  });

  const [recentReviews] = useState([
    {
      id: 1,
      username: "Garrett_G96",
      handicap: 2.4,
      experience: "12 years",
      nicestCourse: "Pebble Beach Golf Links",
      frequency: "2-3 times a week",
      date: "Today, 10:30 AM",
      stimpGiven: 11.5,
      avgConditionGiven: 4.8,
      comment: "Greens are pure right now, rolling true to the line. Fairways are immaculate."
    },
    {
      id: 2,
      username: "MuniManiac",
      handicap: 22.1,
      experience: "1 year",
      nicestCourse: "Griffith Park (Wilson)",
      frequency: "1-2 times a month",
      date: "Yesterday",
      stimpGiven: 9.0,
      avgConditionGiven: 5.0,
      comment: "Nicest grass I have ever seen! Unbelievable course, everything looked perfect to me."
    }
  ]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased pb-12 relative">
      
      {/* Mobile Top Header Banner */}
      <header className="bg-emerald-800 text-white px-4 py-6 shadow-md sticky top-0 z-40">
        <div className="max-w-md mx-auto">
          <span className="text-xs font-bold tracking-wider uppercase bg-emerald-700 px-2.5 py-1 rounded-full text-emerald-100">Live Conditions</span>
          <h1 className="text-xl font-black mt-1 tracking-tight">{courseData.name}</h1>
        </div>
      </header>

      {/* Main Mobile Viewport Container */}
      <main className="max-w-md mx-auto p-4 space-y-4">
        
        {/* Aeration Alert */}
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl shadow-sm">
          <p className="text-xs font-semibold text-amber-800 uppercase tracking-wider">Upcoming Maintenance</p>
          <p className="text-sm font-medium text-amber-700 mt-0.5">
            Scheduled Aerification: <span className="font-bold">{courseData.aerationDate}</span>
          </p>
        </div>

        {/* Top Summary Blocks */}
        <section className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 grid grid-cols-2 gap-4">
          <div className="bg-emerald-50 rounded-xl p-4 text-center border border-emerald-100/50">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 block">Green Speed</span>
            <span className="text-3xl font-extrabold text-emerald-900 my-1">{courseData.stimp}</span>
            <span className="text-[10px] font-semibold text-emerald-700/80 bg-white px-2 py-0.5 rounded-full inline-block shadow-2xs">Avg Stimpmeter</span>
          </div>
          
          <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-100/50">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-800 block">Weekend Fee</span>
            <span className="text-3xl font-extrabold text-blue-900 my-1">${courseData.baseGreenFee}</span>
            <span className="text-[10px] font-semibold text-blue-700/80 bg-white px-2 py-0.5 rounded-full inline-block shadow-2xs">Id/Cart Included</span>
          </div>
        </section>

        {/* Full Interactive Rating Guide */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <button 
            onClick={() => setShowGuide(!showGuide)}
            className="w-full px-5 py-4 flex justify-between items-center bg-slate-100/60 hover:bg-slate-100 transition-colors"
          >
            <div className="flex items-center space-x-2">
              <span className="text-base">ℹ️</span>
              <span className="font-bold text-sm text-slate-700">How to rate the conditions?</span>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-white border border-slate-200 px-2.5 py-1 rounded-lg shadow-3xs">
              {showGuide ? 'Hide Guide ▲' : 'Show Guide ▼'}
            </span>
          </button>

          {showGuide && (
            <div className="p-5 border-t border-slate-100 bg-white space-y-5 text-xs text-slate-600 max-h-[450px] overflow-y-auto">
              <div>
                <h4 className="font-extrabold text-slate-800 uppercase tracking-wider border-b pb-1 mb-2.5 text-[11px] text-emerald-800">
                  General Conditions (Tees, Fairways, Rough, Bunkers, Trueness)
                </h4>
                <ul className="space-y-3.5">
                  <li>
                    <strong className="text-slate-800 font-black block text-sm border-l-2 border-emerald-600 pl-1.5 mb-1 text-emerald-900">5 — PGA Tour Level</strong> 
                    Tight and cut fairways. Lush uniform rough with absolutely no bare patches. Optimal bunker sand consistency with no big rocks or wet mud. All tee boxes flat and perfectly level with clean cut grass and no open divots. Greens roll immaculately smooth and true with zero wobble or bouncing.
                  </li>
                  <li>
                    <strong className="text-slate-800 font-black block text-sm border-l-2 border-emerald-400 pl-1.5 mb-1 text-slate-800">4 — Country Club Premium</strong> 
                    Clean, well-defined fairways with minimal overall wear. Consistently thick and cut rough. Bunkers are properly maintained and raked with good soft sand. Tee boxes are completely flat and mostly clear of severe divot damage. Greens roll highly consistent and true with minor cosmetic blemishes.
                  </li>
                  <li>
                    <strong className="text-slate-800 font-black block text-sm border-l-2 border-amber-400 pl-1.5 mb-1 text-slate-800">3 — Average Public / Resort</strong> 
                    Fairways show normal weekend wear, featuring typical light brown or thin patches. Rough is patchy in a few areas but completely playable. Bunkers might be firmly packed down or a bit crusty. Tee boxes have noticeable divots but offer plenty of level hitting areas. Greens roll okay but might bounce slightly offline.
                  </li>
                  <li>
                    <strong className="text-slate-800 font-black block text-sm border-l-2 border-orange-400 pl-1.5 mb-1 text-slate-800">2 — Below Average</strong> 
                    Fairways are rough around the edges with scattered hardpan or bare dirt patches. Rough has significant weed clusters or completely barren zones. Bunkers are unraked, rocky, or muddy. Tee boxes are uneven or heavily chewed up. Greens are bumpy, scarred, or showing signs of high stress.
                  </li>
                  <li>
                    <strong className="text-slate-800 font-black block text-sm border-l-2 border-red-500 pl-1.5 mb-1 text-red-950">1 — Minimal Maintenance Muni</strong> 
                    Fairways overgrown and contain multiple dry patches. Inconsistent rough with bare patches and dry spots. Hard sand with rocks, mud, or hard pan. Very little to no tee boxes that are flat and level, featuring overgrown grass and lots of unfilled divots. Greens are shaggy, bumpy, or scarred.
                  </li>
                </ul>
              </div>

              <div className="pt-3 border-t border-dashed border-slate-200">
                <h4 className="font-extrabold text-slate-800 uppercase tracking-wider border-b pb-1 mb-2 text-[11px] text-blue-800">
                  Green Speed Scale (Stimpmeter)
                </h4>
                <ul className="space-y-1.5 font-medium">
                  <li className="flex justify-between items-center"><span className="font-bold text-slate-700">⚡ 13 – 15</span> <span className="text-slate-500">Major Championship / US Open Speed</span></li>
                  <li className="flex justify-between items-center"><span className="font-bold text-slate-700">⛳ 11 – 12</span> <span className="text-slate-500">PGA Tour Speed</span></li>
                  <li className="flex justify-between items-center"><span className="font-bold text-slate-700">🏌️‍♂️ 9 – 10</span> <span className="text-slate-500">Standard Public Course Speed</span></li>
                  <li className="flex justify-between items-center"><span className="font-bold text-slate-700">🐌 8 & Below</span> <span className="text-slate-500">Slow Muni Speed</span></li>
                </ul>
              </div>
            </div>
          )}
        </section>

        {/* Course Conditions Section */}
        <section className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
            <h2 className="font-bold text-base text-slate-800">Course Conditions</h2>
            <span className="text-[11px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">Updated {courseData.lastUpdated}</span>
          </div>

          <div className="space-y-3.5">
            {[
              { label: "Tee Boxes", value: courseData.conditions.teeBoxes },
              { label: "Fairways", value: courseData.conditions.fairways },
              { label: "Rough", value: courseData.conditions.rough },
              { label: "Bunkers", value: courseData.conditions.bunkers }
            ].map((item, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-600">
                  <span>{item.label}</span>
                  <span className="text-emerald-700 font-extrabold">{item.value} / 5.0</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${(item.value / 5) * 100}%` }}/>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Live Reports */}
        <section className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-3">
          <h2 className="font-bold text-base text-slate-800 border-b border-slate-100 pb-2">Recent Live Reports</h2>
          
          <div className="space-y-3 divide-y divide-slate-100">
            {recentReviews.map((review) => (
              <div key={review.id} className="pt-3 first:pt-0 space-y-1.5">
                <div className="flex justify-between items-center">
                  <button 
                    onClick={() => setSelectedUser(review)}
                    className="text-sm font-bold text-emerald-800 hover:underline flex items-center space-x-1"
                  >
                    <span>👤 {review.username}</span>
                    <span className="text-[10px] bg-slate-100 font-medium text-slate-500 px-1.5 py-0.5 rounded-md ml-1">
                      HCP: {review.handicap}
                    </span>
                  </button>
                  <span className="text-[11px] text-slate-400">{review.date}</span>
                </div>
                
                <div className="flex space-x-2 text-[11px]">
                  <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-medium">Stimp: {review.stimpGiven}</span>
                  <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">Conditions: {review.avgConditionGiven}/5</span>
                </div>
                
                <p className="text-xs text-slate-600 italic">"{review.comment}"</p>
              </div>
            ))}
          </div>
        </section>

        {/* Directory Logistics Card */}
        <section className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-3">
          <h2 className="font-bold text-base text-slate-800 border-b border-slate-100 pb-2">Course Information</h2>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-500 font-medium">Phone</span>
            <a href={`tel:${courseData.phone}`} className="text-emerald-700 font-bold">{courseData.phone}</a>
          </div>
        </section>

      </main>

      {/* Dynamic Pop-Up Modal: Golfer Profile Insights */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl space-y-4">
            <div className="flex justify-between items-start border-b border-slate-100 pb-2">
              <div>
                <h3 className="text-base font-black text-slate-900">@{selectedUser.username}</h3>
                <p className="text-xs text-emerald-700 font-bold">Verified Golfer Profile</p>
              </div>
              <button 
                onClick={() => setSelectedUser(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm bg-slate-100 w-6 h-6 rounded-full flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Course Handicap</span>
                <span className="text-lg font-black text-slate-800">{selectedUser.handicap}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Years Playing</span>
                <span className="text-lg font-black text-slate-800">{selectedUser.experience}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Play Frequency</span>
                <span className="text-sm font-bold text-slate-800 mt-1 block">{selectedUser.frequency}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Nicest Track Played</span>
                <span className="text-xs font-bold text-emerald-800 mt-1 block truncate">{selectedUser.nicestCourse}</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 text-center italic">
              *Trust ratings from golfers matching your target skill benchmark.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
