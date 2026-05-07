import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth } from './firebase';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Continuity from './pages/Continuity';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Support from './pages/Support';
import TabBar from './components/TabBar';
import Quests from './pages/Quests';
import Leaderboard from './pages/Leaderboard';
import Quest from './pages/Quest';
import DesktopNotice from './components/DesktopNotice';
import Loading from './components/Loading';

function App() {
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);
  const isPublicPath = window.location.pathname === '/support';
  if (!isMobile && !isPublicPath) return <DesktopNotice />;
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, u => {
      setUser(u);
      if (initializing) setInitializing(false);
    });
    return unsubscribe;
  }, []);
  if (initializing) {
    return <Loading />;
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/support" element={<Support />} />
        <Route
          path="/*"
          element={
            !user ? (
              <Continuity />
            ) : (
              <div className="flex min-h-screen bg-white">
                <TabBar />
                <div className="flex-1 p-6">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/quest/:id" element={<Quest />} />
                    <Route path="/quests" element={<Quests />} />
                    <Route path="/leaderboard" element={<Leaderboard />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/settings" element={<Settings />} />
                  </Routes>
                </div>
              </div>
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App