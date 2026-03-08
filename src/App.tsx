/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Layout, 
  Search, 
  User, 
  BookOpen, 
  Target, 
  Briefcase, 
  Info, 
  LogOut, 
  Menu, 
  X, 
  ChevronRight, 
  Github, 
  Linkedin, 
  Twitter, 
  Instagram,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  ExternalLink,
  MapPin,
  Mail,
  Send,
  ArrowRight,
  Award,
  Clock,
  TrendingUp,
  FileText,
  MessageSquare,
  Shield,
  Database,
  Code,
  Globe,
  Smartphone,
  Cpu,
  Cloud,
  BarChart3
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  signInAnonymously,
  signInWithPopup,
  GoogleAuthProvider,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  onSnapshot, 
  collection, 
  addDoc, 
  deleteDoc, 
  query, 
  orderBy
} from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from './firebase';
import { CAREER_DIRECTORY, QUIZ_QUESTIONS, BLOG_POSTS, JobProfile } from './data';

// --- Types ---

type View = 'home' | 'auth' | 'quiz' | 'results' | 'dashboard' | 'directory' | 'profile' | 'blog' | 'about';

interface UserProfile {
  fullName: string;
  username: string;
  education: string;
  country: string;
  matchedJobId?: string;
  milestones: Record<string, boolean>;
  cvLink?: string;
  socialLinks?: { platform: string; url: string }[];
  documents?: { title: string; url: string }[];
  points?: number;
  badges?: string[];
}

interface Todo {
  id: string;
  text: string;
  priority: 'High' | 'Medium' | 'Low';
  completed: boolean;
  createdAt: any;
}

interface Application {
  id: string;
  company: string;
  role: string;
  status: 'Applied' | 'Interview' | 'Offer' | 'Rejected';
}

// --- Components ---

function LazyImage({ src, alt, className, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '50px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className={`relative overflow-hidden bg-slate-200 ${className}`} ref={imgRef}>
      {isInView && (
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setIsLoaded(true)}
          {...props}
        />
      )}
    </div>
  );
}

