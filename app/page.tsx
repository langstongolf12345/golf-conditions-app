'use client';

import React, { useState, useEffect } from 'react';
import { Camera, Info, ChevronDown, ChevronUp, User, LogOut, Edit2, Send, Plus, Star, Image as ImageIcon, Heart } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function GolfPlatform() {
  const [view, setView] = useState<'home' | 'community' | 'account'>('home');
  const [activeTab, setActiveTab] = useState<'nearMe' | 'topRated' | 'trending' | 'myCourses'>('nearMe');
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  
  // Accordion States
  const [showGuideInsideModal, setShowGuideInsideModal] = useState(false);
  const [showGuideInsideRateModal, setShowGuideInsideRateModal] = useState(false);
  const [showRateModal, setShowRateModal] = useState(false);

  // Auth & Profile States
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [savedCourses, setSavedCourses] = useState<number[]>([]);
  
  const [userProfile, setUserProfile] = useState({
    username: '', email: '', phone: '', handicap: '', nicestCourse: '', avatarUrl: '',
    ratingsCount: 0, highestRating: 'N/A', lowestRating: 'N/A'
  });

  const [signUpForm, setSignUpForm] = useState({
    username: '', yearsPlayed: '', handicap: '', phone: '', password: '', email: '', nicestCourse: ''
  });
  const [signInForm, setSignInForm] = useState({ email: '', password: '' });
  const [resetEmail, setResetEmail] = useState('');

  // Rating Form State
  const [ratingForm, setRatingForm] = useState({
    courseId: 1, date: '', stimp: 10, teeBoxes: 3.0, fairways: 3.0, rough: 3.0, bunkers: 3.0, notes: ''
  });

  // Live Chat State
  const [chatMessage, setChatMessage] = useState('');
  const [chatImage, setChatImage] = useState<string | null>(null);
  const [chatCooldown, setChatCooldown] = useState(0);
  
  // Persistent Data States (Defaults)
  const [chatFeed, setChatFeed] = useState([
    { id: 1, username: 'GolfTrac_System', text: 'Welcome to the live SoCal conditions chat! Anyone playing today?', timestamp: 'Just now', isSystem: true, image: null }
  ]);
  const [individualReports, setIndividualReports] = useState<any[]>([]);
  
  const [courses, setCourses] = useState([
    { 
      id: 1, name: 'Rustic Canyon Golf Course', location: 'Moorpark, CA', rating: 0, trendingUp: false, distance: '34 mi', stimp: 0, fee: 95, 
      phone: '(805) 530-0221', website: 'https://www.rusticcanyongolfclub.org/', aeration: 'September 14, 2026',
      imageUrl: 'https://www.rusticcanyongolfclub.org/images/template/slideshow3.jpg',
      conditions: { teeBoxes: 0, fairways: 0, rough: 0, bunkers: 0 }
    },
    { 
      id: 2, name: 'Rancho Park Golf Course', location: 'Los Angeles, CA', rating: 0, trendingUp: false, distance: '4 mi', stimp: 0, fee: 48, 
      phone: '(310) 838-7373', website: 'https://www.golf.lacity.org', aeration: 'October 05, 2026',
      imageUrl: 'https://golf-pass.brightspotcdn.com/dims4/default/8dc1b35/2147483647/strip/true/crop/750x484+60+0/resize/930x600!/format/webp/quality/90/?url=https%3A%2F%2Fgolf-pass-brightspot.s3.amazonaws.com%2Fb3%2F64%2F140b3c2d8dc1d93f807431ddd698%2F88451.jpg',
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

  // LOCAL STORAGE PERSISTENCE (Simulating a database)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const localChat = localStorage.getItem('gt_chat');
      const localReports = localStorage.getItem('gt_reports');
      const localCourses = localStorage.getItem('gt_courses');
      
      if (localChat) setChatFeed(JSON.parse(localChat));
      if (localReports) setIndividualReports(JSON.parse(localReports));
      if (localCourses) setCourses(JSON.parse(localCourses));
    }
  }, []);

  useEffect(() => { localStorage.setItem('gt_chat', JSON.stringify(chatFeed)); }, [chatFeed]);
  useEffect(() => { localStorage.setItem('gt_reports', JSON.stringify(individualReports)); }, [individualReports]);
  useEffect(() => { localStorage.setItem('gt_courses', JSON.stringify(courses)); }, [courses]);

  // Cooldown Timer Effect
  useEffect(() => {
    let timer: any;
    if (chatCooldown > 0) {
      timer = setTimeout(() => setChatCooldown(chatCooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [chatCooldown]);

  // AUTHENTICATION
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signUp({
      email: signUpForm.email, password: signUpForm.password,
      options: { data: { username: signUpForm.username, phone: signUpForm.phone, handicap: signUpForm.handicap, nicest_course: signUpForm.nicestCourse } }
    });
    if (error) alert("Registration Error: " + error.message);
    else {
      alert("Account successfully created! Please check your email to confirm.");
      setUserProfile({ username: signUpForm.username, email: signUpForm.email, phone: signUpForm.phone, handicap: signUpForm.handicap, nicestCourse: signUpForm.nicestCourse, avatarUrl: '', ratingsCount: 0, highestRating: 'N/A', lowestRating: 'N/A' });
      setIsLoggedIn(true);
      setView('home');
    }
  };

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({ email: signInForm.email, password: signInForm.password });
    if (error) alert("Sign In Error: " + error.message);
    else {
      const meta = data.user?.user_metadata || {};
      setUserProfile({ username: meta.username || 'User', email: data.user?.email || '', phone: meta.phone || '', handicap: meta.handicap || '', nicestCourse: meta.nicest_course || '', avatarUrl: '', ratingsCount: 0, highestRating: 'N/A', lowestRating: 'N/A' });
      setIsLoggedIn(true);
      setView('home');
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail);
    if (error) alert("Error: " + error.message);
    else {
      alert("Password reset instructions have been sent to your email.");
      setAuthMode('signin');
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setView('home');
  };

  // PROFILE
  const toggleSaveCourse = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLoggedIn) return alert("Sign in to save your favorite courses!");
    setSavedCourses(savedCourses.includes(id) ? savedCourses.filter(cId => cId !== id) : [...savedCourses, id]);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUserProfile({ ...userProfile, avatarUrl: URL.createObjectURL(e.target.files[0]) });
    }
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditingProfile(false);
    alert('Profile identity and details updated!');
  };

  // CHAT
  const handleChatImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setChatImage(URL.createObjectURL(e.target.files[0]));
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) return alert("You must be signed in to participate in the community chat.");
    if (chatCooldown > 0 || (!chatMessage.trim() && !chatImage)) return;
    
    const newMessage = { id: Date.now(), username: userProfile.username, text: chatMessage, timestamp: 'Just now', isSystem: false, image: chatImage };
    setChatFeed([...chatFeed, newMessage]);
    setChatMessage('');
    setChatImage(null);
    setChatCooldown(30);
  };

  // RATING SUBMISSION & MATH ENGINE
  const handleRatingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      alert("You must be signed in to submit a verified course rating.");
      setView('account');
      setShowRateModal(false);
      return;
    }

    const calculatedScore = ((ratingForm.teeBoxes + ratingForm.fairways + ratingForm.rough + ratingForm.bunkers) / 4).toFixed(1);
    const newReport = {
      id: Date.now(), courseId: Number(ratingForm.courseId), username: userProfile.username, handicap: userProfile.handicap,
      date: ratingForm.date || 'Today', stimpGiven: ratingForm.stimp, text: ratingForm.notes || '', score: calculatedScore
    };

    // Update Reports Array
    const updatedReports = [newReport, ...individualReports];
    setIndividualReports(updatedReports);
    
    // Calculate and Update Master Course Averages
    const courseSpecificReports = updatedReports.filter(r => r.courseId === Number(ratingForm.courseId));
    const avgScore = (courseSpecificReports.reduce((sum, r) => sum + parseFloat(r.score), 0) / courseSpecificReports.length).toFixed(1);
    const avgStimp = (courseSpecificReports.reduce((sum, r) => sum + parseFloat(r.stimpGiven), 0) / courseSpecificReports.length).toFixed(1);

    const updatedCourses = courses.map(c => 
      c.id === Number(ratingForm.courseId) ? { ...c, rating: parseFloat(avgScore), stimp: parseFloat(avgStimp) } : c
    );
    setCourses(updatedCourses);

    // If viewing the course currently, update the modal live
    if (selectedCourse && selectedCourse.id === ratingForm.courseId) {
      setSelectedCourse(updatedCourses.find(c => c.id === ratingForm.courseId));
    }

    // Update User Stats Live
    setUserProfile(prev => ({
      ...prev, ratingsCount: prev.ratingsCount + 1,
      highestRating: prev.highestRating === 'N/A' || parseFloat(calculatedScore) > parseFloat(prev.highestRating) ? calculatedScore : prev.highestRating,
      lowestRating: prev.lowestRating === 'N/A' || parseFloat(calculatedScore) < parseFloat(prev.lowestRating) ? calculatedScore : prev.lowestRating,
    }));

    setShowRateModal(false);
    alert("Rating successfully verified and added to the course profile!");
    setRatingForm({ courseId: 1, date: '', stimp: 10, teeBoxes: 3.0, fairways: 3.0, rough: 3.0, bunkers: 3.0, notes: '' });
  };

  // REAL USER STATS CALCULATOR
  const openUserModal = (clickedUsername: string, defaultHandicap: string) => {
    // If the user clicked their own name, mirror the exact Account tab data
    if (isLoggedIn && clickedUsername === userProfile.username) {
      setSelectedUser({
        username: userProfile.username,
        handicap: userProfile.handicap,
        ratingsCount: userProfile.ratingsCount,
        highestRating: userProfile.highestRating,
        lowestRating: userProfile.lowestRating
      });
      return;
    }

    // If clicking someone else, calculate their true stats based on their submitted reports
    const userReports = individualReports.filter(r => r.username === clickedUsername);
    let ratingsCount = userReports.length;
    let highestRating = 'N/A';
    let lowestRating = 'N/A';
    let handicap = defaultHandicap;

    if (ratingsCount > 0) {
      const scores = userReports.map(r => parseFloat(r.score));
      highestRating = Math.max(...scores).toFixed(1);
      lowestRating = Math.min(...scores).toFixed(1);
      if (handicap === 'Unknown') {
        handicap = userReports[0].handicap || 'Unknown';
      }
    }

    setSelectedUser({
      username: clickedUsername,
      handicap,
      ratingsCount,
      highestRating,
      lowestRating
    });
  };

  const getFilteredCourses = () => {
    let list = [...courses];
    if (activeTab === 'topRated') return list.sort((a, b) => b.rating - a.rating);
    if (activeTab === 'trending') return list.filter(c => c.trendingUp);
    if (activeTab === 'myCourses') return list.filter(c => savedCourses.includes(c.id));
    return list;
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans antialiased pb-24">
      
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
            <div className="flex justify-between items-center pb-2">
              <div className="flex space-x-1 overflow-x-auto border-b border-neutral-200 pb-1 flex-1 pr-2">
                {['Near Me', 'Top Rated', 'Trending', 'Saved'].map((label, idx) => {
                  const keys = ['nearMe', 'topRated', 'trending', 'myCourses'];
                  return (
                    <button key={label} onClick={() => setActiveTab(keys[idx] as any)} className={`text-[10px] font-bold uppercase tracking-wider px-3 py-2 rounded whitespace-nowrap transition-all ${activeTab === keys[idx] ? 'bg-neutral-900 text-white' : 'bg-white border border-neutral-200 text-neutral-500'}`}>
                      {label}
                    </button>
                  );
                })}
              </div>
              <button onClick={() => setShowRateModal(true)} className="bg-emerald-800 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-2 rounded flex items-center space-x-1 whitespace-nowrap shadow-sm hover:bg-emerald-700">
                <Plus size={12} /> <span>Rate Course</span>
              </button>
            </div>

            <section className="space-y-3">
              {getFilteredCourses().map((course) => (
                <div key={course.id} onClick={() => { setSelectedCourse(course); setShowGuideInsideModal(false); }} className="bg-white rounded-lg border border-neutral-200 overflow-hidden hover:border-neutral-400 transition-all cursor-pointer flex flex-col shadow-sm relative">
                  
                  <div className="w-full h-36 bg-neutral-200 relative">
                    <img src={course.imageUrl} alt={course.name} className="w-full h-full object-cover filter brightness-[0.9]" />
                    <button onClick={(e) => toggleSaveCourse(course.id, e)} className="absolute top-3 left-3 bg-white/90 p-1.5 rounded-full shadow-sm hover:bg-white transition-colors z-10">
                      <Heart size={14} className={savedCourses.includes(course.id) ? "fill-red-500 text-red-500" : "text-neutral-400"} />
                    </button>
                    <div className="absolute top-3 right-3 bg-neutral-900/80 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                      ${course.fee} Base
                    </div>
                  </div>
                  
                  <div className="p-4 space-y-1">
                    <h3 className="font-extrabold text-sm text-neutral-900 tracking-tight">{course.name}</h3>
                    <p className="text-xs text-neutral-400 font-semibold">{course.location} • {course.distance}</p>
                    <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider pt-1">
                      Condition Score: <span className={course.rating === 0 ? "text-neutral-400 font-medium" : "text-emerald-700 font-black"}>
                        {course.rating === 0 ? 'Not yet rated' : `${course.rating} / 5.0`}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </section>
          </>
        )}

        {/* VIEW 2: LIVE DISCORD-STYLE CHAT */}
        {view === 'community' && (
          <div className="flex flex-col h-[75vh] bg-white rounded-lg border border-neutral-200 overflow-hidden shadow-sm">
            <div className="bg-neutral-50 p-3 border-b border-neutral-200 flex justify-between items-center">
              <div>
                <h2 className="font-black text-xs text-neutral-900 uppercase tracking-wider">SoCal Live Feed</h2>
                <p className="text-[10px] font-semibold text-neutral-400">Real-time golfer chat (Slow Mode: 30s)</p>
              </div>
              <span className="flex items-center space-x-1.5 bg-emerald-100 text-emerald-800 px-2 py-1 rounded text-[9px] font-bold uppercase tracking-widest">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                <span>Live</span>
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white flex flex-col-reverse">
              {[...chatFeed].reverse().map((msg) => (
                <div key={msg.id} className="space-y-1.5">
                  <div className="flex items-baseline space-x-2">
                    <button onClick={() => msg.isSystem ? null : openUserModal(msg.username, 'Unknown')} className={`text-xs font-bold ${msg.isSystem ? 'text-emerald-700 cursor-default' : 'text-neutral-900 hover:underline'}`}>
                      {msg.username}
                    </button>
                    <span className="text-[9px] text-neutral-400">{msg.timestamp}</span>
                  </div>
                  {msg.text && (
                    <p className={`text-xs p-2.5 rounded-md inline-block max-w-[85%] leading-relaxed ${msg.isSystem ? 'bg-emerald-50 text-emerald-900 border border-emerald-100' : 'bg-neutral-100 text-neutral-700'}`}>
                      {msg.text}
                    </p>
                  )}
                  {msg.image && (
                    <img src={msg.image} alt="User upload" className="rounded-md max-w-[85%] border border-neutral-200 mt-1" />
                  )}
                </div>
              ))}
            </div>

            <div className="bg-neutral-50 border-t border-neutral-200 flex flex-col p-3">
              {chatImage && (
                <div className="relative w-16 h-16 mb-2 rounded overflow-hidden border border-neutral-300">
                  <img src={chatImage} alt="Preview" className="w-full h-full object-cover" />
                  <button onClick={() => setChatImage(null)} className="absolute top-0 right-0 bg-neutral-900/60 text-white p-0.5 rounded-bl">✕</button>
                </div>
              )}
              <form onSubmit={handleSendMessage} className="flex space-x-2 items-center">
                <input type="file" accept="image/*" id="chat-photo" className="hidden" onChange={handleChatImageSelect} disabled={chatCooldown > 0} />
                <label htmlFor="chat-photo" className={`p-1 cursor-pointer transition-colors ${chatCooldown > 0 ? 'text-neutral-300' : 'text-neutral-400 hover:text-emerald-700'}`}>
                  <ImageIcon size={18} />
                </label>
                <input 
                  type="text" 
                  placeholder={chatCooldown > 0 ? `Slow mode active...` : "Message the community..."}
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  disabled={chatCooldown > 0}
                  className="flex-1 bg-white border border-neutral-300 rounded-full px-4 py-2 text-xs focus:outline-none focus:border-emerald-600 disabled:bg-neutral-100 disabled:text-neutral-400"
                />
                <button type="submit" disabled={chatCooldown > 0} className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${chatCooldown > 0 ? 'bg-neutral-300 text-neutral-500' : 'bg-emerald-800 text-white hover:bg-emerald-700'}`}>
                  {chatCooldown > 0 ? <span className="text-[10px] font-bold">{chatCooldown}s</span> : <Send size={14} />}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* VIEW 3: ACCOUNT & AUTHENTICATION */}
        {view === 'account' && (
          <section className="space-y-4">
            {!isLoggedIn ? (
              <div className="bg-white rounded-lg p-6 border border-neutral-200 shadow-xs space-y-5">
                <div className="flex border-b border-neutral-100 pb-3">
                  <button onClick={() => setAuthMode('signin')} className={`flex-1 text-center pb-2 text-xs font-bold uppercase tracking-wider ${authMode === 'signin' ? 'text-emerald-800 border-b-2 border-emerald-800' : 'text-neutral-400'}`}>Sign In</button>
                  <button onClick={() => setAuthMode('signup')} className={`flex-1 text-center pb-2 text-xs font-bold uppercase tracking-wider ${authMode === 'signup' ? 'text-emerald-800 border-b-2 border-emerald-800' : 'text-neutral-400'}`}>Sign Up</button>
                </div>
                
                {authMode === 'signup' && (
                  <form onSubmit={handleSignUpSubmit} className="space-y-4">
                    <input type="text" required placeholder="Username *" value={signUpForm.username} onChange={(e) => setSignUpForm({...signUpForm, username: e.target.value})} className="w-full bg-neutral-50 border border-neutral-200 rounded py-2 px-3 text-sm" />
                    <input type="email" required placeholder="Email Address *" value={signUpForm.email} onChange={(e) => setSignUpForm({...signUpForm, email: e.target.value})} className="w-full bg-neutral-50 border border-neutral-200 rounded py-2 px-3 text-sm" />
                    <input type="password" required placeholder="Password *" value={signUpForm.password} onChange={(e) => setSignUpForm({...signUpForm, password: e.target.value})} className="w-full bg-neutral-50 border border-neutral-200 rounded py-2 px-3 text-sm" />
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <input type="tel" required placeholder="Phone *" value={signUpForm.phone} onChange={(e) => setSignUpForm({...signUpForm, phone: e.target.value})} className="w-full bg-neutral-50 border border-neutral-200 rounded py-2 px-3 text-sm" />
                      <input type="text" required placeholder="Handicap *" value={signUpForm.handicap} onChange={(e) => setSignUpForm({...signUpForm, handicap: e.target.value})} className="w-full bg-neutral-50 border border-neutral-200 rounded py-2 px-3 text-sm" />
                    </div>
                    <button type="submit" className="w-full bg-emerald-800 text-white font-bold py-3 px-4 rounded text-xs uppercase tracking-wider">Create Account</button>
                  </form>
                )}

                {authMode === 'signin' && (
                  <form onSubmit={handleSignInSubmit} className="space-y-4">
                    <input type="email" required placeholder="Email Address" value={signInForm.email} onChange={(e) => setSignInForm({...signInForm, email: e.target.value})} className="w-full bg-neutral-50 border border-neutral-200 rounded py-2 px-3 text-sm" />
                    <input type="password" required placeholder="Password" value={signInForm.password} onChange={(e) => setSignInForm({...signInForm, password: e.target.value})} className="w-full bg-neutral-50 border border-neutral-200 rounded py-2 px-3 text-sm" />
                    <div className="text-right">
                      <button type="button" onClick={() => setAuthMode('forgot')} className="text-[10px] font-bold text-neutral-500 hover:text-emerald-700 uppercase tracking-wider">Forgot Password?</button>
                    </div>
                    <button type="submit" className="w-full bg-emerald-800 text-white font-bold py-3 px-4 rounded text-xs uppercase tracking-wider">Sign In</button>
                  </form>
                )}

                {authMode === 'forgot' && (
                  <form onSubmit={handlePasswordReset} className="space-y-4">
                    <p className="text-xs text-neutral-500 font-medium text-center">Enter your email to receive a secure reset link.</p>
                    <input type="email" required placeholder="Email Address" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} className="w-full bg-neutral-50 border border-neutral-200 rounded py-2 px-3 text-sm" />
                    <button type="submit" className="w-full bg-neutral-900 text-white font-bold py-3 px-4 rounded text-xs uppercase tracking-wider hover:bg-neutral-800">Send Reset Link</button>
                    <button type="button" onClick={() => setAuthMode('signin')} className="w-full text-[10px] font-bold text-neutral-500 uppercase tracking-wider mt-2 hover:text-emerald-700">Back to Sign In</button>
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
                    <input type="file" accept="image/*" id="pfp-upload" className="hidden" onChange={handleImageUpload} />
                    <label htmlFor="pfp-upload" className="absolute bottom-0 right-0 bg-emerald-800 p-2 rounded-full text-white shadow-md hover:bg-emerald-700 transition-colors cursor-pointer">
                      <Camera size={14} />
                    </label>
                  </div>
                  
                  <div className="text-center">
                    {isEditingProfile ? (
                      <input type="text" value={userProfile.username} onChange={(e) => setUserProfile({...userProfile, username: e.target.value})} className="text-lg font-black text-neutral-900 border-b border-neutral-300 focus:outline-none text-center bg-transparent" placeholder="Username" />
                    ) : (
                      <h2 className="text-lg font-black text-neutral-900">@{userProfile.username}</h2>
                    )}
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mt-1">Verified Auditor</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center border-y border-neutral-100 py-3">
                  <div>
                    <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">Rated</span>
                    <span className="text-sm font-black text-neutral-800">{userProfile.ratingsCount}</span>
                  </div>
                  <div className="border-l border-neutral-100">
                    <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">Highest Given</span>
                    <span className="text-sm font-black text-emerald-700">{userProfile.highestRating}</span>
                  </div>
                  <div className="border-l border-neutral-100">
                    <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">Lowest Given</span>
                    <span className="text-sm font-black text-red-700">{userProfile.lowestRating}</span>
                  </div>
                </div>

                <form onSubmit={handleProfileSave} className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-neutral-100">
                    <span className="text-xs font-black uppercase tracking-wider text-neutral-800">Account Details</span>
                    <button type="button" onClick={() => setIsEditingProfile(!isEditingProfile)} className="text-[10px] flex items-center space-x-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                      <Edit2 size={10} /> <span>{isEditingProfile ? 'Cancel' : 'Edit'}</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-neutral-400">Email Address</label>
                      <input disabled={!isEditingProfile} type="email" value={userProfile.email} onChange={(e) => setUserProfile({...userProfile, email: e.target.value})} className="w-full bg-neutral-50 border border-neutral-200 rounded py-2 px-3 text-xs text-neutral-800 disabled:bg-transparent disabled:border-transparent disabled:px-0" placeholder="Not set" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-bold uppercase text-neutral-400">Phone</label>
                        <input disabled={!isEditingProfile} type="tel" value={userProfile.phone} onChange={(e) => setUserProfile({...userProfile, phone: e.target.value})} className="w-full bg-neutral-50 border border-neutral-200 rounded py-2 px-3 text-xs text-neutral-800 disabled:bg-transparent disabled:border-transparent disabled:px-0" placeholder="Not set" />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase text-neutral-400">Handicap</label>
                        <input disabled={!isEditingProfile} type="text" value={userProfile.handicap} onChange={(e) => setUserProfile({...userProfile, handicap: e.target.value})} className="w-full bg-neutral-50 border border-neutral-200 rounded py-2 px-3 text-xs text-neutral-800 disabled:bg-transparent disabled:border-transparent disabled:px-0" placeholder="Not set" />
                      </div>
                    </div>
                  </div>

                  {isEditingProfile && (
                    <button type="submit" className="w-full bg-emerald-800 text-white font-bold py-3 rounded text-xs uppercase tracking-wider mt-4">Save Changes</button>
                  )}
                </form>

                <button onClick={handleSignOut} className="w-full border border-neutral-200 bg-neutral-50 text-neutral-600 font-bold py-3 rounded text-xs uppercase tracking-wider flex items-center justify-center space-x-2 hover:bg-neutral-100">
                  <LogOut size={14} /> <span>Sign Out</span>
                </button>
              </div>
            )}
          </section>
        )}
      </main>

      {/* RATING FORM MODAL */}
      {showRateModal && (
        <div className="fixed inset-0 bg-neutral-950/80 flex items-end justify-center z-[60]" onClick={() => setShowRateModal(false)}>
          <div className="bg-white rounded-t-2xl w-full max-w-md p-6 space-y-5 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
              <h2 className="text-sm font-black text-neutral-900 uppercase tracking-wider flex items-center space-x-1"><Star size={16} className="text-emerald-600" /> <span>Rate Course Conditions</span></h2>
              <button onClick={() => setShowRateModal(false)} className="w-6 h-6 bg-neutral-100 font-bold rounded-full flex items-center justify-center text-neutral-400 text-xs">✕</button>
            </div>

            <form onSubmit={handleRatingSubmit} className="space-y-5">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-neutral-500">Select Course</label>
                <select className="w-full bg-neutral-50 border border-neutral-200 rounded py-2.5 px-3 text-sm" value={ratingForm.courseId} onChange={(e) => setRatingForm({...ratingForm, courseId: Number(e.target.value)})}>
                  {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-neutral-500">Date Played</label>
                <input type="date" className="w-full bg-neutral-50 border border-neutral-200 rounded py-2 px-3 text-sm" value={ratingForm.date} onChange={(e) => setRatingForm({...ratingForm, date: e.target.value})} required />
              </div>

              <div className="border border-neutral-200 rounded-md overflow-hidden">
                <button type="button" onClick={() => setShowGuideInsideRateModal(!showGuideInsideRateModal)} className="w-full bg-neutral-50 px-4 py-2.5 flex justify-between items-center text-left text-xs font-bold text-neutral-700">
                  <div className="flex items-center space-x-1.5"><Info size={13} className="text-neutral-500" /><span>Condition Assessment Guide</span></div>
                  {showGuideInsideRateModal ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
                {showGuideInsideRateModal && (
                  <div className="p-4 bg-white border-t border-neutral-100 text-[11px] text-neutral-600 space-y-3 max-h-48 overflow-y-auto">
                    <p><strong>5 — PGA Tour Level:</strong> Flat tee boxes, cut fairways, uniform lush rough, smooth zero-wobble greens.</p>
                    <p><strong>4 — Country Club Premium:</strong> Clean uniform fairways, standard thick rough, minimal tee divots, highly consistent greens.</p>
                    <p><strong>3 — Average Public / Resort:</strong> Minor thin spots on fairway, packed sand beds, noticeable tee divots, standard green rolling.</p>
                    <p><strong>2 — Below Average:</strong> Hardpan fairway gaps, weed-heavy rough, muddy traps, uneven tee boxes, un-level bumpy greens.</p>
                    <p><strong>1 — Minimal Maintenance:</strong> Exposed dry fairways, raw dirt patches, shaggy heavily scarred greens.</p>
                  </div>
                )}
              </div>

              <div className="space-y-4 border-t border-neutral-100 pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-neutral-700">Stimp (Green Speed)</label>
                    <span className="text-xs font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">{ratingForm.stimp}</span>
                  </div>
                  <input type="range" min={6} max={14} step={1} value={ratingForm.stimp} onChange={(e) => setRatingForm({...ratingForm, stimp: parseInt(e.target.value)})} className="w-full accent-emerald-600" />
                </div>
                
                {[
                  { label: "Tee Boxes", stateKey: 'teeBoxes', val: ratingForm.teeBoxes },
                  { label: "Fairways", stateKey: 'fairways', val: ratingForm.fairways },
                  { label: "Rough", stateKey: 'rough', val: ratingForm.rough },
                  { label: "Bunkers", stateKey: 'bunkers', val: ratingForm.bunkers },
                ].map((slider) => (
                  <div key={slider.stateKey} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-neutral-700">{slider.label}</label>
                      <span className="text-xs font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">{slider.val}</span>
                    </div>
                    <input type="range" min={1.0} max={5.0} step={0.1} value={slider.val} onChange={(e) => setRatingForm({...ratingForm, [slider.stateKey]: parseFloat(e.target.value)})} className="w-full accent-emerald-600" />
                  </div>
                ))}
              </div>

              <div className="space-y-1 pt-2">
                <label className="text-[10px] font-bold uppercase text-neutral-500">Additional Notes</label>
                <textarea rows={3} className="w-full bg-neutral-50 border border-neutral-200 rounded py-2 px-3 text-sm resize-none" value={ratingForm.notes} onChange={(e) => setRatingForm({...ratingForm, notes: e.target.value})}></textarea>
              </div>

              <button type="submit" className="w-full bg-neutral-900 text-white font-bold py-3.5 rounded-lg text-xs uppercase tracking-wider hover:bg-neutral-800">
                Submit Verified Rating
              </button>
            </form>
          </div>
        </div>
      )}

      {/* USER PROFILE MODAL */}
      {selectedUser && (
        <div className="fixed inset-0 bg-neutral-950/60 flex items-center justify-center p-4 z-[70]" onClick={() => setSelectedUser(null)}>
          <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-xl space-y-4 border border-neutral-200" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start border-b border-neutral-100 pb-2">
              <div>
                <h3 className="text-sm font-black text-neutral-900">@{selectedUser.username}</h3>
                <p className="text-[9px] uppercase font-bold text-neutral-400 tracking-wider">Public Golfer Stats</p>
              </div>
              <button onClick={() => setSelectedUser(null)} className="text-neutral-400 font-bold text-xs bg-neutral-100 w-6 h-6 rounded-full flex items-center justify-center">✕</button>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-neutral-50 p-3 rounded border border-neutral-100 text-center">
                <span className="text-[9px] font-bold text-neutral-400 uppercase block tracking-wider mb-1">Handicap</span>
                <span className="text-base font-black text-neutral-800">{selectedUser.handicap}</span>
              </div>
              <div className="bg-neutral-50 p-3 rounded border border-neutral-100 text-center">
                <span className="text-[9px] font-bold text-neutral-400 uppercase block tracking-wider mb-1">Total Ratings</span>
                <span className="text-base font-black text-neutral-800">{selectedUser.ratingsCount}</span>
              </div>
              <div className="bg-neutral-50 p-3 rounded border border-neutral-100 text-center">
                <span className="text-[9px] font-bold text-neutral-400 uppercase block tracking-wider mb-1">Highest Given</span>
                <span className="text-base font-black text-emerald-700">{selectedUser.highestRating}</span>
              </div>
              <div className="bg-neutral-50 p-3 rounded border border-neutral-100 text-center">
                <span className="text-[9px] font-bold text-neutral-400 uppercase block tracking-wider mb-1">Lowest Given</span>
                <span className="text-base font-black text-red-700">{selectedUser.lowestRating}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DETAILED COURSE MODAL */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-neutral-950/60 flex items-end justify-center z-50" onClick={() => setSelectedCourse(null)}>
          <div className="bg-white rounded-t-2xl w-full max-w-md p-6 space-y-4 max-h-[85vh] overflow-y-auto border-t border-neutral-200 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            
            <div className="flex justify-between items-start border-b border-neutral-100 pb-3">
              <div className="space-y-1.5 w-full">
                <h2 className="text-lg font-black text-neutral-900 uppercase tracking-wider leading-tight">{selectedCourse.name}</h2>
                <div className="flex flex-col space-y-0.5">
                  <span className="text-xs font-semibold text-neutral-500">{selectedCourse.location}</span>
                  <a href={`tel:${selectedCourse.phone}`} className="text-[11px] font-bold text-emerald-800 hover:underline">{selectedCourse.phone}</a>
                  <a href={selectedCourse.website} target="_blank" rel="noreferrer" className="text-[11px] font-bold text-emerald-800 hover:underline">Visit Website ↗</a>
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider pt-1">Aerification: {selectedCourse.aeration}</span>
                </div>
              </div>
              <button onClick={() => setSelectedCourse(null)} className="w-6 h-6 bg-neutral-100 font-bold rounded-full flex items-center justify-center text-neutral-400 text-xs shrink-0">✕</button>
            </div>

            <img src={selectedCourse.imageUrl} alt={selectedCourse.name} className="w-full h-40 object-cover rounded-md border border-neutral-200" />

            <div className="grid grid-cols-2 gap-3 text-center text-xs">
              <div className="bg-neutral-50 rounded p-3 border border-neutral-200/60">
                <span className="text-[9px] font-bold uppercase text-neutral-400 block tracking-wider mb-0.5">Condition Index (Avg)</span>
                <span className={selectedCourse.rating === 0 ? "text-xl font-black text-neutral-400" : "text-xl font-black text-emerald-700"}>
                  {selectedCourse.rating === 0 ? 'N/A' : `${selectedCourse.rating} / 5.0`}
                </span>
              </div>
              <div className="bg-neutral-50 rounded p-3 border border-neutral-200/60">
                <span className="text-[9px] font-bold uppercase text-neutral-400 block tracking-wider mb-0.5">Velocity (Stimp)</span>
                <span className={selectedCourse.stimp === 0 ? "text-xl font-black text-neutral-400" : "text-xl font-black text-emerald-700"}>
                  {selectedCourse.stimp === 0 ? 'N/A' : selectedCourse.stimp}
                </span>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-neutral-200 p-4 space-y-3 mt-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block border-b pb-1">Individual Auditor Reports</span>
              <div className="space-y-3">
                {individualReports.filter(r => r.courseId === selectedCourse.id).length === 0 ? (
                  <p className="text-xs text-neutral-400 font-medium italic text-center py-2">No individual audit entries submitted yet.</p>
                ) : (
                  individualReports.filter(r => r.courseId === selectedCourse.id).map((report) => (
                    <div key={report.id} className="pt-3 first:pt-0 space-y-1 text-xs border-b border-neutral-50 pb-3 last:border-0">
                      <div className="flex justify-between items-center">
                        <button onClick={() => openUserModal(report.username, report.handicap)} className="font-extrabold text-neutral-800 hover:underline">@{report.username} <span className="text-[9px] bg-neutral-100 text-neutral-500 font-bold px-1 rounded ml-1">HCP {report.handicap}</span></button>
                        <span className="text-[10px] text-neutral-400 font-medium">{report.date}</span>
                      </div>
                      <div className="flex space-x-2 text-[10px] font-bold text-neutral-500 uppercase tracking-wide py-0.5">
                        <span className="bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded">Stimp: {report.stimpGiven}</span>
                        <span className="bg-neutral-100 text-neutral-700 px-1.5 py-0.5 rounded">Score: {report.score}/5</span>
                      </div>
                      {report.text && <p className="text-neutral-600 font-medium italic mt-1">"{report.text}"</p>}
                    </div>
                  ))
                )}
              </div>
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