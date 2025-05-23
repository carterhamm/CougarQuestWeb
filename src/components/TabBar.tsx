// src/components/TabBar.tsx
import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { HomeIcon, ClipboardIcon, ChartBarIcon, Bars3Icon, UserIcon } from '@heroicons/react/24/outline'

export default function TabBar() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const tabs = [
    { to: '/', label: 'Home' },
    { to: '/quests', label: 'Quests' },
    { to: '/leaderboard', label: 'Leaderboard' },
    { to: '/profile', label: 'Profile' },
  ]

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
            tabs.map(({ to, label }, i) => (
              <div
                key={to}
                onClick={() => {
                  setOpen(false)
                  navigate(to)
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.5rem',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  marginBottom: i < tabs.length - 1 ? '0.25rem' : 0,
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
              </div>
            ))
          ) : (
            <Bars3Icon style={{ width: '1.5rem', height: '1.5rem', color: '#0047BA' }} strokeWidth={2} />
          )}
        </div>
      </div>
    </div>
  )
}