export default function App() {
  const [view, setView] = useState<View>('home');
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const docRef = doc(db, 'users', u.uid);
        const docSnap = await getDoc(docRef);
        
        let finalJobId = '';
        const pendingJobId = localStorage.getItem('pendingJobId');
        if (pendingJobId) {
          finalJobId = pendingJobId;
        }

        if (docSnap.exists()) {
          const data = docSnap.data() as UserProfile;
          if (finalJobId) {
            data.matchedJobId = finalJobId;
            await updateDoc(docRef, { matchedJobId: finalJobId });
          }
          setProfile(data);
        } else {
          // Initialize profile for anonymous or new users
          const initialProfile: UserProfile = {
            fullName: u.isAnonymous ? 'Guest User' : (u.displayName || ''),
            username: u.isAnonymous ? 'guest' : (u.email?.split('@')[0] || ''),
            education: '',
            country: '',
            matchedJobId: finalJobId || undefined,
            milestones: {
              discovery: false,
              skills: false,
              projects: false,
              docs: false,
              apply: false,
              hired: false
            }
          };
          await setDoc(docRef, initialProfile);
          setProfile(initialProfile);
        }
        if (pendingJobId) localStorage.removeItem('pendingJobId');
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const navigate = (newView: View) => {
    setView(newView);
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('home');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center cursor-pointer" onClick={() => navigate('home')}>
              <div className="bg-amber-500 p-2 rounded-lg mr-2">
                <Target className="text-white h-6 w-6" />
              </div>
              <span className="text-xl font-bold font-serif text-slate-900">Your SkillGAP</span>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex space-x-8 items-center">
              <button onClick={() => navigate('home')} className={`text-sm font-medium ${view === 'home' ? 'text-amber-600' : 'text-slate-600 hover:text-amber-500'}`}>Home</button>
              <button onClick={() => navigate('directory')} className={`text-sm font-medium ${view === 'directory' ? 'text-amber-600' : 'text-slate-600 hover:text-amber-500'}`}>Careers</button>
              <button onClick={() => navigate('blog')} className={`text-sm font-medium ${view === 'blog' ? 'text-amber-600' : 'text-slate-600 hover:text-amber-500'}`}>Blog</button>
              <button onClick={() => navigate('about')} className={`text-sm font-medium ${view === 'about' ? 'text-amber-600' : 'text-slate-600 hover:text-amber-500'}`}>About</button>
              
              {user ? (
                <div className="flex items-center space-x-4">
                  <button onClick={() => navigate('dashboard')} className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors">Dashboard</button>
                  <button onClick={() => navigate('profile')} className="p-2 text-slate-600 hover:text-amber-500"><User className="h-5 w-5" /></button>
                  <button onClick={handleLogout} className="p-2 text-slate-600 hover:text-red-500"><LogOut className="h-5 w-5" /></button>
                </div>
              ) : (
                <button onClick={() => navigate('auth')} className="bg-amber-500 text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-amber-600 transition-colors shadow-lg shadow-amber-500/20">Login</button>
              )}
            </nav>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden flex items-center">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-600 p-2">
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-b border-slate-200 overflow-hidden"
            >
              <div className="px-4 pt-2 pb-6 space-y-2">
                <button onClick={() => navigate('home')} className="block w-full text-left px-3 py-2 text-base font-medium text-slate-600 hover:bg-slate-50 rounded-lg">Home</button>
                <button onClick={() => navigate('directory')} className="block w-full text-left px-3 py-2 text-base font-medium text-slate-600 hover:bg-slate-50 rounded-lg">Careers</button>
                <button onClick={() => navigate('blog')} className="block w-full text-left px-3 py-2 text-base font-medium text-slate-600 hover:bg-slate-50 rounded-lg">Blog</button>
                <button onClick={() => navigate('about')} className="block w-full text-left px-3 py-2 text-base font-medium text-slate-600 hover:bg-slate-50 rounded-lg">About</button>
                {user ? (
                  <>
                    <button onClick={() => navigate('dashboard')} className="block w-full text-left px-3 py-2 text-base font-medium text-amber-600 hover:bg-slate-50 rounded-lg">Dashboard</button>
                    <button onClick={() => navigate('profile')} className="block w-full text-left px-3 py-2 text-base font-medium text-slate-600 hover:bg-slate-50 rounded-lg">Profile</button>
                    <button onClick={handleLogout} className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:bg-slate-50 rounded-lg">Logout</button>
                  </>
                ) : (
                  <button onClick={() => navigate('auth')} className="block w-full text-center px-3 py-3 text-base font-medium bg-amber-500 text-white rounded-xl">Login / Register</button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {view === 'home' && <HomeView key="home" navigate={navigate} user={user} />}
          {view === 'auth' && <AuthView key="auth" navigate={navigate} />}
          {view === 'quiz' && <QuizView key="quiz" navigate={navigate} user={user} setProfile={setProfile} />}
          {view === 'results' && <ResultsView key="results" navigate={navigate} profile={profile} />}
          {view === 'dashboard' && <DashboardView key="dashboard" navigate={navigate} user={user} profile={profile} setProfile={setProfile} />}
          {view === 'directory' && <DirectoryView key="directory" navigate={navigate} user={user} profile={profile} setProfile={setProfile} />}
          {view === 'profile' && <ProfileView key="profile" navigate={navigate} user={user} profile={profile} setProfile={setProfile} handleLogout={handleLogout} />}
          {view === 'blog' && <BlogView key="blog" />}
          {view === 'about' && <AboutView key="about" />}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center mb-6">
                <Target className="text-amber-500 h-8 w-8 mr-2" />
                <span className="text-2xl font-bold font-serif">Your SkillGAP</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Empowering the next generation of tech leaders by bridging the gap between education and industry through personalized roadmaps.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="p-2 bg-slate-800 rounded-lg hover:bg-amber-500 transition-colors"><Linkedin className="h-5 w-5" /></a>
                <a href="#" className="p-2 bg-slate-800 rounded-lg hover:bg-amber-500 transition-colors"><Twitter className="h-5 w-5" /></a>
                <a href="#" className="p-2 bg-slate-800 rounded-lg hover:bg-amber-500 transition-colors"><Instagram className="h-5 w-5" /></a>
                <a href="#" className="p-2 bg-slate-800 rounded-lg hover:bg-amber-500 transition-colors"><Github className="h-5 w-5" /></a>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-6 font-serif">Quick Links</h4>
              <ul className="space-y-4 text-slate-400 text-sm">
                <li><button onClick={() => navigate('home')} className="hover:text-amber-500 transition-colors">Home</button></li>
                <li><button onClick={() => navigate('directory')} className="hover:text-amber-500 transition-colors">Career Directory</button></li>
                <li><button onClick={() => navigate('blog')} className="hover:text-amber-500 transition-colors">Career Blog</button></li>
                <li><button onClick={() => navigate('about')} className="hover:text-amber-500 transition-colors">About Us</button></li>
                <li><button onClick={() => navigate('auth')} className="hover:text-amber-500 transition-colors">Join Now</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-6 font-serif">Our Office</h4>
              <div className="rounded-xl overflow-hidden h-40 mb-4 border border-slate-700">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.835434509374!2d-122.4194155!3d37.7749295!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085809c6c8f4459%3A0xb10ed6d9b5050fa5!2sTwitter%20HQ!5e0!3m2!1sen!2sus!4v1633000000000!5m2!1sen!2sus" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={false} 
                  loading="lazy"
                ></iframe>
              </div>
              <div className="flex items-center text-slate-400 text-xs">
                <MapPin className="h-3 w-3 mr-1 text-amber-500" />
                <span>1355 Market St, San Francisco, CA 94103</span>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-6 font-serif">Newsletter</h4>
              <p className="text-slate-400 text-sm mb-4">Get the latest career tips and roadmap updates.</p>
              <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                <div className="relative">
                  <input 
                    type="email" 
                    placeholder="Your email" 
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                    required
                  />
                  <button type="submit" className="absolute right-2 top-2 p-1.5 bg-amber-500 rounded-lg hover:bg-amber-600 transition-colors">
                    <Send className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-[10px] text-slate-500">We respect your privacy. Unsubscribe at any time.</p>
              </form>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-slate-500 text-xs">
            <p>© 2024 Your SkillGAP. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-amber-500">Privacy Policy</a>
              <a href="#" className="hover:text-amber-500">Terms of Service</a>
              <a href="#" className="hover:text-amber-500">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// --- View Components ---

function HomeView({ navigate, user }: { navigate: (v: View) => void, user: any }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="relative"
    >
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full -z-10">
          <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[60%] bg-amber-500/10 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[60%] bg-slate-900/5 blur-[120px] rounded-full"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className="inline-block py-1 px-4 rounded-full bg-amber-100 text-amber-700 text-xs font-bold uppercase tracking-wider mb-6">
              Your Career, Personalized
            </span>
            <h1 className="text-5xl lg:text-7xl font-bold font-serif text-slate-900 mb-8 leading-tight">
              Bridge the Gap to Your <br />
              <span className="text-amber-500">Dream Tech Career</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-12 leading-relaxed">
              Identify your strengths, find your perfect role, and follow a data-driven 6-month roadmap to get hired.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <button 
                onClick={() => navigate(user ? 'quiz' : 'auth')}
                className="w-full sm:w-auto bg-slate-900 text-white px-10 py-4 rounded-2xl text-lg font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 flex items-center justify-center group"
              >
                Find Your Gap <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => navigate('directory')}
                className="w-full sm:w-auto bg-white text-slate-900 border-2 border-slate-200 px-10 py-4 rounded-2xl text-lg font-bold hover:border-amber-500 hover:text-amber-600 transition-all flex items-center justify-center"
              >
                Explore Careers
              </button>
            </div>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-24">
            {[
              { label: 'Active Learners', value: '10k+', icon: User },
              { label: 'Job Profiles', value: '50+', icon: Briefcase },
              { label: 'Success Rate', value: '94%', icon: Award },
              { label: 'Free Resources', value: '500+', icon: BookOpen },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + (i * 0.1) }}
                className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm"
              >
                <div className="bg-amber-50 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="text-amber-600 h-6 w-6" />
                </div>
                <div className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</div>
                <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold font-serif mb-6">How It Works</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Our platform guides you through every step of your career transition with precision and care.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: 'The Quiz', desc: 'Our intelligent assessment matches your personality and interests with high-demand tech roles.', icon: Target },
              { title: 'The Roadmap', desc: 'Get a personalized 6-month "Heartbeat" roadmap with clear milestones and progress tracking.', icon: TrendingUp },
              { title: 'The Resources', desc: 'Access curated free learning paths, project ideas, and interview guides for your specific role.', icon: BookOpen },
            ].map((feature, i) => (
              <div key={i} className="relative group">
                <div className="mb-8 bg-slate-800 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:bg-amber-500 transition-colors duration-300">
                  <feature.icon className="h-8 w-8 text-amber-500 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-2xl font-bold mb-4 font-serif">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
}

function AuthView({ navigate }: { navigate: (v: View) => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [education, setEducation] = useState('BSc');
  const [country, setCountry] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      let finalJobId = '';
      const pendingJobId = localStorage.getItem('pendingJobId');
      if (pendingJobId) {
        finalJobId = pendingJobId;
      }

      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        if (finalJobId) {
          const userRef = doc(db, 'users', auth.currentUser!.uid);
          await updateDoc(userRef, { matchedJobId: finalJobId });
        }
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await setDoc(doc(db, 'users', user.uid), {
          fullName,
          username,
          education,
          country,
          matchedJobId: finalJobId || undefined,
          milestones: {
            discovery: false,
            skills: false,
            projects: false,
            docs: false,
            apply: false,
            hired: false
          }
        });
      }
      if (pendingJobId) localStorage.removeItem('pendingJobId');
      navigate('dashboard');
    } catch (err: any) {
      if (isLogin && (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password')) {
        setError("Register first, you don't have any account.");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGuest = async () => {
    setLoading(true);
    try {
      await signInAnonymously(auth);
      navigate('dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      let finalJobId = '';
      const pendingJobId = localStorage.getItem('pendingJobId');
      if (pendingJobId) {
        finalJobId = pendingJobId;
      }

      const userRef = doc(db, 'users', result.user.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          fullName: result.user.displayName || '',
          username: result.user.email?.split('@')[0] || '',
          education: '',
          country: '',
          matchedJobId: finalJobId || undefined,
          milestones: {
            discovery: false,
            skills: false,
            projects: false,
            docs: false,
            apply: false,
            hired: false
          }
        });
      } else if (finalJobId) {
        await updateDoc(userRef, { matchedJobId: finalJobId });
      }
      if (pendingJobId) localStorage.removeItem('pendingJobId');
      navigate('dashboard');
    } catch (err: any) {
      if (err.message.includes('invalid request') || err.code === 'auth/popup-closed-by-user' || err.code === 'auth/unauthorized-domain') {
        setError("Google login is currently unavailable in this preview environment. Please use email/password or continue as guest.");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -20 }}
      className="max-w-md mx-auto my-20 px-4"
    >
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold font-serif text-slate-900 mb-2">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p className="text-slate-500 text-sm">{isLogin ? 'Login to track your progress' : 'Start your career journey today'}</p>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs mb-6 border border-red-100">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-amber-500"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
                <input 
                  type="text" 
                  placeholder="Username" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-amber-500"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <select 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-amber-500"
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                >
                  <option value="12th">12th Grade</option>
                  <option value="BSc">BSc</option>
                  <option value="MSc">MSc</option>
                  <option value="PhD">PhD</option>
                </select>
                <input 
                  type="text" 
                  placeholder="Country" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-amber-500"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
                />
              </div>
            </>
          )}
          <input 
            type="email" 
            placeholder="Email Address" 
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-amber-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-amber-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 disabled:opacity-50"
          >
            {loading ? 'Processing...' : (isLogin ? 'Login' : 'Register')}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-center space-x-2 text-xs text-slate-500">
          <span>{isLogin ? "Don't have an account?" : "Already have an account?"}</span>
          <button onClick={() => setIsLogin(!isLogin)} className="text-amber-600 font-bold hover:underline">
            {isLogin ? 'Register Now' : 'Login Now'}
          </button>
        </div>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-400">Or</span></div>
        </div>

        <div className="space-y-3">
          <button 
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full bg-white text-slate-700 border border-slate-200 py-3 rounded-2xl font-medium hover:bg-slate-50 transition-all flex items-center justify-center shadow-sm"
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          <button 
            onClick={handleGuest}
            disabled={loading}
            className="w-full bg-white text-slate-600 border border-slate-200 py-3 rounded-2xl font-medium hover:bg-slate-50 transition-all flex items-center justify-center"
          >
            Continue as Guest
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// --- Quiz, Results, Directory Views ---

function QuizView({ navigate, user, setProfile }: { navigate: (v: View) => void, user: any, setProfile: any }) {
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState({ dev: 0, data: 0, ops: 0 });

  const handleAnswer = async (category: string) => {
    const newScores = { ...scores, [category]: scores[category as keyof typeof scores] + 1 };
    setScores(newScores);

    if (step < QUIZ_QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      // Calculate result
      let matchedId = 'frontend-dev';
      if (newScores.data > newScores.dev && newScores.data > newScores.ops) matchedId = 'data-analyst';
      if (newScores.ops > newScores.dev && newScores.ops > newScores.data) matchedId = 'devops-engineer';
      
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, { matchedJobId: matchedId });
        const snap = await getDoc(userRef);
        setProfile(snap.data() as UserProfile);
      }
      navigate('results');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} 
      animate={{ opacity: 1, scale: 1 }} 
      className="max-w-2xl mx-auto my-20 px-4"
    >
      <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">Step {step + 1} of {QUIZ_QUESTIONS.length}</span>
            <span className="text-xs font-medium text-slate-400">{Math.round(((step + 1) / QUIZ_QUESTIONS.length) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${((step + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
              className="bg-amber-500 h-full"
            ></motion.div>
          </div>
        </div>

        <h2 className="text-3xl font-bold font-serif text-slate-900 mb-8">{QUIZ_QUESTIONS[step].question}</h2>

        <div className="space-y-4">
          {QUIZ_QUESTIONS[step].options.map((option, i) => (
            <button 
              key={i}
              onClick={() => handleAnswer(option.category)}
              className="w-full text-left p-6 rounded-2xl border-2 border-slate-100 hover:border-amber-500 hover:bg-amber-50 transition-all group flex justify-between items-center"
            >
              <span className="text-lg font-medium text-slate-700 group-hover:text-amber-700">{option.text}</span>
              <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function ResultsView({ navigate, profile }: { navigate: (v: View) => void, profile: UserProfile | null }) {
  const job = useMemo(() => {
    return CAREER_DIRECTORY.find(j => j.id === profile?.matchedJobId) || CAREER_DIRECTORY[0];
  }, [profile]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="max-w-4xl mx-auto my-20 px-4 text-center"
    >
      <div className="bg-white p-12 rounded-3xl shadow-2xl border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-amber-500"></div>
        
        <div className="mb-8 inline-flex items-center justify-center w-20 h-20 bg-amber-100 rounded-full">
          <Award className="h-10 w-10 text-amber-600" />
        </div>
        
        <h2 className="text-sm font-bold text-amber-600 uppercase tracking-[0.2em] mb-4">Your Perfect Match</h2>
        <h1 className="text-5xl font-bold font-serif text-slate-900 mb-6">{job.title}</h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          {job.description}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <TrendingUp className="h-6 w-6 text-amber-600 mx-auto mb-3" />
            <div className="text-sm text-slate-500 mb-1">Salary Range</div>
            <div className="font-bold text-slate-900">{job.salary}</div>
          </div>
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <BarChart3 className="h-6 w-6 text-amber-600 mx-auto mb-3" />
            <div className="text-sm text-slate-500 mb-1">Market Demand</div>
            <div className="font-bold text-slate-900">High Growth</div>
          </div>
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <Clock className="h-6 w-6 text-amber-600 mx-auto mb-3" />
            <div className="text-sm text-slate-500 mb-1">Time to Hire</div>
            <div className="font-bold text-slate-900">6 Months</div>
          </div>
        </div>

        <button 
          onClick={() => navigate('dashboard')}
          className="bg-slate-900 text-white px-12 py-5 rounded-2xl text-lg font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 flex items-center justify-center mx-auto group"
        >
          View Your Roadmap <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
}

function DirectoryView({ navigate, user, profile, setProfile }: { navigate: (v: View) => void, user: any, profile: UserProfile | null, setProfile: any }) {
  const [selectedJob, setSelectedJob] = useState<JobProfile | null>(null);
  const [search, setSearch] = useState('');

  const filteredJobs = useMemo(() => {
    return CAREER_DIRECTORY.filter(j => 
      j.title.toLowerCase().includes(search.toLowerCase()) || 
      j.skills.some(s => s.toLowerCase().includes(search.toLowerCase()))
    );
  }, [search]);

  const handleSaveRoadmap = async () => {
    if (!selectedJob) return;
    if (!user) {
      localStorage.setItem('pendingJobId', selectedJob.id);
      navigate('auth');
      return;
    }
    
    if (profile) {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { matchedJobId: selectedJob.id });
      setProfile({ ...profile, matchedJobId: selectedJob.id });
      navigate('dashboard');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-bold font-serif text-slate-900 mb-4">Career Directory</h1>
          <p className="text-slate-600">Explore the most in-demand roles in the tech industry today.</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
          <input 
            type="text" 
            placeholder="Search roles or skills..." 
            className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-amber-500 shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredJobs.map((job) => (
          <motion.div 
            key={job.id}
            layoutId={job.id}
            onClick={() => setSelectedJob(job)}
            className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-amber-200 transition-all cursor-pointer group"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-amber-50 rounded-xl text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                {job.id.includes('dev') ? <Code className="h-6 w-6" /> : job.id.includes('data') ? <Database className="h-6 w-6" /> : <Shield className="h-6 w-6" />}
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{job.salary}</span>
            </div>
            <h3 className="text-2xl font-bold font-serif text-slate-900 mb-4">{job.title}</h3>
            <p className="text-slate-500 text-sm line-clamp-3 mb-6 leading-relaxed">{job.description}</p>
            <div className="flex flex-wrap gap-2">
              {job.skills.slice(0, 3).map((skill, i) => (
                <span key={i} className="px-3 py-1 bg-slate-50 text-slate-600 text-[10px] font-bold rounded-full border border-slate-100 uppercase tracking-wider">{skill}</span>
              ))}
              {job.skills.length > 3 && <span className="text-[10px] font-bold text-slate-400">+{job.skills.length - 3} more</span>}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedJob && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setSelectedJob(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            ></motion.div>
            <motion.div 
              layoutId={selectedJob.id}
              className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl"
            >
              <button onClick={() => setSelectedJob(null)} className="absolute top-6 right-6 p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors z-10">
                <X className="h-5 w-5 text-slate-600" />
              </button>

              <div className="p-8 md:p-12">
                <div className="flex flex-col md:flex-row gap-12">
                  <div className="flex-1">
                    <span className="inline-block py-1 px-3 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-widest mb-6">Career Profile</span>
                    <h2 className="text-4xl font-bold font-serif text-slate-900 mb-6">{selectedJob.title}</h2>
                    <p className="text-slate-600 mb-8 leading-relaxed">{selectedJob.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="text-xs text-slate-400 font-bold uppercase mb-1">Salary Range</div>
                        <div className="font-bold text-slate-900">{selectedJob.salary}</div>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="text-xs text-slate-400 font-bold uppercase mb-1">Industry Demand</div>
                        <div className="font-bold text-slate-900">High Growth</div>
                      </div>
                    </div>

                    <h4 className="text-lg font-bold font-serif mb-4">Skill Breakdown</h4>
                    <div className="space-y-4 mb-8">
                      {selectedJob.skillBreakdown?.map((skill, i) => (
                        <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-bold text-slate-900">{skill.name}</span>
                            <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full ${
                              skill.level === 'Core' ? 'bg-amber-100 text-amber-700' :
                              skill.level === 'Intermediate' ? 'bg-blue-100 text-blue-700' :
                              'bg-purple-100 text-purple-700'
                            }`}>{skill.level}</span>
                          </div>
                          <p className="text-xs text-slate-500 mb-3 leading-relaxed">{skill.importance}</p>
                          <a href={skill.resource.url} target="_blank" rel="noreferrer" className="inline-flex items-center text-[10px] font-bold text-amber-600 hover:text-amber-700">
                            {skill.resource.title} <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        </div>
                      ))}
                    </div>

                    <h4 className="text-lg font-bold font-serif mb-4">Job Portals (Google Search)</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                      {[
                        { name: 'Fiverr', url: `https://www.google.com/search?q=freelance+${selectedJob.title.replace(/ /g, '+')}+gigs+fiverr` },
                        { name: 'Glassdoor', url: `https://www.google.com/search?q=${selectedJob.title.replace(/ /g, '+')}+salary+glassdoor` },
                        { name: 'Indeed', url: `https://www.google.com/search?q=${selectedJob.title.replace(/ /g, '+')}+jobs+indeed+remote` },
                        { name: 'LinkedIn', url: `https://www.google.com/search?q=${selectedJob.title.replace(/ /g, '+')}+jobs+linkedin` },
                      ].map((portal) => (
                        <a 
                          key={portal.name}
                          href={portal.url} 
                          target="_blank" 
                          rel="noreferrer"
                          className="flex items-center justify-center p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-amber-500 hover:text-white hover:border-amber-500 transition-all"
                        >
                          {portal.name}
                        </a>
                      ))}
                    </div>
                  </div>

                  <div className="w-full md:w-80 space-y-8">
                    <button 
                      onClick={handleSaveRoadmap}
                      className="w-full bg-amber-500 text-white py-4 rounded-2xl font-bold hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/30 flex items-center justify-center"
                    >
                      <Target className="h-5 w-5 mr-2" /> Save Roadmap
                    </button>

                    <div className="p-6 bg-slate-900 text-white rounded-2xl">
                      <h4 className="font-bold font-serif mb-4 flex items-center"><Award className="h-5 w-5 mr-2 text-amber-500" /> Interview Prep</h4>
                      <ul className="space-y-3 text-sm text-slate-400">
                        {selectedJob.interviewPrep.map((tip, i) => (
                          <li key={i} className="flex items-start">
                            <CheckCircle2 className="h-4 w-4 mr-2 text-amber-500 shrink-0 mt-0.5" />
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-bold font-serif mb-4">Learning Resources</h4>
                      <div className="space-y-3">
                        {selectedJob.resources.map((res, i) => (
                          <a 
                            key={i} 
                            href={res.url} 
                            target="_blank" 
                            rel="noreferrer"
                            className="flex items-center p-3 bg-white border border-slate-100 rounded-xl hover:border-amber-500 transition-all group"
                          >
                            <BookOpen className="h-4 w-4 mr-3 text-slate-400 group-hover:text-amber-500" />
                            <span className="text-xs font-medium text-slate-600 group-hover:text-amber-700 truncate">{res.title}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Dashboard View ---

function DashboardView({ navigate, user, profile, setProfile }: { navigate: (v: View) => void, user: any, profile: UserProfile | null, setProfile: any }) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [newTodoPriority, setNewTodoPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [showAppForm, setShowAppForm] = useState(false);
  const [newAppCompany, setNewAppCompany] = useState('');
  const [newAppRole, setNewAppRole] = useState('');

  const job = useMemo(() => {
    return CAREER_DIRECTORY.find(j => j.id === profile?.matchedJobId) || CAREER_DIRECTORY[0];
  }, [profile]);

  // Real-time Todos
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'users', user.uid, 'todos'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snap) => {
      setTodos(snap.docs.map(d => ({ id: d.id, ...d.data() } as Todo)));
    });
  }, [user]);

  // Real-time Applications
  useEffect(() => {
    if (!user) return;
    const q = collection(db, 'users', user.uid, 'applications');
    return onSnapshot(q, (snap) => {
      setApplications(snap.docs.map(d => ({ id: d.id, ...d.data() } as Application)));
    });
  }, [user]);

  // Check badges
  useEffect(() => {
    if (!user || !profile) return;
    
    const newBadges = [...(profile.badges || [])];
    let changed = false;

    if (profile.milestones.projects && !newBadges.includes('Project Master')) {
      newBadges.push('Project Master');
      changed = true;
    }

    if (applications.length >= 10 && !newBadges.includes('Application Ace')) {
      newBadges.push('Application Ace');
      changed = true;
    }

    const completedTodos = todos.filter(t => t.completed).length;
    if (completedTodos >= 5 && !newBadges.includes('Task Ninja')) {
      newBadges.push('Task Ninja');
      changed = true;
    }

    if (changed) {
      updateDoc(doc(db, 'users', user.uid), { badges: newBadges });
      setProfile({ ...profile, badges: newBadges });
    }
  }, [profile?.milestones, applications.length, todos, user]);

  const toggleMilestone = async (key: string) => {
    if (!user || !profile) return;
    const newValue = !profile.milestones[key];
    const newMilestones = { ...profile.milestones, [key]: newValue };
    const newPoints = (profile.points || 0) + (newValue ? 50 : -50);
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, { milestones: newMilestones, points: newPoints });
    setProfile({ ...profile, milestones: newMilestones, points: newPoints });
  };

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim() || !user) return;
    await addDoc(collection(db, 'users', user.uid, 'todos'), {
      text: newTodo,
      priority: newTodoPriority,
      completed: false,
      createdAt: new Date()
    });
    setNewTodo('');
  };

  const toggleTodo = async (id: string, completed: boolean) => {
    if (!user) return;
    const newValue = !completed;
    await updateDoc(doc(db, 'users', user.uid, 'todos', id), { completed: newValue });
    if (profile) {
      const newPoints = (profile.points || 0) + (newValue ? 10 : -10);
      await updateDoc(doc(db, 'users', user.uid), { points: newPoints });
      setProfile({ ...profile, points: newPoints });
    }
  };

  const deleteTodo = async (id: string) => {
    if (!user) return;
    await deleteDoc(doc(db, 'users', user.uid, 'todos', id));
  };

  const addApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newAppCompany.trim() || !newAppRole.trim()) return;
    await addDoc(collection(db, 'users', user.uid, 'applications'), {
      company: newAppCompany,
      role: newAppRole,
      status: 'Applied'
    });
    setNewAppCompany('');
    setNewAppRole('');
    setShowAppForm(false);
    if (profile) {
      const newPoints = (profile.points || 0) + 20;
      await updateDoc(doc(db, 'users', user.uid), { points: newPoints });
      setProfile({ ...profile, points: newPoints });
    }
  };

  const cycleStatus = async (id: string, current: string) => {
    if (!user) return;
    const statuses: Application['status'][] = ['Applied', 'Interview', 'Offer', 'Rejected'];
    const next = statuses[(statuses.indexOf(current as any) + 1) % statuses.length];
    await updateDoc(doc(db, 'users', user.uid, 'applications', id), { status: next });
  };

  const deleteApplication = async (id: string) => {
    if (!user) return;
    await deleteDoc(doc(db, 'users', user.uid, 'applications', id));
  };

  const milestones = [
    { key: 'discovery', label: 'Discovery', time: 'Day 1', desc: 'Find your career goal' },
    { key: 'skills', label: 'Skills', time: 'Month 1-3', desc: 'Core skill acquisition' },
    { key: 'projects', label: 'Projects', time: 'Month 2-4', desc: 'Build your portfolio' },
    { key: 'docs', label: 'Docs', time: 'Month 4-5', desc: 'CV & Portfolio prep' },
    { key: 'apply', label: 'Apply', time: 'Month 5-6', desc: 'Start job applications' },
    { key: 'hired', label: 'Hired', time: 'Goal', desc: 'Land your dream job' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold font-serif text-slate-900 mb-2">Welcome back, {profile?.fullName || 'Explorer'}</h1>
          <p className="text-slate-600">You're on your way to becoming a <span className="text-amber-600 font-bold">{job.title}</span>.</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Points</div>
            <div className="text-lg font-bold text-amber-500">{profile?.points || 0} XP</div>
          </div>
          <div className="text-right hidden sm:block">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Overall Progress</div>
            <div className="text-lg font-bold text-slate-900">{Math.round((Object.values(profile?.milestones || {}).filter(Boolean).length / 6) * 100)}%</div>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center border border-amber-100 relative">
            <TrendingUp className="text-amber-600 h-8 w-8" />
            {profile?.badges && profile.badges.length > 0 && (
              <div className="absolute -top-2 -right-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                {profile.badges.length}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Heartbeat Roadmap */}
      <section className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-100 mb-12 overflow-hidden">
        <h2 className="text-2xl font-bold font-serif mb-8 flex items-center">
          <Award className="h-6 w-6 mr-2 text-amber-500" /> 6-Month Heartbeat Roadmap
        </h2>
        
        <div className="relative h-64 md:h-80 w-full mb-12">
          <svg viewBox="0 0 1000 300" className="w-full h-full overflow-visible">
            {/* Heartbeat Line */}
            <motion.path 
              d="M0,250 L100,250 L130,100 L160,280 L190,250 L300,200 L330,50 L360,230 L390,200 L500,150 L530,20 L560,200 L590,150 L700,100 L730,10 L760,150 L790,100 L900,50 L1000,50"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <motion.path 
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
              d="M0,250 L100,250 L130,100 L160,280 L190,250 L300,200 L330,50 L360,230 L390,200 L500,150 L530,20 L560,200 L590,150 L700,100 L730,10 L760,150 L790,100 L900,50 L1000,50"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="4"
              strokeLinecap="round"
              className="opacity-30"
            />

            {/* Milestone Nodes */}
            {milestones.map((m, i) => {
              const x = 100 + (i * 160);
              const y = 250 - (i * 40);
              const isDone = profile?.milestones[m.key];
              
              return (
                <g key={m.key} className="cursor-pointer" onClick={() => toggleMilestone(m.key)}>
                  <motion.circle 
                    cx={x} cy={y} r="12"
                    fill={isDone ? "#10b981" : "#fff"}
                    stroke={isDone ? "#10b981" : "#cbd5e1"}
                    strokeWidth="4"
                    whileHover={{ scale: 1.2 }}
                  />
                  {isDone && (
                    <motion.path 
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      d={`M${x-4},${y} L${x-1},${y+3} L${x+4},${y-3}`}
                      fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"
                    />
                  )}
                  <text x={x} y={y + 35} textAnchor="middle" className="text-[10px] font-bold fill-slate-400 uppercase tracking-widest">{m.time}</text>
                  <text x={x} y={y - 25} textAnchor="middle" className={`text-xs font-bold ${isDone ? 'fill-emerald-600' : 'fill-slate-900'}`}>{m.label}</text>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {milestones.map((m) => (
            <div 
              key={m.key} 
              onClick={() => toggleMilestone(m.key)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${profile?.milestones[m.key] ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-100 hover:border-amber-200'}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{m.time}</span>
                {profile?.milestones[m.key] ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <Circle className="h-4 w-4 text-slate-300" />}
              </div>
              <div className="font-bold text-slate-900 text-sm mb-1">{m.label}</div>
              <div className="text-[10px] text-slate-500 leading-tight">{m.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Resources & Tracker */}
        <div className="lg:col-span-2 space-y-12">
          {/* Skill Marathon */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold font-serif flex items-center"><BookOpen className="h-6 w-6 mr-2 text-amber-500" /> Skill Marathon</h2>
              <button onClick={() => navigate('directory')} className="text-xs font-bold text-amber-600 hover:underline">View All Resources</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {job.resources.map((res, i) => (
                <a 
                  key={i} 
                  href={res.url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-amber-200 transition-all flex items-center group"
                >
                  <div className="bg-slate-50 p-3 rounded-xl mr-4 group-hover:bg-amber-50 transition-colors">
                    <Globe className="h-5 w-5 text-slate-400 group-hover:text-amber-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-slate-900 truncate">{res.title}</div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Free Resource</div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-slate-300 group-hover:text-amber-500 ml-2" />
                </a>
              ))}
            </div>
          </section>

          {/* Application Tracker */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold font-serif flex items-center"><Briefcase className="h-6 w-6 mr-2 text-amber-500" /> Application Tracker</h2>
              <button onClick={() => setShowAppForm(!showAppForm)} className="flex items-center text-xs font-bold bg-slate-900 text-white px-4 py-2 rounded-xl hover:bg-slate-800 transition-colors">
                {showAppForm ? 'Cancel' : <><Plus className="h-4 w-4 mr-1" /> Add Job</>}
              </button>
            </div>
            
            {showAppForm && (
              <form onSubmit={addApplication} className="mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row gap-3">
                <input 
                  type="text" 
                  placeholder="Company Name" 
                  className="flex-1 bg-white border border-slate-200 rounded-xl py-2 px-4 text-sm focus:outline-none focus:border-amber-500"
                  value={newAppCompany}
                  onChange={(e) => setNewAppCompany(e.target.value)}
                  required
                />
                <input 
                  type="text" 
                  placeholder="Role" 
                  className="flex-1 bg-white border border-slate-200 rounded-xl py-2 px-4 text-sm focus:outline-none focus:border-amber-500"
                  value={newAppRole}
                  onChange={(e) => setNewAppRole(e.target.value)}
                  required
                />
                <button type="submit" className="bg-amber-500 text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-amber-600 transition-colors">
                  Save
                </button>
              </form>
            )}

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Company</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Role</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {applications.length > 0 ? applications.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-900 text-sm">{app.company}</td>
                      <td className="px-6 py-4 text-slate-600 text-sm">{app.role}</td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => cycleStatus(app.id, app.status)}
                          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                            app.status === 'Offer' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                            app.status === 'Interview' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                            app.status === 'Rejected' ? 'bg-red-50 text-red-600 border-red-100' :
                            'bg-slate-50 text-slate-600 border-slate-200'
                          }`}
                        >
                          {app.status}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => deleteApplication(app.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-slate-400 text-sm italic">No applications tracked yet. Start applying!</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Right Column: Todo List */}
        <div className="space-y-12">
          <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <h2 className="text-2xl font-bold font-serif mb-6 flex items-center"><Layout className="h-6 w-6 mr-2 text-amber-500" /> Daily Tasks</h2>
            
            <form onSubmit={addTodo} className="mb-6 space-y-3">
              <input 
                type="text" 
                placeholder="What needs to be done?" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-amber-500"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
              />
              <div className="flex gap-2">
                {(['High', 'Medium', 'Low'] as const).map((p) => (
                  <button 
                    key={p}
                    type="button"
                    onClick={() => setNewTodoPriority(p)}
                    className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest border transition-all ${
                      newTodoPriority === p ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <button type="submit" className="w-full bg-amber-500 text-white py-3 rounded-xl font-bold hover:bg-amber-600 transition-all flex items-center justify-center">
                <Plus className="h-4 w-4 mr-1" /> Add Task
              </button>
            </form>

            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {todos.length > 0 ? todos.map((todo) => (
                <div key={todo.id} className="group flex items-center p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-amber-200 transition-all">
                  <button onClick={() => toggleTodo(todo.id, todo.completed)} className="mr-3 shrink-0">
                    {todo.completed ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : <Circle className="h-5 w-5 text-slate-300" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-medium truncate ${todo.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{todo.text}</div>
                    <div className={`text-[8px] font-bold uppercase tracking-widest mt-1 ${
                      todo.priority === 'High' ? 'text-red-500' : todo.priority === 'Medium' ? 'text-amber-500' : 'text-blue-500'
                    }`}>
                      {todo.priority} Priority
                    </div>
                  </div>
                  <button onClick={() => deleteTodo(todo.id)} className="ml-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )) : (
                <div className="text-center py-8 text-slate-400 text-xs italic">All caught up! Add a task to stay productive.</div>
              )}
            </div>
          </section>

          {/* Project Ideas */}
          <section className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl">
            <h2 className="text-xl font-bold font-serif mb-6 flex items-center"><Cpu className="h-5 w-5 mr-2 text-amber-500" /> Suggested Projects</h2>
            <div className="space-y-6">
              {job.projects.map((proj, i) => (
                <div key={i} className="relative pl-6 border-l-2 border-slate-700">
                  <div className="absolute left-[-5px] top-0 w-2 h-2 rounded-full bg-amber-500"></div>
                  <h4 className="text-sm font-bold mb-1">{proj.title}</h4>
                  <p className="text-xs text-slate-400 mb-3 leading-relaxed">{proj.description}</p>
                  <a href={proj.url} target="_blank" rel="noreferrer" className="inline-flex items-center text-[10px] font-bold text-amber-500 hover:text-amber-400">
                    View Guide <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

// --- Profile, Blog, About Views ---

function ProfileView({ navigate, user, profile, setProfile, handleLogout }: { navigate: (v: View) => void, user: any, profile: UserProfile | null, setProfile: any, handleLogout: () => void }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: profile?.fullName || '',
    username: profile?.username || '',
    education: profile?.education || 'BSc',
    country: profile?.country || '',
    cvLink: profile?.cvLink || '',
    socialLinks: profile?.socialLinks || [],
    documents: profile?.documents || []
  });

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, formData);
    setProfile({ ...profile, ...formData });
    setIsEditing(false);
  };

  const addSocialLink = () => {
    setFormData({
      ...formData,
      socialLinks: [...formData.socialLinks, { platform: 'LinkedIn', url: '' }]
    });
  };

  const updateSocialLink = (index: number, field: string, value: string) => {
    const newLinks = [...formData.socialLinks];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setFormData({ ...formData, socialLinks: newLinks });
  };

  const removeSocialLink = (index: number) => {
    const newLinks = formData.socialLinks.filter((_, i) => i !== index);
    setFormData({ ...formData, socialLinks: newLinks });
  };

  const addDocument = () => {
    setFormData({
      ...formData,
      documents: [...formData.documents, { title: 'New Document', url: '' }]
    });
  };

  const updateDocument = (index: number, field: string, value: string) => {
    const newDocs = [...formData.documents];
    newDocs[index] = { ...newDocs[index], [field]: value };
    setFormData({ ...formData, documents: newDocs });
  };

  const removeDocument = (index: number) => {
    const newDocs = formData.documents.filter((_, i) => i !== index);
    setFormData({ ...formData, documents: newDocs });
  };

  const job = CAREER_DIRECTORY.find(j => j.id === profile?.matchedJobId) || CAREER_DIRECTORY[0];

  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="h-32 bg-slate-900 relative">
          <div className="absolute -bottom-12 left-8">
            <div className="w-24 h-24 bg-amber-500 rounded-2xl border-4 border-white flex items-center justify-center shadow-lg">
              <User className="text-white h-12 w-12" />
            </div>
          </div>
        </div>
        
        <div className="pt-16 pb-8 px-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold font-serif text-slate-900">{profile?.fullName || 'Guest User'}</h1>
              <p className="text-slate-500">@{profile?.username || 'guest'}</p>
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className="px-6 py-2 border-2 border-slate-200 rounded-xl text-sm font-bold hover:border-amber-500 hover:text-amber-600 transition-all"
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
              <button 
                onClick={handleLogout}
                className="px-6 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-bold hover:bg-red-100 transition-all flex items-center"
              >
                <LogOut className="h-4 w-4 mr-2" /> Logout
              </button>
            </div>
          </div>

          {isEditing ? (
            <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase">Full Name</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-amber-500"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase">Education</label>
                <select 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-amber-500"
                  value={formData.education}
                  onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                >
                  <option value="12th">12th Grade</option>
                  <option value="BSc">BSc</option>
                  <option value="MSc">MSc</option>
                  <option value="PhD">PhD</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase">Country</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-amber-500"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase">CV Link (Google Drive)</label>
                <input 
                  type="url" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-amber-500"
                  value={formData.cvLink}
                  onChange={(e) => setFormData({ ...formData, cvLink: e.target.value })}
                  placeholder="https://drive.google.com/..."
                />
              </div>

              {/* Additional Documents */}
              <div className="md:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-400 uppercase">Additional Documents</label>
                  <button type="button" onClick={addDocument} className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center">
                    <Plus className="h-3 w-3 mr-1" /> Add Document
                  </button>
                </div>
                {formData.documents.map((doc, index) => (
                  <div key={index} className="flex gap-3">
                    <input 
                      type="text" 
                      placeholder="Title (e.g., Portfolio)" 
                      className="w-1/3 bg-slate-50 border border-slate-200 rounded-xl py-2 px-4 text-sm focus:outline-none focus:border-amber-500"
                      value={doc.title}
                      onChange={(e) => updateDocument(index, 'title', e.target.value)}
                    />
                    <input 
                      type="url" 
                      placeholder="URL" 
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl py-2 px-4 text-sm focus:outline-none focus:border-amber-500"
                      value={doc.url}
                      onChange={(e) => updateDocument(index, 'url', e.target.value)}
                    />
                    <button type="button" onClick={() => removeDocument(index)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Social Links */}
              <div className="md:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-400 uppercase">Social Links</label>
                  <button type="button" onClick={addSocialLink} className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center">
                    <Plus className="h-3 w-3 mr-1" /> Add Link
                  </button>
                </div>
                {formData.socialLinks.map((link, index) => (
                  <div key={index} className="flex gap-3">
                    <select 
                      className="w-1/3 bg-slate-50 border border-slate-200 rounded-xl py-2 px-4 text-sm focus:outline-none focus:border-amber-500"
                      value={link.platform}
                      onChange={(e) => updateSocialLink(index, 'platform', e.target.value)}
                    >
                      <option value="LinkedIn">LinkedIn</option>
                      <option value="GitHub">GitHub</option>
                      <option value="Twitter">Twitter / X</option>
                      <option value="Portfolio">Portfolio</option>
                      <option value="Other">Other</option>
                    </select>
                    <input 
                      type="url" 
                      placeholder="URL" 
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl py-2 px-4 text-sm focus:outline-none focus:border-amber-500"
                      value={link.url}
                      onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                    />
                    <button type="button" onClick={() => removeSocialLink(index)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="md:col-span-2">
                <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all">Save Changes</button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-8">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Education</div>
                    <div className="font-bold text-slate-900">{profile?.education || 'Not Set'}</div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Country</div>
                    <div className="font-bold text-slate-900">{profile?.country || 'Not Set'}</div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold font-serif mb-4">Career Goal</h3>
                  <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-amber-600 uppercase mb-1">Target Role</div>
                      <div className="text-xl font-bold text-slate-900">{job.title}</div>
                    </div>
                    <button onClick={() => navigate('directory')} className="p-2 bg-white rounded-xl text-amber-600 hover:bg-amber-500 hover:text-white transition-all shadow-sm">
                      <ArrowRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold font-serif">Documents</h3>
                    <button onClick={() => setIsEditing(true)} className="text-xs font-bold text-amber-600 hover:underline flex items-center">
                      <Plus className="h-3 w-3 mr-1" /> Add More
                    </button>
                  </div>
                  <div className="space-y-3">
                    {profile?.cvLink && (
                      <a 
                        href={profile.cvLink} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center p-4 bg-white border border-slate-200 rounded-2xl hover:border-amber-500 transition-all group"
                      >
                        <FileText className="h-6 w-6 mr-4 text-slate-400 group-hover:text-amber-500" />
                        <div className="flex-1">
                          <div className="text-sm font-bold text-slate-900">Curriculum Vitae</div>
                          <div className="text-xs text-slate-500">Google Drive Link</div>
                        </div>
                        <ExternalLink className="h-4 w-4 text-slate-300 group-hover:text-amber-500" />
                      </a>
                    )}
                    
                    {profile?.documents?.map((doc, i) => (
                      <a 
                        key={i}
                        href={doc.url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center p-4 bg-white border border-slate-200 rounded-2xl hover:border-amber-500 transition-all group"
                      >
                        <FileText className="h-6 w-6 mr-4 text-slate-400 group-hover:text-amber-500" />
                        <div className="flex-1">
                          <div className="text-sm font-bold text-slate-900">{doc.title}</div>
                          <div className="text-xs text-slate-500">External Link</div>
                        </div>
                        <ExternalLink className="h-4 w-4 text-slate-300 group-hover:text-amber-500" />
                      </a>
                    ))}

                    {!profile?.cvLink && (!profile?.documents || profile.documents.length === 0) && (
                      <div className="p-8 border-2 border-dashed border-slate-200 rounded-2xl text-center">
                        <FileText className="h-8 w-8 text-slate-300 mx-auto mb-3" />
                        <p className="text-sm text-slate-500 mb-4">No documents uploaded yet.</p>
                        <button onClick={() => setIsEditing(true)} className="text-xs font-bold text-amber-600 hover:underline">Add Documents</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold font-serif">Social Links</h4>
                    <button onClick={() => setIsEditing(true)} className="text-xs font-bold text-amber-600 hover:underline">Edit</button>
                  </div>
                  <div className="space-y-3">
                    {profile?.socialLinks && profile.socialLinks.length > 0 ? (
                      profile.socialLinks.map((link, i) => (
                        <a 
                          key={i}
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                          className="w-full flex items-center p-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-600 hover:border-amber-500 transition-all group"
                        >
                          {link.platform === 'LinkedIn' ? <Linkedin className="h-4 w-4 mr-3 text-slate-400 group-hover:text-amber-500" /> :
                           link.platform === 'GitHub' ? <Github className="h-4 w-4 mr-3 text-slate-400 group-hover:text-amber-500" /> :
                           link.platform === 'Twitter' ? <Twitter className="h-4 w-4 mr-3 text-slate-400 group-hover:text-amber-500" /> :
                           <Globe className="h-4 w-4 mr-3 text-slate-400 group-hover:text-amber-500" />}
                          {link.platform}
                          <ExternalLink className="h-3 w-3 ml-auto text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                      ))
                    ) : (
                      <div className="text-center py-4 text-xs text-slate-400 italic">No social links added yet.</div>
                    )}
                  </div>
                </div>

                <div className="p-6 bg-slate-900 text-white rounded-2xl shadow-xl">
                  <div className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-2">Milestone Progress</div>
                  <div className="text-3xl font-bold mb-4">{Math.round((Object.values(profile?.milestones || {}).filter(Boolean).length / 6) * 100)}%</div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-6">
                    <div 
                      className="bg-amber-500 h-full" 
                      style={{ width: `${(Object.values(profile?.milestones || {}).filter(Boolean).length / 6) * 100}%` }}
                    ></div>
                  </div>
                  
                  <div className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-2">Gamification</div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-slate-400">Total Points</span>
                    <span className="text-xl font-bold text-amber-500">{profile?.points || 0} XP</span>
                  </div>
                  <div className="space-y-2">
                    <span className="text-sm text-slate-400 block mb-2">Earned Badges</span>
                    {profile?.badges && profile.badges.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {profile.badges.map((badge, i) => (
                          <span key={i} className="px-3 py-1 bg-slate-800 text-amber-500 border border-slate-700 rounded-full text-xs font-bold flex items-center">
                            <Award className="h-3 w-3 mr-1" /> {badge}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-slate-500 italic">Complete tasks to earn badges!</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function BlogView() {
  const [selectedPost, setSelectedPost] = useState<typeof BLOG_POSTS[0] | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold font-serif text-slate-900 mb-4">Career Insights</h1>
        <p className="text-slate-600 max-w-2xl mx-auto">Expert advice and industry trends to help you navigate your tech career journey.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {BLOG_POSTS.map((post) => (
          <motion.div 
            key={post.id}
            whileHover={{ y: -5 }}
            className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col"
          >
            <div className="h-48 bg-slate-200 relative">
              <LazyImage 
                src={`https://picsum.photos/seed/blog-${post.id}/800/600`} 
                alt={post.title} 
                className="w-full h-full"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-slate-900 uppercase tracking-widest">
                {post.date}
              </div>
            </div>
            <div className="p-8 flex-1 flex flex-col">
              <h3 className="text-xl font-bold font-serif text-slate-900 mb-4 leading-tight">{post.title}</h3>
              <p className="text-slate-500 text-sm mb-6 flex-1">{post.excerpt}</p>
              <button 
                onClick={() => setSelectedPost(post)}
                className="text-amber-600 font-bold text-sm flex items-center hover:text-amber-700 transition-colors"
              >
                Read Article <ChevronRight className="ml-1 h-4 w-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedPost && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedPost(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            ></motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="relative bg-white w-full max-w-3xl max-h-[80vh] overflow-y-auto rounded-3xl shadow-2xl p-8 md:p-12"
            >
              <button onClick={() => setSelectedPost(null)} className="absolute top-6 right-6 p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors">
                <X className="h-5 w-5 text-slate-600" />
              </button>
              <div className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-4">{selectedPost.date}</div>
              <h2 className="text-3xl font-bold font-serif text-slate-900 mb-8">{selectedPost.title}</h2>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-600 leading-relaxed text-lg">{selectedPost.content}</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AboutView() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32">
        <div>
          <span className="inline-block py-1 px-3 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-widest mb-6">Our Mission</span>
          <h1 className="text-5xl font-bold font-serif text-slate-900 mb-8 leading-tight">We're here to help you <br /> <span className="text-amber-500">find your gap.</span></h1>
          <p className="text-lg text-slate-600 leading-relaxed mb-8">
            Your SkillGAP was founded with a simple goal: to make the transition into tech careers accessible, structured, and data-driven. We believe that everyone has a unique path, and our tools are designed to help you discover yours.
          </p>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <div className="text-3xl font-bold text-slate-900 mb-2">2024</div>
              <div className="text-sm text-slate-500">Founded</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900 mb-2">100%</div>
              <div className="text-sm text-slate-500">Free Forever</div>
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl"></div>
          <LazyImage 
            src="https://picsum.photos/seed/team/1200/800" 
            alt="Our Team" 
            className="rounded-3xl shadow-2xl relative z-10 w-full aspect-video"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      <div className="bg-slate-900 rounded-[3rem] p-12 md:p-20 text-white">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold font-serif mb-6">Get In Touch</h2>
          <p className="text-slate-400">Have questions or want to collaborate? We'd love to hear from you.</p>
        </div>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase">Full Name</label>
            <input type="text" className="w-full bg-slate-800 border border-slate-700 rounded-xl py-4 px-6 focus:outline-none focus:border-amber-500" placeholder="John Doe" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase">Email Address</label>
            <input type="email" className="w-full bg-slate-800 border border-slate-700 rounded-xl py-4 px-6 focus:outline-none focus:border-amber-500" placeholder="john@example.com" />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase">Message</label>
            <textarea className="w-full bg-slate-800 border border-slate-700 rounded-xl py-4 px-6 h-40 focus:outline-none focus:border-amber-500" placeholder="How can we help?"></textarea>
          </div>
          <div className="md:col-span-2">
            <button className="w-full bg-amber-500 text-white py-5 rounded-2xl font-bold hover:bg-amber-600 transition-all shadow-xl shadow-amber-500/20">Send Message</button>
          </div>
        </form>
      </div>
    </div>
  );
}
