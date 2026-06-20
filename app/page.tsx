'use client';

import React, { useState } from 'react';
import { ThumbsUp, CheckCircle, Award, Camera, Info, ChevronDown, ChevronUp, User, LogOut, Edit2 } from 'lucide-react';

export default function GolfPlatform() {
  const [view, setView] = useState<'home' | 'community' | 'account'>('home');
  const [activeTab, setActiveTab] = useState<'nearMe' | 'topRated' | 'trending' | 'myCourses'>('nearMe');
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
  const [showGuideInsideModal, setShowGuideInsideModal] = useState(false);
  const [savedCourses, setSavedCourses] = useState<number[]>([]);

  // Auth & Profile States (Reset to logged out)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  
  const [userProfile, setUserProfile] = useState({
    username: 'New_User',
    email: '',
    phone: '',
    handicap: '',
    nicestCourse: '',
    avatarUrl: '' 
  });

  const [signUpForm, setSignUpForm] = useState({
    username: '', yearsPlayed: '', handicap: '', phone: '', password: '', email: '', nicestCourse: ''
  });

  // Course Database: Ratings reset to 0, trending status neutralized
  const [courses] = useState([
    { 
      id: 1, name: 'Rustic Canyon Golf Course', location: 'Moorpark, CA', rating: 0, trendingUp: false, distance: '34 mi', stimp: 0, fee: 95, 
      phone: '(805) 530-0221', website: 'https://www.rusticcanyongolfclub.org/', aeration: 'September 14, 2026',
      imageUrl: 'https://www.rusticcanyongolfclub.org/images/template/slideshow3.jpg',
      conditions: { teeBoxes: 0, fairways: 0, rough: 0, bunkers: 0 }
    },
    { 
      id: 2, name: 'Rancho Park Golf Course', location: 'Los Angeles, CA', rating: 0, trendingUp: false, distance: '4 mi', stimp: 0, fee: 48, 
      phone: '(310) 838-7373', website: 'https://www.golf.lacity.org', aeration: 'October 05, 2026',
      imageUrl: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?auto=format&fit=crop&w=800&q=80',
      conditions: { teeBoxes: 0, fairways: 0, rough: 0, bunkers: 0 }
    },
    { 
      id: 3, name: 'Angeles National Golf Club', location: 'Sunland, CA', rating: 0, trendingUp: false, distance: '18 mi', stimp: 0, fee: 165, 
      phone: '(818) 951-8771', website: 'https://www.angelesnational.com/', aeration: 'September 21, 2026',
      imageUrl: 'https://www.angelesnational.com/wp-content/uploads/sites/5946/2023/02/ANGELESNATIONAL-06.jpg?w=1024',
      conditions: { teeBoxes: 0, fairways: 0, rough: 0, bunkers: 0 }
    },
    { 
      id: 4, name: 'Simi Hills Golf Course', location: 'Simi Valley, CA', rating: 0, trendingUp: false, distance: '29 mi', stimp: 0, fee: 72, 
      phone: '(805) 522-0803', website: 'https://www.simihillsgolf.com/', aeration: 'September 28, 2026',
      imageUrl: 'https://www.simihillsgolf.com/images/slider2/showcase5.jpg',
      conditions: { teeBoxes: 0, fairways: 0, rough: 0, bunkers: 0 }
    },
    { 
      id: 5, name: 'Chester Washington Golf Course', location: 'Los Angeles, CA', rating: 0, trendingUp: false, distance: '11 mi', stimp: 0, fee: 42, 
      phone: '(323) 756-2516', website: 'https://www.chesterwashington.com/', aeration: 'October 12, 2026',
      imageUrl: 'https://www.chesterwashington.com/wp-content/uploads/sites/9/2021/10/CWGC-1074-1024x683.jpg',
      conditions: { teeBoxes: 0, fairways: 0, rough: 0, bunkers: 0 }
    }
  ]);

  // Wiped clean for launch
  const [communityReports, setCommunityReports] = useState<any[]>([]);
  const [individualReports] = useState<any[]>([]);

  const incrementReaction = (reportId: number, type: 'helpful' | 'accurate' | 'pristine') => {
    setCommunityReports(communityReports.map(report => report.id === reportId ? { ...report, reactions: { ...report.reactions, [type]: report.reactions[type] + 1 } } : report));
  };

  const getFilteredCourses = () => {
    let list = [...courses];
    if (activeTab === 'topRated') return list.sort((a, b) => b.rating - a.rating);
    if (activeTab === 'trending') return list.filter(c => c.trendingUp);
    if (activeTab === 'myCourses') return list.filter(c => savedCourses.includes(c.id));
    return list;
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditingProfile(false);
    alert('Profile updated securely.');
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans antialiased pb-24">
      
      {/* Header */}
      <header className="bg-neutral-900 text-white px-6 py-4 sticky top-0 z-40 border-b border-neutral-800 shadow-sm">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <span className="text-xs font-black tracking-widest text-neutral-100 uppercase cursor-pointer" onClick={() => setView('home')}>
            GOLFTRAC
          </span>
          {!isLoggedIn ? (
            <button onClick={() => setView('account')} className="text-[10px] font-bold uppercase tracking-wider border border-neutral-700 bg-neutral-800 px-3 py-1.5 rounded text-neutral-200">
              Sign Up / Sign In
            </button>
          ) : (
            <button onClick={() => setView('account')} className="text-[10px] font-bold uppercase tracking-wider border border-emerald-800 bg-emerald-900 px-3 py-1.5 rounded text-emerald-100 flex items-center space-x-1.5">
              <User size={12} /> <span>My Account</span>
            </button>
          )}
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-4">
        
        {/* VIEW 1: HOME DIRECTORY */}
        {view === 'home' && (
          <>
            <div className="flex space-x-1 overflow-x-auto border-b border-neutral-200 pb-1">
              {['Near Me', 'Top Rated', 'Trending', 'Saved'].map((label, idx) => {
                const keys = ['nearMe', 'topRated', 'trending', 'myCourses'];
                return (
                  <button
                    key={label}
                    onClick={() => setActiveTab(keys[idx] as any)}
                    className={`text-[10px] font-bold uppercase tracking-wider px-4 py-2.5 rounded transition-all ${
                      activeTab === keys[idx] ? 'bg-neutral-900 text-white' : 'bg-white border border-neutral-200 text-neutral-500'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            <section className="space-y-3">
              {getFilteredCourses().map((course) => (
                <div key={course.id} onClick={() => { setSelectedCourse(course); setShowGuideInsideModal(false); }} className="bg-white rounded-lg border border-neutral-200 overflow-hidden hover:border-neutral-400 transition-all cursor-pointer flex flex-col">
                  <div className="w-full h-36 bg-neutral-200 relative">
                    <img src={course.imageUrl} alt={course.name} className="w-full h-full object-cover filter brightness-[0.9]" />
                    <div className="absolute top-3 right-3 bg-neutral-900/80 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                      ${course.fee} Base
                    </div>
                  </div>
                  <div className="p-4 space-y-1">
                    <h3 className="font-extrabold text-sm text-neutral-900 tracking-tight">{course.name}</h3>
                    <p className="text-xs text-neutral-400 font-semibold">{course.location} • {course.distance}</p>
                    <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider pt-1">
                      Condition Score: <span className={course.rating === 0 ? "text-neutral-400 font-medium" : "text-neutral-900 font-black"}>
                        {course.rating === 0 ? 'Not yet rated' : `${course.rating} / 5.0`}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </section>
          </>
        )}

        {/* VIEW 2: COMMUNITY */}
        {view === 'community' && (
          <section className="space-y-4">
            <div className="bg-white p-4 rounded-lg border border-neutral-200 flex justify-between items-center">
              <div>
                <h2 className="font-black text-xs text-neutral-900 uppercase tracking-wider">Condition Monitoring Feed</h2>
                <p className="text-[11px] font-semibold text-neutral-400">Crowdsourced verification logs</p>
              </div>
              <button className="p-2 bg-neutral-50 border border-neutral-200 rounded text-neutral-700 flex items-center space-x-1 text-xs font-bold uppercase tracking-wider">
                <Camera size={13} /> <span>Upload</span>
              </button>
            </div>

            <div className="space-y-3">
              {communityReports.length === 0 ? (
                <div className="bg-white p-8 rounded-lg border border-neutral-200 text-center space-y-2">
                  <span className="text-2xl block text-neutral-300 mb-2">⛳</span>
                  <h3 className="font-bold text-neutral-700 uppercase tracking-wider text-sm">No Reports Yet</h3>
                  <p className="text-xs text-neutral-500">Be the first to upload a condition audit and photo for the community.</p>
                </div>
              ) : (
                communityReports.map((report) => (
                  <div key={report.id} className="bg-white p-4 rounded-lg border border-neutral-200 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-bold text-neutral-900 text-xs block">@{report.username}</span>
                        <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider mt-0.5 block">{report.courseName}</span>
                      </div>
                      <span className="text-[10px] text-neutral-400 font-medium">{report.timestamp}</span>
                    </div>
                    <p className="text-neutral-600 text-xs font-medium leading-relaxed">"{report.text}"</p>
                    {report.reviewPhoto && (
                      <div className="w-full h-40 bg-neutral-100 rounded overflow-hidden border border-neutral-200">
                        <img src={report.reviewPhoto} alt="Review attachment" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex items-center space-x-2 border-t border-neutral-100 pt-3">
                      <button onClick={() => incrementReaction(report.id, 'helpful')} className="flex items-center space-x-1 text-[11px] font-bold text-neutral-500 bg-neutral-50 border border-neutral-200 px-2.5 py-1 rounded">
                        <ThumbsUp size={11} /> <span>Helpful ({report.reactions.helpful})</span>
                      </button>
                      <button onClick={() => incrementReaction(report.id, 'accurate')} className="flex items-center space-x-1 text-[11px] font-bold text-neutral-500 bg-neutral-50 border border-neutral-200 px-2.5 py-1 rounded">
                        <CheckCircle size={11} /> <span>Accurate ({report.reactions.accurate})</span>
                      </button>
                      <button onClick={() => incrementReaction(report.id, 'pristine')} className="flex items-center space-x-1 text-[11px] font-bold text-neutral-500 bg-neutral-50 border border-neutral-200 px-2.5 py-1 rounded">
                        <Award size={11} /> <span>Pristine ({report.reactions.pristine})</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        )}

        {/* VIEW 3: ACCOUNT & AUTHENTICATION */}
        {view === 'account' && (
          <section className="space-y-4">
            {!isLoggedIn ? (
              <div className="bg-white rounded-lg p-6 border border-neutral-200 shadow-xs space-y-5">
                <div className="flex border-b border-neutral-100 pb-3">
                  <button onClick={() => setAuthMode('signin')} className={`flex-1 text-center pb-2 text-xs font-bold uppercase tracking-wider ${authMode === 'signin' ? 'text-emerald-800 border-b-2 border-emerald-800' : 'text-neutral-400'}`}>Sign In</button>
                  <button onClick={() => setAuthMode('signup')} className={`flex-1 text-center pb-2 text-xs font-bold uppercase tracking-wider ${authMode === 'signup' ? 'text-emerald-800 border-b-2 border-emerald-800' : 'text-neutral-400'}`}>Create Account</button>
                </div>
                
                {authMode === 'signup' ? (
                  <form onSubmit={(e) => { e.preventDefault(); setIsLoggedIn(true); }} className="space-y-4">
                    <input type="text" required placeholder="Username *" value={signUpForm.username} onChange={(e) => setSignUpForm({...signUpForm, username: e.target.value})} className="w-full bg-neutral-50 border border-neutral-200 rounded py-2 px-3 text-sm" />
                    <input type="email" required placeholder="Email Address *" value={signUpForm.email} onChange={(e) => setSignUpForm({...signUpForm, email: e.target.value})} className="w-full bg-neutral-50 border border-neutral-200 rounded py-2 px-3 text-sm" />
                    <input type="password" required placeholder="Password *" value={signUpForm.password} onChange={(e) => setSignUpForm({...signUpForm, password: e.target.value})} className="w-full bg-neutral-50 border border-neutral-200 rounded py-2 px-3 text-sm" />
                    <button type="submit" className="w-full bg-emerald-800 text-white font-bold py-3 px-4 rounded text-xs uppercase tracking-wider">Sign Up Securely</button>
                  </form>
                ) : (
                  <form onSubmit={(e) => { e.preventDefault(); setIsLoggedIn(true); }} className="space-y-4">
                    <input type="text" required placeholder="Username or Email" className="w-full bg-neutral-50 border border-neutral-200 rounded py-2 px-3 text-sm" />
                    <input type="password" required placeholder="Password" className="w-full bg-neutral-50 border border-neutral-200 rounded py-2 px-3 text-sm" />
                    <button type="submit" className="w-full bg-emerald-800 text-white font-bold py-3 px-4 rounded text-xs uppercase tracking-wider">Sign In</button>
                  </form>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg p-6 border border-neutral-200 shadow-xs space-y-6">
                <div className="flex flex-col items-center space-y-3">
                  <div className="w-24 h-24 rounded-full bg-neutral-100 border-4 border-white shadow-sm relative flex items-center justify-center">
                    {userProfile.avatarUrl ? (
                      <img src={userProfile.avatarUrl} alt="Profile" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <User size={40} className="text-neutral-300" />
                    )}
                    <button className="absolute bottom-0 right-0 bg-emerald-800 p-2 rounded-full text-white shadow-md hover:bg-emerald-700 transition-colors">
                      <Camera size={14} />
                    </button>
                  </div>
                  <div className="text-center">
                    <h2 className="text-lg font-black text-neutral-900">@{userProfile.username}</h2>
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Verified Auditor</p>
                  </div>
                </div>

                <form onSubmit={handleProfileSave} className="space-y-4 border-t border-neutral-100 pt-5">
                  <div className="flex justify-between items-center pb-2">
                    <span className="text-xs font-black uppercase tracking-wider text-neutral-800">Account Details</span>
                    <button type="button" onClick={() => setIsEditingProfile(!isEditingProfile)} className="text-[10px] flex items-center space-x-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                      <Edit2 size={10} /> <span>{isEditingProfile ? 'Cancel' : 'Edit'}</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-neutral-400">Email Address</label>
                      <input disabled={!isEditingProfile} type="email" value={userProfile.email} onChange={(e) => setUserProfile({...userProfile, email: e.target.value})} className="w-full bg-neutral-50 border border-neutral-200 rounded py-2 px-3 text-xs text-neutral-800 disabled:opacity-60" placeholder="Not set" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-bold uppercase text-neutral-400">Phone</label>
                        <input disabled={!isEditingProfile} type="tel" value={userProfile.phone} onChange={(e) => setUserProfile({...userProfile, phone: e.target.value})} className="w-full bg-neutral-50 border border-neutral-200 rounded py-2 px-3 text-xs text-neutral-800 disabled:opacity-60" placeholder="Not set" />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase text-neutral-400">Handicap</label>
                        <input disabled={!isEditingProfile} type="text" value={userProfile.handicap} onChange={(e) => setUserProfile({...userProfile, handicap: e.target.value})} className="w-full bg-neutral-50 border border-neutral-200 rounded py-2 px-3 text-xs text-neutral-800 disabled:opacity-60" placeholder="Not set" />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-neutral-400">Nicest Course Played</label>
                      <input disabled={!isEditingProfile} type="text" value={userProfile.nicestCourse} onChange={(e) => setUserProfile({...userProfile, nicestCourse: e.target.value})} className="w-full bg-neutral-50 border border-neutral-200 rounded py-2 px-3 text-xs text-neutral-800 disabled:opacity-60" placeholder="Not set" />
                    </div>
                  </div>

                  {isEditingProfile && (
                    <button type="submit" className="w-full bg-emerald-800 text-white font-bold py-3 rounded text-xs uppercase tracking-wider mt-4">Save Changes</button>
                  )}
                </form>

                <button onClick={() => setIsLoggedIn(false)} className="w-full border border-neutral-200 bg-neutral-50 text-neutral-600 font-bold py-3 rounded text-xs uppercase tracking-wider flex items-center justify-center space-x-2 hover:bg-neutral-100">
                  <LogOut size={14} /> <span>Sign Out</span>
                </button>
              </div>
            )}
          </section>
        )}
      </main>

      {/* DETAILED COURSE MODAL */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-neutral-950/60 flex items-end justify-center z-50" onClick={() => setSelectedCourse(null)}>
          <div className="bg-white rounded-t-2xl w-full max-w-md p-6 space-y-4 max-h-[85vh] overflow-y-auto border-t border-neutral-200 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start border-b border-neutral-100 pb-3">
              <div>
                <h2 className="text-sm font-black text-neutral-900 uppercase tracking-wider">{selectedCourse.name}</h2>
                <p className="text-xs font-semibold text-neutral-400">{selectedCourse.location}</p>
              </div>
              <button onClick={() => setSelectedCourse(null)} className="w-6 h-6 bg-neutral-100 font-bold rounded-full flex items-center justify-center text-neutral-400 text-xs">✕</button>
            </div>

            <img src={selectedCourse.imageUrl} alt={selectedCourse.name} className="w-full h-40 object-cover rounded-md border border-neutral-200" />

            <div className="grid grid-cols-2 gap-3 text-center text-xs">
              <div className="bg-neutral-50 rounded p-3 border border-neutral-200/60">
                <span className="text-[9px] font-bold uppercase text-neutral-400 block tracking-wider">Condition Index (Avg)</span>
                <span className={selectedCourse.rating === 0 ? "text-sm font-black text-neutral-400" : "text-sm font-black text-neutral-900"}>
                  {selectedCourse.rating === 0 ? 'N/A' : `${selectedCourse.rating} / 5.0`}
                </span>
              </div>
              <div className="bg-neutral-50 rounded p-3 border border-neutral-200/60">
                <span className="text-[9px] font-bold uppercase text-neutral-400 block tracking-wider">Velocity (Stimp)</span>
                <span className={selectedCourse.stimp === 0 ? "text-sm font-black text-neutral-400" : "text-sm font-black text-neutral-900"}>
                  {selectedCourse.stimp === 0 ? 'N/A' : selectedCourse.stimp}
                </span>
              </div>
            </div>

            <div className="border border-neutral-200 rounded-md overflow-hidden">
              <button onClick={() => setShowGuideInsideModal(!showGuideInsideModal)} className="w-full bg-neutral-50 px-4 py-2.5 flex justify-between items-center text-left text-xs font-bold text-neutral-700">
                <div className="flex items-center space-x-1.5"><Info size={13} className="text-neutral-500" /><span>Condition Assessment Guide</span></div>
                {showGuideInsideModal ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              {showGuideInsideModal && (
                <div className="p-4 bg-white border-t border-neutral-100 text-[11px] text-neutral-600 space-y-3 max-h-48 overflow-y-auto">
                  <p><strong>5 — PGA Tour Level:</strong> Flat tee boxes, cut fairways, uniform lush rough, smooth zero-wobble greens.</p>
                  <p><strong>4 — Country Club Premium:</strong> Clean uniform fairways, standard thick rough, minimal tee divots, highly consistent greens.</p>
                  <p><strong>3 — Average Public / Resort:</strong> Minor thin spots on fairway, packed sand beds, noticeable tee divots, standard green rolling.</p>
                  <p><strong>2 — Below Average:</strong> Hardpan fairway gaps, weed-heavy rough, muddy traps, uneven tee boxes, un-level bumpy greens.</p>
                  <p><strong>1 — Minimal Maintenance:</strong> Exposed dry fairways, raw dirt patches, shaggy heavily scarred greens.</p>
                </div>
              )}
            </div>

            {/* Cumulative Metric Breakdown Progress Bars */}
            <div className="bg-white rounded-lg border border-neutral-200 p-4 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block border-b pb-1">Cumulative Categories</span>
              {[
                { label: 'Tee Boxes', value: selectedCourse.conditions.teeBoxes },
                { label: 'Fairways', value: selectedCourse.conditions.fairways },
                { label: 'Rough', value: selectedCourse.conditions.rough },
                { label: 'Bunkers', value: selectedCourse.conditions.bunkers }
              ].map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold text-neutral-600">
                    <span>{item.label}</span>
                    <span className={item.value === 0 ? "text-neutral-400 font-medium" : "text-emerald-700 font-extrabold"}>
                      {item.value === 0 ? 'Unrated' : `${item.value} / 5.0`}
                    </span>
                  </div>
                  <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-700 h-full" style={{ width: `${(item.value / 5) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-lg border border-neutral-200 p-4 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block border-b pb-1">Individual Auditor Reports</span>
              <div className="space-y-3">
                {individualReports.filter(r => r.courseId === selectedCourse.id).length === 0 ? (
                  <p className="text-xs text-neutral-400 font-medium italic text-center py-2">No individual audit entries submitted yet.</p>
                ) : (
                  individualReports.filter(r => r.courseId === selectedCourse.id).map((report) => (
                    <div key={report.id} className="pt-3 first:pt-0 space-y-1 text-xs border-b border-neutral-50 pb-3 last:border-0">
                      <div className="flex justify-between items-center">
                        <span className="font-extrabold text-neutral-800">@{report.username} <span className="text-[9px] bg-neutral-100 text-neutral-500 font-bold px-1 rounded ml-1">HCP {report.handicap}</span></span>
                        <span className="text-[10px] text-neutral-400 font-medium">{report.date}</span>
                      </div>
                      <div className="flex space-x-2 text-[10px] font-bold text-neutral-500 uppercase tracking-wide py-0.5">
                        <span className="bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded">Stimp: {report.stimpGiven}</span>
                        <span className="bg-neutral-100 text-neutral-700 px-1.5 py-0.5 rounded">Score: {report.score}/5</span>
                      </div>
                      <p className="text-neutral-600 font-medium italic">"{report.text}"</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="border border-neutral-200 bg-neutral-50 p-3 rounded text-xs space-y-2">
              <div className="flex justify-between font-medium"><span className="text-neutral-400">Scheduled Aeration</span><span className="font-bold text-neutral-700 uppercase tracking-wide">{selectedCourse.aeration}</span></div>
              <div className="flex justify-between font-medium"><span className="text-neutral-400">Clubhouse Direct</span><a href={`tel:${selectedCourse.phone}`} className="font-bold text-emerald-800 underline">{selectedCourse.phone}</a></div>
              <div className="flex justify-between font-medium"><span className="text-neutral-400">Digital Gateway</span><a href={selectedCourse.website} target="_blank" rel="noreferrer" className="font-bold text-emerald-800 underline">Visit Web ↗</a></div>
            </div>
          </div>
        </div>
      )}

      {/* Persistent Bottom Tab Deck Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 py-4 z-40 shadow-xl">
        <div className="max-w-md mx-auto grid grid-cols-3 text-center text-[10px] font-bold uppercase tracking-wider">
          <button onClick={() => setView('home')} className={view === 'home' ? 'text-emerald-800' : 'text-neutral-400'}>Directory</button>
          <button onClick={() => setView('community')} className={view === 'community' ? 'text-emerald-800' : 'text-neutral-400'}>Community</button>
          <button onClick={() => setView('account')} className={view === 'account' ? 'text-emerald-800' : 'text-neutral-400'}>Account</button>
        </div>
      </nav>
    </div>
  );
}