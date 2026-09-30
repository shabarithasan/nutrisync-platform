import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Users, 
  Lock, 
  CheckCircle2, 
  Flame, 
  Droplet, 
  Star, 
  Medal,
  Camera,
  Sunrise,
  Share2,
  Heart,
  MessageCircle,
  Send,
  Plus,
  Sparkles,
  Zap,
  Award,
  ChevronRight,
  Smile,
  ThumbsUp,
  X,
  UserPlus,
  Clock,
  Filter,
  Check
} from 'lucide-react';

const GlassCard = ({ children, className = "", delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    className={`rounded-[28px] backdrop-blur-2xl bg-white/60 border border-white/70 shadow-[0_8px_32px_rgba(0,0,0,0.06)] overflow-hidden ${className}`}
  >
    {children}
  </motion.div>
);

export function ModernSocial({ profile }) {
  const userName = profile?.name || 'You';
  const userInitial = userName.charAt(0).toUpperCase();

  // Tab navigation
  const [activeTab, setActiveTab] = useState('feed'); // 'feed', 'leaderboard', 'challenges', 'badges'

  // Dynamic Leaderboard Time Filter
  const [leaderboardFilter, setLeaderboardFilter] = useState('week'); // 'today', 'week', 'month'

  // Real user steps calculation
  const [userSteps, setUserSteps] = useState(0);

  useEffect(() => {
    try {
      const logs = JSON.parse(localStorage.getItem('nts-log') || '{}');
      const today = new Date().toISOString().split('T')[0];
      const todaySteps = logs[today]?.steps || 0;
      setUserSteps(todaySteps > 0 ? todaySteps : 8420);
    } catch {
      setUserSteps(8420);
    }
  }, []);

  /* -----------------------------------------------------------
   * 1. DYNAMIC POSTS & ACTIVITY FEED
   * ----------------------------------------------------------- */
  const defaultPosts = [
    {
      id: 1,
      author: 'Sarah Chen',
      avatar: 'SC',
      avatarBg: 'bg-emerald-500',
      time: '25m ago',
      tag: '#Milestone',
      tagColor: 'bg-emerald-100 text-emerald-700',
      content: 'Just crushed my morning 10K steps before 9 AM! Feeling super energized for the day ☀️🏃‍♀️',
      likes: 14,
      liked: false,
      comments: [
        { id: 101, author: 'Marcus Johnson', text: 'Incredible pace Sarah! Keep inspiring us!' }
      ]
    },
    {
      id: 2,
      author: 'Marcus Johnson',
      avatar: 'MJ',
      avatarBg: 'bg-blue-500',
      time: '2h ago',
      tag: '#Nutrition',
      tagColor: 'bg-blue-100 text-blue-700',
      content: 'Prepped high-protein quinoa & grilled chicken bowls for the next 3 days. 45g protein, 520 kcal each! 🥗🍗',
      likes: 28,
      liked: true,
      comments: [
        { id: 102, author: 'Emma Davis', text: 'Need this recipe! Did you use Greek yogurt dressing?' }
      ]
    },
    {
      id: 3,
      author: 'Elena Rostova',
      avatar: 'ER',
      avatarBg: 'bg-purple-500',
      time: '4h ago',
      tag: '#Hydration',
      tagColor: 'bg-purple-100 text-purple-700',
      content: 'Hit my 3-Liter water target 4 days in a row! Headaches are totally gone and recovery feels 2x faster 💧✨',
      likes: 19,
      liked: false,
      comments: []
    }
  ];

  const [posts, setPosts] = useState(() => {
    try {
      const saved = localStorage.getItem('nts-community-posts');
      return saved ? JSON.parse(saved) : defaultPosts;
    } catch {
      return defaultPosts;
    }
  });

  // Post composer state
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostTag, setNewPostTag] = useState('#Workout');
  const [commentInputs, setCommentInputs] = useState({});
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);

  // Cheer / Toast feedback
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    const newPost = {
      id: Date.now(),
      author: userName,
      avatar: userInitial,
      avatarBg: 'bg-gradient-to-br from-emerald-400 to-emerald-600',
      time: 'Just now',
      tag: newPostTag,
      tagColor: 'bg-orange-100 text-orange-700',
      content: newPostContent.trim(),
      likes: 1,
      liked: true,
      comments: []
    };

    const updated = [newPost, ...posts];
    setPosts(updated);
    localStorage.setItem('nts-community-posts', JSON.stringify(updated));
    setNewPostContent('');
    triggerToast('🎉 Your update was shared with the Community!');
  };

  const handleToggleLike = (postId) => {
    const updated = posts.map(post => {
      if (post.id === postId) {
        const nextLiked = !post.liked;
        return {
          ...post,
          liked: nextLiked,
          likes: nextLiked ? post.likes + 1 : post.likes - 1
        };
      }
      return post;
    });
    setPosts(updated);
    localStorage.setItem('nts-community-posts', JSON.stringify(updated));
  };

  const handleAddComment = (postId) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;

    const updated = posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [
            ...post.comments,
            { id: Date.now(), author: userName, text }
          ]
        };
      }
      return post;
    });

    setPosts(updated);
    localStorage.setItem('nts-community-posts', JSON.stringify(updated));
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    triggerToast('💬 Comment added!');
  };

  /* -----------------------------------------------------------
   * 2. DYNAMIC CHALLENGES
   * ----------------------------------------------------------- */
  const defaultChallenges = [
    { 
      id: 1, 
      name: 'Weekend 20k Step Dash', 
      desc: 'Complete 20,000 steps over 48 hours with your squad.', 
      progress: 14200, 
      target: 20000, 
      unit: 'steps',
      participants: 48, 
      daysLeft: 2, 
      joined: true,
      reward: '250 XP + Silver Badge'
    },
    { 
      id: 2, 
      name: '7 Days No Added Sugar', 
      desc: 'Swap sugary drinks and snacks for whole fruits and clean meals.', 
      progress: 5, 
      target: 7, 
      unit: 'days',
      participants: 32, 
      daysLeft: 3, 
      joined: true,
      reward: '350 XP + Pure Fuel Badge'
    },
    { 
      id: 3, 
      name: 'Hydration Streak: 3L Daily', 
      desc: 'Drink at least 3 liters of water every day for 5 consecutive days.', 
      progress: 2, 
      target: 5, 
      unit: 'days',
      participants: 64, 
      daysLeft: 4, 
      joined: false,
      reward: '180 XP + Hydro Master'
    }
  ];

  const [challenges, setChallenges] = useState(() => {
    try {
      const saved = localStorage.getItem('nts-community-challenges');
      return saved ? JSON.parse(saved) : defaultChallenges;
    } catch {
      return defaultChallenges;
    }
  });

  const [showNewChallengeModal, setShowNewChallengeModal] = useState(false);
  const [newChallengeForm, setNewChallengeForm] = useState({
    name: '',
    desc: '',
    target: 10000,
    unit: 'steps'
  });

  const handleToggleJoinChallenge = (challengeId) => {
    const updated = challenges.map(c => {
      if (c.id === challengeId) {
        const nextJoined = !c.joined;
        return {
          ...c,
          joined: nextJoined,
          participants: nextJoined ? c.participants + 1 : c.participants - 1
        };
      }
      return c;
    });
    setChallenges(updated);
    localStorage.setItem('nts-community-challenges', JSON.stringify(updated));
    triggerToast(challenges.find(c => c.id === challengeId)?.joined ? 'Left challenge' : '🎯 You joined the challenge!');
  };

  const handleAddChallengeProgress = (challengeId) => {
    const updated = challenges.map(c => {
      if (c.id === challengeId) {
        const increment = c.unit === 'steps' ? 1000 : 1;
        const newProg = Math.min(c.target, c.progress + increment);
        return { ...c, progress: newProg };
      }
      return c;
    });
    setChallenges(updated);
    localStorage.setItem('nts-community-challenges', JSON.stringify(updated));
    triggerToast('⚡ Progress updated!');
  };

  const handleCreateChallenge = (e) => {
    e.preventDefault();
    if (!newChallengeForm.name.trim()) return;

    const newC = {
      id: Date.now(),
      name: newChallengeForm.name.trim(),
      desc: newChallengeForm.desc.trim() || 'Community fitness goal',
      progress: 0,
      target: Number(newChallengeForm.target) || 10000,
      unit: newChallengeForm.unit,
      participants: 1,
      daysLeft: 7,
      joined: true,
      reward: '200 XP'
    };

    const updated = [newC, ...challenges];
    setChallenges(updated);
    localStorage.setItem('nts-community-challenges', JSON.stringify(updated));
    setShowNewChallengeModal(false);
    setNewChallengeForm({ name: '', desc: '', target: 10000, unit: 'steps' });
    triggerToast('🚀 New Community Challenge created!');
  };

  /* -----------------------------------------------------------
   * 3. REAL TIME LEADERBOARDS & NUDGING
   * ----------------------------------------------------------- */
  const [customFriends, setCustomFriends] = useState(() => {
    try {
      const saved = localStorage.getItem('nts-community-friends');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [suggestedFriends, setSuggestedFriends] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const session = JSON.parse(sessionStorage.getItem('nts-auth'));
        if (!session) return;
        const apiBase = import.meta.env.PROD ? '' : 'http://localhost:4000';
        const res = await fetch(apiBase + '/api/social/users', {
          headers: { Authorization: 'Bearer ' + session.accessToken }
        });
        if (res.ok) {
          const data = await res.json();
          const existingNames = customFriends.map(f => f.name);
          setSuggestedFriends(data.users.filter(u => !existingNames.includes(u.name)).slice(0, 5));
        }
      } catch(e) {}
    };
    fetchUsers();
  }, [customFriends.length]);

  const handleAddSuggestedFriend = (friend) => {
    setSuggestedFriends(prev => prev.filter(f => f.name !== friend.name));
    const newFriend = {
      name: friend.name,
      avatar: friend.avatar,
      weeklySteps: friend.steps,
      isUser: false,
      streak: `🔥 ${Math.floor(Math.random() * 5 + 1)} days`
    };
    setCustomFriends(prev => {
      const next = [...prev, newFriend];
      localStorage.setItem('nts-community-friends', JSON.stringify(next));
      return next;
    });
    triggerToast(`🎉 You and ${friend.name} are now connected!`);
  };

  const [inviteEmail, setInviteEmail] = useState('');

  const handleInviteFriend = (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    
    triggerToast(`📨 Invite sent to ${inviteEmail}! (Simulating join...)`);
    const emailParts = inviteEmail.split('@')[0];
    const name = emailParts.charAt(0).toUpperCase() + emailParts.slice(1).replace(/[._-]/g, ' ');
    const avatar = name.substring(0, 2).toUpperCase();

    setTimeout(() => {
      const newFriend = {
        name: name,
        avatar: avatar,
        weeklySteps: Math.floor(Math.random() * (45000 - 15000) + 15000),
        isUser: false,
        streak: `🔥 ${Math.floor(Math.random() * 10 + 1)} days`
      };
      setCustomFriends(prev => {
        const next = [...prev, newFriend];
        localStorage.setItem('nts-community-friends', JSON.stringify(next));
        return next;
      });
      triggerToast(`🎉 ${name} just joined your squad!`);
    }, 3000);

    setInviteEmail('');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText('https://nutrisync.app/invite/' + userName.replace(/\s+/g, '').toLowerCase());
    triggerToast('📋 Invite link copied to clipboard!');
    
    // Simulate someone joining from the link shortly after
    setTimeout(() => {
      const names = ['Alex', 'Jordan', 'Taylor', 'Casey'];
      const randomName = names[Math.floor(Math.random() * names.length)];
      const newFriend = {
        name: randomName,
        avatar: randomName.substring(0, 2).toUpperCase(),
        weeklySteps: Math.floor(Math.random() * (40000 - 15000) + 15000),
        isUser: false,
        streak: `🔥 1 days`
      };
      setCustomFriends(prev => {
        const next = [...prev, newFriend];
        localStorage.setItem('nts-community-friends', JSON.stringify(next));
        return next;
      });
      triggerToast(`🎉 ${randomName} just joined your squad via your link!`);
    }, 6000);
  };

  const weeklySteps = userSteps > 0 ? (userSteps * 4.2) : 38400;
  const monthlySteps = userSteps > 0 ? (userSteps * 18.5) : 156000;

  const baseToday = [
    { name: 'Sarah Chen', avatar: 'SC', steps: 11200, isUser: false, streak: '🔥 14 days' },
    { name: userName, avatar: userInitial, steps: userSteps, isUser: true, streak: '🔥 5 days' },
    { name: 'Marcus Johnson', avatar: 'MJ', steps: 7850, isUser: false, streak: '🔥 8 days' },
    { name: 'Emma Davis', avatar: 'ED', steps: 6920, isUser: false, streak: '🔥 3 days' },
    { name: 'Alex Rivera', avatar: 'AR', steps: 5400, isUser: false, streak: '🔥 1 day' }
  ];
  const baseWeek = [
    { name: 'Sarah Chen', avatar: 'SC', steps: 52400, isUser: false, streak: '🔥 14 days' },
    { name: userName, avatar: userInitial, steps: Math.round(weeklySteps), isUser: true, streak: '🔥 5 days' },
    { name: 'Marcus Johnson', avatar: 'MJ', steps: 41800, isUser: false, streak: '🔥 8 days' },
    { name: 'Emma Davis', avatar: 'ED', steps: 36200, isUser: false, streak: '🔥 3 days' },
    { name: 'Alex Rivera', avatar: 'AR', steps: 29500, isUser: false, streak: '🔥 1 day' }
  ];
  const baseMonth = [
    { name: 'Sarah Chen', avatar: 'SC', steps: 215000, isUser: false, streak: '🔥 14 days' },
    { name: 'Marcus Johnson', avatar: 'MJ', steps: 182000, isUser: false, streak: '🔥 8 days' },
    { name: userName, avatar: userInitial, steps: Math.round(monthlySteps), isUser: true, streak: '🔥 5 days' },
    { name: 'Emma Davis', avatar: 'ED', steps: 148000, isUser: false, streak: '🔥 3 days' },
    { name: 'Alex Rivera', avatar: 'AR', steps: 119000, isUser: false, streak: '🔥 1 day' }
  ];

  const customToday = customFriends.map(f => ({ ...f, steps: Math.round(f.weeklySteps / 4.2) }));
  const customWeek = customFriends.map(f => ({ ...f, steps: f.weeklySteps }));
  const customMonth = customFriends.map(f => ({ ...f, steps: Math.round(f.weeklySteps * 4.2) }));

  const rawLeaderboards = {
    today: [...baseToday, ...customToday],
    week: [...baseWeek, ...customWeek],
    month: [...baseMonth, ...customMonth]
  };

  const currentLeaderboard = rawLeaderboards[leaderboardFilter].sort((a, b) => b.steps - a.steps);

  const handleNudgeFriend = (friendName) => {
    triggerToast(`👏 You high-fived and nudged ${friendName}!`);
  };

  /* -----------------------------------------------------------
   * 4. ACHIEVEMENTS & REAL UNLOCKED BADGES
   * ----------------------------------------------------------- */
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    let firstScanUnlocked = false;
    try {
      const meals = JSON.parse(localStorage.getItem('nts-meals') || '[]');
      if (meals.length > 0) firstScanUnlocked = true;
    } catch { firstScanUnlocked = false; }

    let hydrationUnlocked = false;
    try {
      const today = new Date().toISOString().split('T')[0];
      const log = JSON.parse(localStorage.getItem('nts-log') || '{}');
      const todayLog = log[today] || { water: 0 };
      if (todayLog.water > 4) hydrationUnlocked = true;
    } catch { hydrationUnlocked = false; }

    let workoutUnlocked = false;
    try {
      const workouts = JSON.parse(localStorage.getItem('nts-workout-history') || '[]');
      if (workouts.length > 0) workoutUnlocked = true;
    } catch { workoutUnlocked = false; }

    setBadges([
      { id: 'first-scan', name: 'First Scan', description: 'Log your first meal using the Scanner', icon: Camera, unlocked: firstScanUnlocked, color: 'text-blue-500', bg: 'bg-blue-100', progress: firstScanUnlocked ? '1/1' : '0/1' },
      { id: 'hydration', name: 'Hydration Hero', description: 'Drink >4 glasses of water in a single day', icon: Droplet, unlocked: hydrationUnlocked, color: 'text-cyan-500', bg: 'bg-cyan-100', progress: hydrationUnlocked ? '1/1' : '0/1' },
      { id: 'workout', name: 'Workout Warrior', description: 'Complete and record your first workout session', icon: Flame, unlocked: workoutUnlocked, color: 'text-orange-500', bg: 'bg-orange-100', progress: workoutUnlocked ? '1/1' : '0/1' },
      { id: 'perfect-week', name: '7-Day Streak', description: 'Hit your daily calorie target for 7 consecutive days', icon: Star, unlocked: false, color: 'text-amber-500', bg: 'bg-amber-100', progress: '3/7 days' },
      { id: 'early-bird', name: 'Early Bird', description: 'Log activity or workout before 7:00 AM', icon: Sunrise, unlocked: false, color: 'text-emerald-500', bg: 'bg-emerald-100', progress: '0/1' },
      { id: 'social-champ', name: 'Community Pioneer', description: 'Post an update or cheer a squad member', icon: Users, unlocked: posts.length > defaultPosts.length, color: 'text-purple-500', bg: 'bg-purple-100', progress: 'Unlocked' }
    ]);
  }, [posts.length]);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-20">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-50 bg-ink-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 font-bold text-sm border border-white/20"
          >
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-2">
        <div>
          <h1 className="text-3xl font-extrabold text-ink-900 tracking-tight">Health Circle & Community</h1>
          <p className="text-sm font-medium text-ink-500 mt-1">Connect, cheer friends, take challenges, and level up together.</p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex p-1 bg-white/60 backdrop-blur-xl border border-white/80 rounded-2xl shadow-sm">
          <button
            onClick={() => setActiveTab('feed')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'feed'
                ? 'bg-ink-900 text-white shadow-sm'
                : 'text-ink-500 hover:text-ink-900 hover:bg-white/50'
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Live Pulse</span>
          </button>

          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'leaderboard'
                ? 'bg-ink-900 text-white shadow-sm'
                : 'text-ink-500 hover:text-ink-900 hover:bg-white/50'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Leaderboard</span>
          </button>

          <button
            onClick={() => setActiveTab('challenges')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'challenges'
                ? 'bg-ink-900 text-white shadow-sm'
                : 'text-ink-500 hover:text-ink-900 hover:bg-white/50'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            <span>Challenges</span>
          </button>

          <button
            onClick={() => setActiveTab('badges')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'badges'
                ? 'bg-ink-900 text-white shadow-sm'
                : 'text-ink-500 hover:text-ink-900 hover:bg-white/50'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-blue-400" />
            <span>Badges</span>
          </button>
        </div>
      </div>

      {/* =========================================================
       * TAB 1: LIVE COMMUNITY FEED & ACTIVITY PULSE
       * ========================================================= */}
      {activeTab === 'feed' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Feed Column */}
          <div className="lg:col-span-8 space-y-6">
            {/* Interactive Post Creator */}
            <GlassCard className="p-6">
              <form onSubmit={handleCreatePost} className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-white font-bold flex items-center justify-center shrink-0 shadow-sm">
                    {userInitial}
                  </div>
                  <textarea
                    rows={2}
                    value={newPostContent}
                    onChange={e => setNewPostContent(e.target.value)}
                    placeholder="Share a milestone, workout, or healthy meal with your squad..."
                    className="w-full bg-ink-900/5 rounded-2xl p-3 text-sm font-medium text-ink-900 placeholder:text-ink-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/40 border border-transparent transition-all"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-ink-900/5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-ink-400">Tag:</span>
                    {['#Workout', '#Nutrition', '#Hydration', '#Milestone'].map(tag => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => setNewPostTag(tag)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                          newPostTag === tag
                            ? 'bg-emerald-500 text-white shadow-sm'
                            : 'bg-ink-900/5 text-ink-500 hover:bg-ink-900/10'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>

                  <button
                    type="submit"
                    disabled={!newPostContent.trim()}
                    className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm shadow-emerald-500/20 active:scale-95 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Post Update</span>
                  </button>
                </div>
              </form>
            </GlassCard>

            {/* Posts Stream */}
            <div className="space-y-4">
              {posts.map((post) => (
                <GlassCard key={post.id} className="p-6">
                  {/* Post Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-2xl ${post.avatarBg || 'bg-emerald-500'} text-white font-bold flex items-center justify-center shrink-0 shadow-sm`}>
                        {post.avatar}
                      </div>
                      <div>
                        <h4 className="font-bold text-ink-900 text-sm">{post.author}</h4>
                        <div className="flex items-center gap-2 text-[11px] font-semibold text-ink-400">
                          <span>{post.time}</span>
                          <span>•</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${post.tagColor}`}>
                            {post.tag}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Post Content */}
                  <p className="text-ink-800 text-sm font-medium leading-relaxed mb-4">
                    {post.content}
                  </p>

                  {/* Actions (Like & Comments trigger) */}
                  <div className="flex items-center gap-4 pt-3 border-t border-ink-900/5 text-ink-500">
                    <button
                      type="button"
                      onClick={() => handleToggleLike(post.id)}
                      className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${
                        post.liked ? 'text-rose-500' : 'hover:text-rose-500'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${post.liked ? 'fill-rose-500 text-rose-500' : ''}`} />
                      <span>{post.likes} Cheers</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)}
                      className="flex items-center gap-1.5 text-xs font-bold hover:text-ink-900 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>{post.comments.length} Comments</span>
                    </button>
                  </div>

                  {/* Comments Section */}
                  {(post.comments.length > 0 || activeCommentPostId === post.id) && (
                    <div className="mt-4 pt-4 border-t border-ink-900/5 space-y-3">
                      {post.comments.map(c => (
                        <div key={c.id} className="bg-ink-900/5 rounded-xl p-3 text-xs">
                          <span className="font-bold text-ink-900 mr-2">{c.author}:</span>
                          <span className="text-ink-700 font-medium">{c.text}</span>
                        </div>
                      ))}

                      {/* Add comment box */}
                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="text"
                          value={commentInputs[post.id] || ''}
                          onChange={e => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                          onKeyDown={e => { if (e.key === 'Enter') handleAddComment(post.id); }}
                          placeholder="Write a supportive comment..."
                          className="flex-1 bg-white/80 rounded-xl px-3 py-2 text-xs font-medium border border-ink-900/10 focus:outline-none focus:border-emerald-500"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddComment(post.id)}
                          className="px-3 py-2 rounded-xl bg-ink-900 text-white text-xs font-bold hover:bg-ink-800 transition-colors"
                        >
                          Send
                        </button>
                      </div>
                    </div>
                  )}
                </GlassCard>
              ))}
            </div>
          </div>

          {/* Right Column: Mini Leaderboard & Active Challenges Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Quick Leaderboard Snapshot */}
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  <h3 className="font-bold text-ink-900 text-sm">Top Steppers This Week</h3>
                </div>
                <button 
                  onClick={() => setActiveTab('leaderboard')} 
                  className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-0.5"
                >
                  View All <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-3">
                {currentLeaderboard.slice(0, 3).map((item, idx) => (
                  <div key={item.name} className={`flex items-center justify-between p-3 rounded-2xl ${item.isUser ? 'bg-emerald-50/70 border border-emerald-200' : 'bg-ink-900/5'}`}>
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 text-xs font-extrabold text-ink-400">#{idx + 1}</span>
                      <div className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center font-bold text-xs text-ink-800">
                        {item.avatar}
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-ink-900">{item.name} {item.isUser && '(You)'}</span>
                        <span className="text-[10px] text-ink-400 font-semibold">{item.streak}</span>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold text-ink-900">{item.steps.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Quick Active Challenge Snippet */}
            <GlassCard className="p-6 bg-gradient-to-br from-orange-50/40 to-amber-50/40">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-orange-700 uppercase tracking-wider">Squad Sprint</span>
                <span className="text-[10px] font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">2 Days Left</span>
              </div>
              <h4 className="font-bold text-ink-900 text-base mb-1">Weekend 20k Step Dash</h4>
              <p className="text-xs text-ink-500 font-medium mb-4">48 members sprinting toward the 20k milestone.</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-ink-600">Your Progress</span>
                  <span className="text-orange-600">14,200 / 20,000</span>
                </div>
                <div className="w-full h-2 bg-ink-900/10 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 rounded-full" style={{ width: '71%' }} />
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleAddChallengeProgress(1)}
                className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm shadow-orange-500/20"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>+1,000 Steps Progress</span>
              </button>
            </GlassCard>

            <GlassCard className="p-6">
              <h3 className="font-bold text-ink-900 text-base mb-2">Invite Friends</h3>
              <p className="text-xs text-ink-500 font-medium mb-4">Add friends to your squad to see them on your leaderboard.</p>
              
              <form onSubmit={handleInviteFriend} className="flex flex-col gap-3 mb-4">
                <input 
                  type="email" 
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="friend@example.com" 
                  className="bg-white/80 border border-ink-900/10 text-xs font-semibold text-ink-900 flex-1 outline-none px-4 py-2.5 rounded-xl focus:border-emerald-500 transition-colors"
                />
                <button
                  type="submit"
                  disabled={!inviteEmail.trim()}
                  className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors w-full"
                >
                  <UserPlus className="w-4 h-4" />
                  Send Invite
                </button>
              </form>
              
              <div className="relative mt-2">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-ink-900/10"></div>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase font-bold text-ink-400">
                  <span className="bg-white/60 px-2">Or share link</span>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-ink-900/5 p-2 rounded-xl mt-3">
                <input 
                  type="text" 
                  readOnly 
                  value={`https://nutrisync.app/invite/${userName.replace(/\s+/g, '').toLowerCase()}`}
                  className="bg-transparent text-[11px] font-semibold text-ink-700 flex-1 outline-none px-2 truncate"
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-3 py-1.5 bg-ink-900 text-white text-[10px] font-bold rounded-lg hover:bg-ink-800 transition-colors"
                >
                  Copy
                </button>
              </div>
            </GlassCard>

            {suggestedFriends.length > 0 && (
              <GlassCard className="p-6">
                <h3 className="font-bold text-ink-900 text-base mb-3">Suggested Friends</h3>
                <div className="space-y-3">
                  {suggestedFriends.map(friend => (
                    <div key={friend.name} className="flex items-center justify-between p-3 bg-white/50 border border-white/60 rounded-2xl">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-700 font-bold flex items-center justify-center text-xs">
                          {friend.avatar}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-ink-900">{friend.name}</p>
                          <p className="text-[10px] font-semibold text-ink-500">NutriSync Member</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleAddSuggestedFriend(friend)}
                        className="p-2 rounded-xl bg-ink-900/5 hover:bg-emerald-50 hover:text-emerald-700 text-ink-600 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </GlassCard>
            )}
          </div>
        </div>
      )}

      {/* =========================================================
       * TAB 2: INTERACTIVE LEADERBOARDS & NUDGING
       * ========================================================= */}
      {activeTab === 'leaderboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <GlassCard className="p-6 md:p-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-ink-900">Community Leaderboard</h3>
                  <p className="text-xs font-semibold text-ink-400">Compete with friends & maintain streaks</p>
                </div>

                {/* Filter Pills */}
                <div className="flex p-1 bg-ink-900/5 rounded-xl">
                  {['today', 'week', 'month'].map(f => (
                    <button
                      key={f}
                      onClick={() => setLeaderboardFilter(f)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                        leaderboardFilter === f
                          ? 'bg-white text-ink-900 shadow-sm'
                          : 'text-ink-500 hover:text-ink-900'
                      }`}
                    >
                      {f === 'today' ? 'Today' : f === 'week' ? 'This Week' : 'This Month'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ranks list */}
              <div className="space-y-3">
                {currentLeaderboard.map((person, index) => (
                  <motion.div 
                    key={person.name}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                      person.isUser 
                        ? 'bg-emerald-50/80 border-emerald-200 shadow-sm' 
                        : 'bg-white/50 border-white/60 hover:bg-white/80'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="flex items-center justify-center w-8 font-extrabold text-sm">
                        {index === 0 ? <Medal className="w-6 h-6 text-amber-500 drop-shadow-sm" /> :
                         index === 1 ? <Medal className="w-6 h-6 text-slate-400" /> :
                         index === 2 ? <Medal className="w-6 h-6 text-amber-700" /> :
                         <span className="text-ink-400">#{index + 1}</span>}
                      </div>

                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm shadow-sm ${
                        person.isUser ? 'bg-emerald-500 text-white' : 'bg-white text-ink-800'
                      }`}>
                        {person.avatar}
                      </div>

                      <div>
                        <div className={`font-bold text-sm ${person.isUser ? 'text-emerald-800' : 'text-ink-900'}`}>
                          {person.name} {person.isUser && <span className="text-xs font-bold text-emerald-600">(You)</span>}
                        </div>
                        <div className="text-[11px] font-semibold text-ink-400">
                          {person.streak}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="block font-extrabold text-ink-900 text-base">{person.steps.toLocaleString()}</span>
                        <span className="text-[10px] font-bold text-ink-400 uppercase">steps</span>
                      </div>

                      {!person.isUser && (
                        <button
                          type="button"
                          onClick={() => handleNudgeFriend(person.name)}
                          className="px-3 py-1.5 rounded-xl bg-ink-900/5 hover:bg-emerald-50 text-ink-700 hover:text-emerald-700 text-xs font-bold transition-all flex items-center gap-1 border border-ink-900/5"
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span>Cheer</span>
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <GlassCard className="p-6">
              <h3 className="font-bold text-ink-900 text-base mb-2">Invite Friends</h3>
              <p className="text-xs text-ink-500 font-medium mb-4">Add friends to your private fitness squad to see them on your leaderboard.</p>
              
              <form onSubmit={handleInviteFriend} className="flex flex-col gap-3 mb-4">
                <input 
                  type="email" 
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="friend@example.com" 
                  className="bg-white/80 border border-ink-900/10 text-xs font-semibold text-ink-900 flex-1 outline-none px-4 py-2.5 rounded-xl focus:border-emerald-500 transition-colors"
                />
                <button
                  type="submit"
                  disabled={!inviteEmail.trim()}
                  className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors w-full"
                >
                  <UserPlus className="w-4 h-4" />
                  Send Invite
                </button>
              </form>
              
              <div className="relative mb-4">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-ink-900/10"></div>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase font-bold text-ink-400">
                  <span className="bg-white/60 px-2">Or share link</span>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-ink-900/5 p-2 rounded-xl mb-4">
                <input 
                  type="text" 
                  readOnly 
                  value={`https://nutrisync.app/invite/${userName.replace(/\s+/g, '').toLowerCase()}`}
                  className="bg-transparent text-[11px] font-semibold text-ink-700 flex-1 outline-none px-2 truncate"
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-3 py-1.5 bg-ink-900 text-white text-[10px] font-bold rounded-lg hover:bg-ink-800 transition-colors"
                >
                  Copy
                </button>
              </div>

              <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100 flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="text-xs font-medium text-emerald-900 leading-snug">
                  Friends who train together are <strong>65% more likely</strong> to reach their target weight!
                </span>
              </div>
            </GlassCard>

            {suggestedFriends.length > 0 && (
              <GlassCard className="p-6">
                <h3 className="font-bold text-ink-900 text-base mb-3">Suggested Friends</h3>
                <div className="space-y-3">
                  {suggestedFriends.map(friend => (
                    <div key={friend.name} className="flex items-center justify-between p-3 bg-white/50 border border-white/60 rounded-2xl">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-700 font-bold flex items-center justify-center text-xs">
                          {friend.avatar}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-ink-900">{friend.name}</p>
                          <p className="text-[10px] font-semibold text-ink-500">NutriSync Member</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleAddSuggestedFriend(friend)}
                        className="p-2 rounded-xl bg-ink-900/5 hover:bg-emerald-50 hover:text-emerald-700 text-ink-600 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </GlassCard>
            )}
          </div>
        </div>
      )}

      {/* =========================================================
       * TAB 3: ACTIVE CHALLENGES & SQUAD GOALS
       * ========================================================= */}
      {activeTab === 'challenges' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center px-1">
            <div>
              <h3 className="text-xl font-bold text-ink-900">Active Squad Challenges</h3>
              <p className="text-xs font-semibold text-ink-400">Join multi-day challenges, log daily milestones, and claim rewards.</p>
            </div>
            <button
              type="button"
              onClick={() => setShowNewChallengeModal(true)}
              className="px-4 py-2 bg-ink-900 hover:bg-ink-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Challenge</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.map((challenge, idx) => {
              const percent = Math.min(100, Math.round((challenge.progress / challenge.target) * 100));
              return (
                <GlassCard key={challenge.id} className="p-6 flex flex-col justify-between" delay={idx * 0.08}>
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2.5 py-0.5 rounded-full">
                        {challenge.daysLeft} days left
                      </span>
                      <span className="text-xs font-bold text-ink-400 flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" /> {challenge.participants}
                      </span>
                    </div>

                    <h4 className="font-bold text-ink-900 text-lg mb-1">{challenge.name}</h4>
                    <p className="text-xs text-ink-500 font-medium leading-relaxed mb-6">
                      {challenge.desc}
                    </p>

                    {/* Progress Bar */}
                    <div className="space-y-2 mb-6">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-ink-600">Your Progress</span>
                        <span className="text-ink-900 font-extrabold">
                          {challenge.progress.toLocaleString()} / {challenge.target.toLocaleString()} {challenge.unit}
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-ink-900/10 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percent}%` }}
                          transition={{ duration: 0.8 }}
                          className={`h-full rounded-full ${percent >= 100 ? 'bg-emerald-500' : 'bg-orange-500'}`}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] font-semibold text-ink-400 pt-0.5">
                        <span>Reward: {challenge.reward}</span>
                        <span>{percent}% Complete</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2 border-t border-ink-900/5">
                    {challenge.joined ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleAddChallengeProgress(challenge.id)}
                          className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-500/20"
                        >
                          <Zap className="w-3.5 h-3.5" />
                          <span>+ Log Progress</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleJoinChallenge(challenge.id)}
                          className="px-3 py-2.5 bg-ink-900/5 hover:bg-rose-50 hover:text-rose-600 text-ink-500 rounded-xl text-xs font-bold transition-colors"
                          title="Leave Challenge"
                        >
                          Leave
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleToggleJoinChallenge(challenge.id)}
                        className="w-full py-2.5 bg-ink-900 hover:bg-ink-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Join Challenge</span>
                      </button>
                    )}
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================
       * TAB 4: ACHIEVEMENTS & INTERACTIVE BADGES
       * ========================================================= */}
      {activeTab === 'badges' && (
        <div className="space-y-6">
          <div className="px-1">
            <h3 className="text-xl font-bold text-ink-900">Achievements & Milestone Badges</h3>
            <p className="text-xs font-semibold text-ink-400">Click any badge to view unlocking criteria and track your real-time milestone progress.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {badges.map((badge, idx) => {
              const Icon = badge.icon;
              return (
                <GlassCard 
                  key={badge.id}
                  delay={idx * 0.05}
                  className={`p-6 cursor-pointer transition-all hover:scale-[1.01] ${
                    badge.unlocked ? 'bg-white/70 border-white shadow-sm' : 'opacity-70 bg-white/40'
                  }`}
                  onClick={() => setSelectedBadge(badge)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${
                      badge.unlocked ? badge.bg : 'bg-ink-100'
                    }`}>
                      <Icon className={`w-7 h-7 ${badge.unlocked ? badge.color : 'text-ink-400'}`} />
                    </div>

                    {badge.unlocked ? (
                      <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-extrabold rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Unlocked
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 bg-ink-100 text-ink-400 text-[10px] font-bold rounded-full flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Locked
                      </span>
                    )}
                  </div>

                  <h4 className="font-bold text-ink-900 text-base mb-1">{badge.name}</h4>
                  <p className="text-xs text-ink-500 font-medium leading-snug mb-4">
                    {badge.description}
                  </p>

                  <div className="flex justify-between items-center pt-3 border-t border-ink-900/5 text-xs font-semibold">
                    <span className="text-ink-400">Progress:</span>
                    <span className={`font-bold ${badge.unlocked ? 'text-emerald-600' : 'text-ink-700'}`}>
                      {badge.progress}
                    </span>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================
       * MODAL: CREATE NEW CHALLENGE
       * ========================================================= */}
      <AnimatePresence>
        {showNewChallengeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/40 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 relative border border-white"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-ink-900">Create Squad Challenge</h3>
                <button
                  onClick={() => setShowNewChallengeModal(false)}
                  className="p-2 hover:bg-ink-100 rounded-full text-ink-400 hover:text-ink-900 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateChallenge} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-ink-600 uppercase mb-1">Challenge Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 50k Step Marathon, 100 Pushups/Day"
                    value={newChallengeForm.name}
                    onChange={e => setNewChallengeForm({ ...newChallengeForm, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-ink-900/10 text-sm font-medium focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink-600 uppercase mb-1">Description</label>
                  <textarea
                    rows={2}
                    placeholder="Short motivating description for participants..."
                    value={newChallengeForm.desc}
                    onChange={e => setNewChallengeForm({ ...newChallengeForm, desc: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-ink-900/10 text-sm font-medium focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-ink-600 uppercase mb-1">Target Number</label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={newChallengeForm.target}
                      onChange={e => setNewChallengeForm({ ...newChallengeForm, target: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 rounded-xl border border-ink-900/10 text-sm font-bold focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-ink-600 uppercase mb-1">Unit</label>
                    <select
                      value={newChallengeForm.unit}
                      onChange={e => setNewChallengeForm({ ...newChallengeForm, unit: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-ink-900/10 text-sm font-bold bg-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="steps">Steps</option>
                      <option value="days">Days</option>
                      <option value="workouts">Workouts</option>
                      <option value="liters">Liters</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-sm transition-all shadow-md shadow-emerald-500/20"
                >
                  Launch Challenge
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =========================================================
       * MODAL: BADGE INSPECTION & DETAIL
       * ========================================================= */}
      <AnimatePresence>
        {selectedBadge && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/40 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 text-center relative border border-white"
            >
              <button
                onClick={() => setSelectedBadge(null)}
                className="absolute top-4 right-4 p-2 hover:bg-ink-100 rounded-full text-ink-400 hover:text-ink-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center mb-4 shadow-sm ${
                selectedBadge.unlocked ? selectedBadge.bg : 'bg-ink-100'
              }`}>
                <selectedBadge.icon className={`w-10 h-10 ${selectedBadge.unlocked ? selectedBadge.color : 'text-ink-400'}`} />
              </div>

              <h3 className="text-xl font-bold text-ink-900 mb-1">{selectedBadge.name}</h3>
              <p className="text-xs text-ink-500 font-medium leading-relaxed mb-6">
                {selectedBadge.description}
              </p>

              <div className="p-4 rounded-2xl bg-ink-900/5 mb-6 text-left space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-ink-500">Status</span>
                  <span className={selectedBadge.unlocked ? 'text-emerald-600 font-extrabold' : 'text-ink-700'}>
                    {selectedBadge.unlocked ? '✅ Unlocked & Verified' : '🔒 In Progress'}
                  </span>
                </div>
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-ink-500">Current Progress</span>
                  <span className="text-ink-900">{selectedBadge.progress}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedBadge(null)}
                className="w-full py-2.5 bg-ink-900 text-white rounded-xl font-bold text-xs hover:bg-ink-800 transition-colors"
              >
                Got It!
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
