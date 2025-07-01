// src/components/TabBar.tsx
import { useState, useEffect, useRef } from 'react'
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app } from '../firebase'; // adjust path if needed
import { useNavigate, useLocation } from 'react-router-dom'
import { HomeIcon, ClipboardIcon, ChartBarIcon, Bars3Icon, UserIcon, EnvelopeIcon } from '@heroicons/react/24/outline'
import { ExclamationCircleIcon } from '@heroicons/react/24/solid';

export default function TabBar() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const tabs = [
    { to: '/', label: 'Home' },
    { to: '/quests', label: 'Quests' },
    { to: '/leaderboard', label: 'Leaderboard' },
    { to: '/profile', label: 'Profile' },
    { to: 'mailto:support@cougarquest.com', label: 'Support' },
  ]

  const auth = getAuth(app);
  const db = getFirestore(app);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (open && menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const [needsProfile, setNeedsProfile] = useState(false);

  useEffect(() => {
    const fetchProfileStatus = async () => {
      const user = auth.currentUser;
      if (!user) {
        setNeedsProfile(false);
        return;
      }
      const userRef = doc(db, 'users', user.uid);
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        const data = snap.data();
        const hasName = typeof data.firstName === 'string' && data.firstName.trim().length > 0;
        const sons = Array.isArray(data.sons) ? data.sons : [];
        setNeedsProfile(!(hasName && sons.length > 0));
      } else {
        setNeedsProfile(true);
      }
    };
    fetchProfileStatus();
  }, [auth, db]);

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem',
          backgroundColor: '#FFFFFF',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
        }}
      >
        <div
          style={{
            fontFamily: 'Inter, ui-sans-serif, system-ui, Arial, sans-serif',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#0047BA',
          }}
        >
          CougarQuest
        </div>

        {/* Overlay to catch outside clicks */}
        {open && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 1000,
            }}
          />
        )}

        {/* Toggleable Menu */}
        <div
          ref={menuRef}
          onClick={() => setOpen(!open)}
          style={{
            position: 'fixed',
            top: '0.6rem',
            right: '1rem',
            backgroundColor: 'rgba(169, 169, 169, 0.65)',
            backdropFilter: 'blur(5px)',
            border: '0.8px solid #0047BA',
            borderRadius: open ? '1.5rem' : '50%',
            width: open ? '10rem' : '2.5rem',
            height: open ? 'auto' : '2.5rem',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: open ? 'column' : 'row',
            alignItems: open ? 'flex-start' : 'center',
            justifyContent: open ? 'flex-start' : 'center',
            padding: open ? '0.5rem' : '0',
            overflow: 'hidden',
            transition: 'all 300ms cubic-bezier(0.175,0.885,0.32,1.275)',
            cursor: 'pointer',
            zIndex: 1001,
          }}
        >
          {open ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem',
                width: '100%',
              }}
            >
              {tabs.map(({ to, label }, i) => (
                <div
                  key={to}
                  onClick={() => {
                    setOpen(false)
                    if (to.startsWith('mailto:')) {
                      window.open(to)
                    } else {
                      navigate(to)
                    }
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0.5rem',
                    paddingRight: '0.5rem',
                    boxSizing: 'border-box',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    width: '100%',
                  }}
                >
                  {i === 0 && (
                    <HomeIcon style={{ width: '1.25rem', height: '1.25rem', color: '#0047BA', marginRight: '0.5rem' }} />
                  )}
                  {i === 1 && (
                    <ClipboardIcon style={{ width: '1.25rem', height: '1.25rem', color: '#0047BA', marginRight: '0.5rem' }} />
                  )}
                  {i === 2 && (
                    <ChartBarIcon style={{ width: '1.25rem', height: '1.25rem', color: '#0047BA', marginRight: '0.5rem' }} />
                  )}
                  {i === 3 && (
                    <UserIcon style={{ width: '1.25rem', height: '1.25rem', color: '#0047BA', marginRight: '0.5rem' }} />
                  )}
                  {i === 4 && (
                    <EnvelopeIcon style={{ width: '1.25rem', height: '1.25rem', color: '#0047BA', marginRight: '0.5rem' }} />
                  )}
                  <span
                    style={{
                      fontFamily: 'Inter, ui-sans-serif, system-ui, Arial, sans-serif',
                      fontSize: '1rem',
                      color: '#000000',
                      fontWeight: location.pathname === to ? 'bold' : 'normal',
                    }}
                  >
                    {label}
                  </span>
                  {i === 3 && needsProfile && (
                    <ExclamationCircleIcon
                      style={{
                        width: '1.2rem',
                        height: '1.2rem',
                        color: 'red',
                        marginLeft: 'auto',
                        marginRight: '-0.35rem'
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <Bars3Icon style={{ width: '1.5rem', height: '1.5rem', color: '#0047BA' }} strokeWidth={2} />
          )}
        </div>
      </div>
    </div>
  )
}